const { compose, emitter, waiter, topicfy } = require('@quadric/radiaction')
const { MODULE_KEY } = require('./definitions')

const actions = {
  buyChinChin(value, key = null) {
    console.log(`requesting a '${value}' for '${key}' at Chin-Chin`)

    return { key, value }
  },
  buyCaliforniaKitchen(value, key = null) {
    console.log(`requesting a '${value}' for '${key}' at California Kitchen`)

    return { key, value }
  },
}

module.exports = compose(waiter, emitter, topicfy(MODULE_KEY))(actions)
