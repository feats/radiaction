const { buySauce, bringToFamilyTherapy } = require('./actions')

module.exports = {
  [buySauce](value, key) {
    console.log(`providing "buySauce" for:`, { value, key })

    if (value === 'SzeChuan' && key !== 'Rick') {
      return `Sorry ${key}, only Rick can have a SzeChuan sauce`
    }

    return `'${value}' ordered for ${key} at McDonalds`
  },

  [bringToFamilyTherapy](value, key) {
    console.log(`providing "bringToFamilyTherapy" for:`, { value, key })

    if (value === 'Rick') {
      return `You can't bring Rick to family therapy. Take a pickle! 🥒`
    }

    return `'${value}' went to family therapy`
  },
}
