const { constantCase } = require('change-case')
const { DELIMITER } = require('./config')

// @see https://issues.apache.org/jira/browse/KAFKA-495
// @see https://github.com/apache/kafka/blob/0.9.0/core/src/main/scala/kafka/common/Topic.scala#L25

const naming = (moduleKey, fn) =>
  `${moduleKey}${DELIMITER}${constantCase(fn.name)}`.replace('/', DELIMITER)

function topicfy(moduleKey, action) {
  Object.defineProperty(action, 'name', { value: naming(moduleKey, action) })
  action.toString = () => action.name

  return action
}

module.exports = (moduleKey, descriptor) => {
  if (typeof descriptor === 'function') {
    return topicfy(moduleKey, descriptor)
  }

  for (const key of Object.keys(descriptor)) {
    descriptor[key] = topicfy(moduleKey, descriptor[key])
  }

  return descriptor
}
