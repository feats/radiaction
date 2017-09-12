// TODO! consider using https://www.npmjs.com/package/no-kafka instead
const { SimpleConsumer, LATEST_OFFSET } = require('no-kafka');
const supplies = require('../supplies');

for (const key of Object.keys(supplies)) {
  const consumer = new SimpleConsumer();
  consumer.init().then(() => {
    consumer.subscribe(key, 0, { time: LATEST_OFFSET }, (messageSet, topic, partition) => {
      messageSet.forEach((m) => {
        // console.log(
        //   topic,
        //   partition,
        //   m.offset,
        //   m.message.key && m.message.key.toString('utf8'),
        //   m.message.value && m.message.value.toString('utf8'),
        // );
        supplies[key](
          m.message.value.toString('utf8'),
          m.message.key && m.message.key.toString('utf8'),
        );
      });
    });
  });
}
