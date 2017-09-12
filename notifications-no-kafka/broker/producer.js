const { Producer } = require('no-kafka');
const topicfy = require('./topicfy');

const producer = new Producer();
producer.init();

producer.wrap = (action) => {
  const newAction = async (...args) =>
    await producer.send({
      topic: newAction.name,
      message: action.apply(action, args),
    });

  Object.defineProperty(newAction, 'name', { value: topicfy(action) });
  newAction.toString = () => newAction.name;
  return newAction;
};

module.exports = producer;
