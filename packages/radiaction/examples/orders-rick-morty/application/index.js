const _ = require('lodash')
const { buyMcDonalds, bringToFamilyTherapy } = require('./actions')
const { characters, sauces } = require('./definitions')

async function produce() {
  let result

  result = await buyMcDonalds(
    _.sample(Object.values(sauces)),
    _.sample(Object.values(characters))
  )
  console.log('   ->', result, '\n')

  result = await bringToFamilyTherapy(_.sample(Object.values(characters)))
  console.log('   ->', result, '\n')
}

async function main() {
  while (true) {
    try {
      await produce()
    } catch (e) {
      console.error(e)
    }
  }
}

main()

process.on('unhandledRejection', error => {
  throw error
})
