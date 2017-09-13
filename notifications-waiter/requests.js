const topicfy = require('./broker/topicfy');
const producer = require('./broker/producer');
const waiter = require('./broker/waiter');

const actions = {
  buyChinChin(message, key = null) {
    console.log(`requesting 'buyChinChin' with -> ${key}:${message}`);

    return { key, value: message };
  },
  buyCaliforniaKitchen(message, key = null) {
    console.log(`requesting 'buyCaliforniaKitchen' with -> ${key}:${message}`);

    return { key, value: message };
  },
};

for (const name of Object.keys(actions)) {
  module.exports[name] = waiter(producer(topicfy(actions[name])));
}
