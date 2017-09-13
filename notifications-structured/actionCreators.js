const topicfy = require('./broker/topicfy');

module.exports = topicfy({
  buyChinChin(message, key = null) {
    console.log(`requesting a '${message}' for '${key}' at ChinChin`);

    return { key, value: message };
  },
  buyCaliforniaKitchen(message, key = null) {
    console.log(`requesting a '${message}' for '${key}' at CaliforniaKitchen`);

    return { key, value: message };
  },
});
