const { Producer } = require('no-kafka');

const producer = new Producer();
producer.init();

module.exports = function wrap(action) {
  const newAction = async (...args) =>
    await producer.send({
      topic: action.name,
      message: action.apply(action, args),
    });

  Object.defineProperty(newAction, 'name', { value: action.name });
  newAction.toString = () => newAction.name;
  return newAction;
};
