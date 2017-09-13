const { buyChinChin, buyCaliforniaKitchen } = require('./actionCreators');

module.exports = {
  [buyChinChin](value, key) {
    console.log(`providing "buyChinChin" with:`, { value, key });

    if (value === 'pad-thai' && key !== 'Victor') {
      return `Sorry ${key}, only Victor can have a pad-thai`;
    }

    return `'${value}' ordered ${key === 'Ahmed' ? 'with extra pork ' : ' '}for ${key} at ChinChin`;
  },
  [buyCaliforniaKitchen](value, key) {
    console.log(`providing "buyCaliforniaKitchen" with:`, { value, key });

    if (key === 'Carlo') {
      return `Did you mean white bread, Carlo?`;
    }

    if (key === 'Ahmed') {
      return `'${value}' ordered with extra pork for Ahmed at CaliforniaKitchen`;
    }

    return `'${value}' ordered for ${key} at CaliforniaKitchen`;
  },
};
