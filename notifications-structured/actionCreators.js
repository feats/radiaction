const topicfy = require('./broker/topicfy');

module.exports = topicfy({
  buyChinChin(message, key = null) {
    console.log(`requesting a '${message}' for '${key}' at Chin-Chin`);

    return { key, value: message };
  },
  buyCaliforniaKitchen(message, key = null) {
    console.log(`requesting a '${message}' for '${key}' at California Kitchen`);

    return { key, value: message };
  },
});
