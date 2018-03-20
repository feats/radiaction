const { compose, emitter, waiter, topicfy } = require('@quadric/radiaction')
const { MODULE_KEY } = require('./definitions')

const actions = {
  buyChinChin(message, key = null) {
    console.log(`requesting a '${message}' for '${key}' at Chin-Chin`)

    return { key, value: message }
  },
  buyCaliforniaKitchen(message, key = null) {
    console.log(`requesting a '${message}' for '${key}' at California Kitchen`)

    return { key, value: message }
  },
}

module.exports = compose(waiter, emitter, topicfy(MODULE_KEY))(actions)
