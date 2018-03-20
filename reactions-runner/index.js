const glob = require('glob')
const path = require('path')
const { createTopics, runner } = require('@quadric/radiaction')
const { CODEBASE_GLOB } = require('./config')

if (require.main !== module) {
  throw new Error('this application must run as a standalone process.')
}

process.on('unhandledRejection', error => {
  throw error
})

function loadAssets() {
  const files = glob.sync(CODEBASE_GLOB).map(file => path.resolve(file))
  const modules = files.map(file => require(file))
  const reactions = Object.assign({}, ...modules)
  const actionTypes = Object.keys(reactions)

  return { files, modules, reactions, actionTypes }
}

async function main() {
  const { files, modules, reactions, actionTypes } = loadAssets()

  console.log(
    `${files.length} file(s) were found containing ${actionTypes.length} reaction(s) in total.`
  )
  console.log(`Setting up their distribution models.`)

  await createTopics(actionTypes)
  await runner(reactions)

  console.log('All runners were initiated.')
}

main()
