const _ = require('lodash')
const { constantCase } = require('change-case')
const { DELIMITER } = require('./config')

// @see https://issues.apache.org/jira/browse/KAFKA-495
// @see https://github.com/apache/kafka/blob/0.9.0/core/src/main/scala/kafka/common/Topic.scala#L25

const naming = (moduleKey, fn) =>
  `${moduleKey}${DELIMITER}${constantCase(fn.name)}`.replace('/', DELIMITER)

function topicfy(moduleKey, action) {
  const topic = naming(moduleKey, action)

  Object.defineProperty(action, 'name', { value: topic })
  action.toString = () => topic
  action.__radiaction = {
    ...action.__radiaction,
    topic,
  }

  return action
}

module.exports = moduleKey => descriptor =>
  _.mapValues(descriptor, action => topicfy(moduleKey, action))
