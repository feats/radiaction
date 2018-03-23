const { createTopics, runner } = require('../../../src')
const actions = require('../application/actions')
const reactions = require('../application/reactions')

async function processActions() {
  await createTopics(actions)
}

async function processReactions() {
  await runner(reactions)
}

async function main() {
  await processActions()
  await processReactions()
}

main()

process.on('unhandledRejection', error => {
  throw error
})
