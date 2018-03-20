const { topicfy } = require('@quadric/radiaction');
const { MODULE_KEY } = require('./definitions');

module.exports = topicfy(MODULE_KEY, {
  buyChinChin(message, key = null) {
    console.log(`requesting a '${message}' for '${key}' at Chin-Chin`);

    return { key, value: message };
  },
  buyCaliforniaKitchen(message, key = null) {
    console.log(`requesting a '${message}' for '${key}' at California Kitchen`);

    return { key, value: message };
  },
});
