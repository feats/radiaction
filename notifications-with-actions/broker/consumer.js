// TODO! consider using https://www.npmjs.com/package/no-kafka instead
const { ConsumerGroup } = require('kafka-node');
const { KAFKA_HOST } = require('./config');
const supplies = require('../supplies');

for (const key of Object.keys(supplies)) {
  console.log({ key });
  const consumer = new ConsumerGroup(
    {
      kafkaHost: KAFKA_HOST,
      protocol: ['roundrobin'],
    },
    key,
  );

  consumer.client.on('ready', () => {
    console.log(`subscribed to topic '${key}'`);
  });

  consumer.on('error', (err) => {
    throw err;
  });

  consumer.on('message', message => supplies[key](message.value, message.key));
}
