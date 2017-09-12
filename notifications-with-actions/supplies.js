const { buyChinChin, buyCaliforniaKitchen } = require('./requests');

module.exports = {
  [buyChinChin](value, key) {
    console.log(`providing for "buyChinChin" with:`, { value, key });
  },
  [buyCaliforniaKitchen](value, key) {
    console.log(`providing for "buyCaliforniaKitchen" with:`, { value, key });
  },
};
