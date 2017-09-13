const { buyChinChin, buyCaliforniaKitchen } = require('./requests');

module.exports = {
  [buyChinChin](value, key) {
    console.log(`providing "buyChinChin" with:`, { value, key });
    if (value === 'pad-thai') {
      return `Sorry ${key}, only Victor can have a pad-thai`;
    }

    return `'${value}' ordered ${key === 'Ahmed' ? 'with extra pork ' : ' '}for ${key} at ChinChin`;
  },
  [buyCaliforniaKitchen](value, key) {
    console.log(`providing "buyCaliforniaKitchen" with:`, { value, key });
    if (key === 'Carlo') {
      return `Did you mean white bread, Carlo?`;
    }

    return `'${value}' ordered ${key === 'Ahmed'
      ? 'with extra pork '
      : ' '}for ${key} at CaliforniaKitchen`;
  },
};
