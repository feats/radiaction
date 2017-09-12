const producer = require('./broker/producer');

const actions = {
  buyChinChin(message) {
    console.log(`requesting 'buyChinChin' with: ${message}`);

    return message;
  },
  buyCaliforniaKitchen(message) {
    console.log(`requesting 'buyCaliforniaKitchen' with: ${message}`);

    return message;
  },
};

for (const name of Object.keys(actions)) {
  module.exports[name] = producer.wrap(actions[name]);
}
