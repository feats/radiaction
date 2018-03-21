const { buyMcDonalds, bringToFamilyTherapy } = require('./actions')
const { characters, sauces } = require('./definitions')

module.exports = {
  [buyMcDonalds](value, key) {
    console.log(`providing "buyMcDonalds" for:`, { value, key })

    if (value === sauces.SZECHUAN && key !== characters.RICK) {
      return `Sorry ${key}, only Rick can have a SzeChuan sauce`
    }

    return `'${value}' ordered for ${key} at McDonalds`
  },
  [bringToFamilyTherapy](value, key) {
    console.log(`providing "bringToFamilyTherapy" for:`, { value, key })

    if (value === characters.RICK) {
      return `You can't bring Rick to family therapy. Take a pickle! 🥒`
    }

    return `'${value}' went to family therapy`
  },
}
