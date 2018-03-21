const { compose, emitter, waiter, topicfy } = require('../../../src')
const { MODULE_KEY } = require('./definitions')

const actions = {
  buyMcDonalds(value, key = null) {
    console.log(`requesting a '${value}' for '${key}' at McDonald's`)

    return { value, key }
  },
  bringToFamilyTherapy(value) {
    console.log(`requesting to bring '${value}' to family therapy`)

    return { value }
  },
}

module.exports = compose(waiter, emitter, topicfy(MODULE_KEY))(actions)
