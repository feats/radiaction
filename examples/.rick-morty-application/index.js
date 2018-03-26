const _ = require('lodash')
const { buySauce, bringToFamilyTherapy } = require('./actions')

const characters = ['Rick', 'Morty', 'Summer', 'Beth', 'Jerry']
const sauces = ['SzeChuan', 'ketchup']

async function produce() {
  let result

  result = await buySauce(_.sample(Object.values(sauces)), _.sample(Object.values(characters)))
  console.log('   ->', result, '\n')

  result = await bringToFamilyTherapy(_.sample(Object.values(characters)))
  console.log('   ->', result, '\n')
}

setInterval(produce, 1000)

process.on('unhandledRejection', error => {
  throw error
})
