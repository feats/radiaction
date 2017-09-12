const { promisify } = require('util');
// TODO! consider using https://www.npmjs.com/package/no-kafka instead
const { KafkaClient, HighLevelProducer } = require('kafka-node');
const topicfy = require('./topicfy');

const producer = new HighLevelProducer(new KafkaClient()); // TODO! use KAFKA_HOST from ./config
producer.send = promisify(producer.send).bind(producer);
producer.on = promisify(producer.on).bind(producer);

producer.wrap = (action) => {
  const newAction = async (...args) =>
    await producer.send([
      {
        topic: newAction.name,
        messages: action.apply(action, args),
      },
    ]);

  Object.defineProperty(newAction, 'name', { value: topicfy(action) });
  newAction.toString = () => newAction.name;
  return newAction;
};

module.exports = producer;
