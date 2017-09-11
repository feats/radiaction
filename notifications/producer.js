const { promisify } = require('util');
const { KafkaClient, HighLevelProducer } = require('kafka-node');

const producer = new HighLevelProducer(new KafkaClient()); // TODO! configure kafkaHost to use ENV vars
producer.send = promisify(producer.send).bind(producer);
producer.on = promisify(producer.on).bind(producer);

module.exports = producer;
