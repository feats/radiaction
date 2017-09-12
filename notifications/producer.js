const { promisify } = require('util');
const { KafkaClient, HighLevelProducer } = require('kafka-node');
// TODO! consider using https://www.npmjs.com/package/no-kafka instead

const producer = new HighLevelProducer(new KafkaClient()); // TODO! use KAFKA_HOST
producer.send = promisify(producer.send).bind(producer);
producer.on = promisify(producer.on).bind(producer);

module.exports = producer;
