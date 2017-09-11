const { ConsumerGroup } = require('kafka-node');
const topics = require('./topics');
const onMessage = require('./onMessage');

const kafkaHost = 'localhost:9092';
const consumer = new ConsumerGroup(
  {
    kafkaHost, // TODO! configure kafkaHost to use ENV vars
    protocol: ['roundrobin'],
  },
  Object.values(topics),
);

consumer.client.on('ready', () => {
  console.log(`Consuming topics: ${Object.values(topics)}`);
});

consumer.on('error', (err) => {
  throw err;
});

consumer.on('message', onMessage);
