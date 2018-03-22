const { createTopics, runner } = require('@quadric/radiaction')
const { ACTIONS_GLOB, REACTIONS_GLOB } = require('./config')
const loadAssets = require('./loadAssets')

async function processActions() {
  await createTopics(loadAssets(ACTIONS_GLOB))
}

async function processReactions() {
  await runner(loadAssets(REACTIONS_GLOB))
}

async function main() {
  await processActions()
  await processReactions()
}

main()

process.on('unhandledRejection', error => {
  throw error
})
