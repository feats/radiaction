const _ = require('lodash')

module.exports = action => _.get(action, '__radiaction.topic', action.name)
