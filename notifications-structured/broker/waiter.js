const { SimpleConsumer, LATEST_OFFSET } = require('no-kafka');
const { RESULT_SUFFIX, WAITER_BEHAVIOUR_ENABLED, WAITER_TIMEOUT } = require('./config');

const records = {};
const listeners = {};

const consumer = new SimpleConsumer();
if (WAITER_BEHAVIOUR_ENABLED) {
  consumer.init();
}

function setup(key) {
  consumer.subscribe(
    `${key}${RESULT_SUFFIX}`,
    0,
    { time: LATEST_OFFSET },
    (messageSet, topic, partition) => {
      messageSet.forEach(({ message }) => {
        if (!message.key) {
          throw new Error(`waiters can't handle falsy keys`);
        }

        const identifier = `${topic}:${partition}:${message.key.toString('utf8')}`;
        const value = message.value && message.value.toString('utf8');

        if (listeners[identifier]) {
          listeners[identifier](value);
        } else {
          records[identifier] = value; // TODO! remove records after a while)
        }
      });
    },
  );
}

function spread({ topic, partition, offset }) {
  const identifier = `${topic}${RESULT_SUFFIX}:${partition}:${offset}`;

  if (records[identifier]) {
    const result = records[identifier];

    delete records[identifier];
    return result;
  }

  return new Promise((resolve, reject) => {
    const stop = setTimeout(() => {
      reject(new Error(`timeout for waiter ${identifier}`));
    }, WAITER_TIMEOUT);

    listeners[identifier] = (value) => {
      clearTimeout(stop);
      delete listeners[identifier];
      delete records[identifier];
      resolve(value);
    };
  });
}

module.exports = function wrap(action) {
  if (!WAITER_BEHAVIOUR_ENABLED) {
    return action;
  }

  setup(action.name);

  const newAction = async (...args) => {
    const output = await action.apply(action, args);

    return await spread(output[0]);
  };

  Object.defineProperty(newAction, 'name', { value: action.name });
  newAction.toString = () => newAction.name;
  return newAction;
};

// close connections when process is killed.
process.on('exit', () => {
  consumer.close();
});
