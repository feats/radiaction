const { constantCase } = require('change-case');
const { MODULE_KEY } = require('../definitions');
const { DELIMITER } = require('./config');

// @see https://issues.apache.org/jira/browse/KAFKA-495
// @see https://github.com/apache/kafka/blob/0.9.0/core/src/main/scala/kafka/common/Topic.scala#L25

const naming = fn => `${MODULE_KEY}${DELIMITER}${constantCase(fn.name)}`.replace('/', DELIMITER);

module.exports = (action) => {
  Object.defineProperty(action, 'name', { value: naming(action) });
  action.toString = () => action.name;

  return action;
};
