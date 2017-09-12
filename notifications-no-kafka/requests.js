const producer = require('./broker/producer');

const actions = {
  buyChinChin(message, key = null) {
    console.log(`requesting 'buyChinChin' with: ${message}`);

    return { key, value: message };
  },
  buyCaliforniaKitchen(message, key = null) {
    console.log(`requesting 'buyCaliforniaKitchen' with: ${message}`);

    return { key, value: message };
  },
};

for (const name of Object.keys(actions)) {
  module.exports[name] = producer.wrap(actions[name]);
}
