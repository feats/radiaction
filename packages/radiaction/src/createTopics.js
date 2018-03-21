const _ = require('lodash')
const chalk = require('chalk')
const { Client, Producer } = require('kafka-node')
const { RESULT_SUFFIX, WAITER_BEHAVIOUR_ENABLED } = require('./config')

export default actions =>
  new Promise((resolve, reject) => {
    let keys = Object.values(actions).map(action => action.toString())

    if (!keys || !keys.length) {
      throw new Error('no topics found to be created')
    }

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

    const producer = new Producer(new Client())
    producer.on('error', err => reject(err))
    producer.on('ready', () => {
      console.log('Producer ready.')
      producer.createTopics(keys, true, (err, output) => {
        if (err) {
          reject(err)
        }

        if (!output) {
          console.log(chalk.red.bold('WARNING! No data returned. It has probably failed.'))
        } else {
          console.log('Topics created:')
          console.log(
            output
              .map(x => chalk.green(x))
              .map(x => `\t> ${x}`)
              .join('\n')
          )
        }

        producer.close()
        resolve()
      })
    })
  })
