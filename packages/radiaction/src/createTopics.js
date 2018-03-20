const _ = require('lodash')
const chalk = require('chalk')
const { Client, Producer } = require('kafka-node')
const { RESULT_SUFFIX, WAITER_BEHAVIOUR_ENABLED } = require('./config')

export default actions =>
  new Promise((resolve, reject) => {
    const producer = new Producer(new Client())
    let keys = Object.values(actions).map(action => action.toString())

    if (WAITER_BEHAVIOUR_ENABLED) {
      keys = keys.concat(keys.map(key => `${key}${RESULT_SUFFIX}`))
    }

    console.log(`Creating topics with the following keys:`)
    console.log(
      keys
        .map(x => chalk.yellow(x))
        .map(x => `\t* ${x}`)
        .join('\n')
    )

    producer.on('ready', () => {
      producer.createTopics(keys, (err, output) => {
        if (err) {
          reject(err)
        }

        if (!output) {
          console.log(chalk.red.bold('WARNING! No data returned. It has probably failed.'))
        } else {
          console.log('Topics created.')
        }

        if (!_.isEqual(output, keys)) {
          console.log('Output:\n', chalk.red(output))
        }

        producer.close()
        resolve()
      })
    })
  })
