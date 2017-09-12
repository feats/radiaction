const { ConsumerGroup } = require('kafka-node');
const { KAFKA_HOST } = require('./config');
const onMessage = require('./onMessage');

for (const key of Object.keys(onMessage)) {
  const consumer = new ConsumerGroup(
    {
      kafkaHost: KAFKA_HOST,
      protocol: ['roundrobin'],
    },
    key,
  );

  consumer.client.on('ready', () => {
    console.log(`Consuming topic '${key}'`);
  });

  consumer.on('error', (err) => {
    throw err;
  });

  consumer.on('message', message => onMessage[key](message.value, message.key));
}
