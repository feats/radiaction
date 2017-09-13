const { constantCase } = require('change-case');
const { MODULE_KEY } = require('../definitions');
const { DELIMITER } = require('./config');

// @see https://issues.apache.org/jira/browse/KAFKA-495
// @see https://github.com/apache/kafka/blob/0.9.0/core/src/main/scala/kafka/common/Topic.scala#L25

const naming = fn => `${MODULE_KEY}${DELIMITER}${constantCase(fn.name)}`.replace('/', DELIMITER);

function topicfy(action) {
  Object.defineProperty(action, 'name', { value: naming(action) });
  action.toString = () => action.name;

  return action;
}

module.exports = (descriptor) => {
  if (typeof descriptor === 'function') {
    return topicfy(descriptor);
  }

  for (const key of Object.keys(descriptor)) {
    descriptor[key] = topicfy(descriptor[key]);
  }

  return descriptor;
};
