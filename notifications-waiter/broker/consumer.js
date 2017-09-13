const { Producer, SimpleConsumer, LATEST_OFFSET } = require('no-kafka');
const supplies = require('../supplies');
const { RESULT_SUFFIX } = require('./config');

const producer = new Producer();
producer.init();

for (const key of Object.keys(supplies)) {
  const consumer = new SimpleConsumer();
  consumer.init().then(() => {
    consumer.subscribe(key, 0, { time: LATEST_OFFSET }, (messageSet, topic, partition) => {
      messageSet.forEach(async (m) => {
        // console.log(
        //   topic,
        //   partition,
        //   m.offset,
        //   m.message.key && m.message.key.toString('utf8'),
        //   m.message.value && m.message.value.toString('utf8'),
        // );
        const result = await supplies[key](
          m.message.value.toString('utf8'),
          m.message.key && m.message.key.toString('utf8'),
        );

        await producer.send({
          topic: `${key}${RESULT_SUFFIX}`,
          partition,
          message: {
            value: result || '',
            key: m.offset,
          },
        });
      });
    });
  });
}
