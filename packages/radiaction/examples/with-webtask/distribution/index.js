const { createTopics, runner } = require('radiaction')
const actions = require('../application/actions')
const reactions = require('../application/reactions')
const convertReaction = require('./convertReaction')

async function processActions() {
  await createTopics(actions)
}

async function processReactions() {
  const webtasks = {}

  for (const name of Object.keys(reactions)) {
    webtasks[name] = await convertReaction(name, reactions[name])
  }

  await runner(webtasks)
}

async function main() {
  await processActions()
  await processReactions()
}

main()

process.on('unhandledRejection', error => {
  throw error
})
