const { compose, emitter, waiter, topicfy } = require('@quadric/radiaction')
const { MODULE_KEY } = require('./definitions')

const actions = {
  buyChinChin(dish, actor = null) {
    console.log(`requesting a '${dish}' for '${actor}' at Chin-Chin`)

    return { key: actor, value: dish }
  },
  buyCaliforniaKitchen(value, key = null) {
    console.log(`requesting a '${value}' for '${key}' at California Kitchen`)

    return { key, value }
  },
}

module.exports = compose(waiter, emitter, topicfy(MODULE_KEY))(actions)
