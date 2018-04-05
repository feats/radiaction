const _ = require('lodash')
const chalk = require('chalk')
const { Client, Producer } = require('kafka-node')
const actionName = require('./helpers/actionName')
const { RESULT_SUFFIX } = require('./config')

export default actions =>
  new Promise((resolve, reject) => {
    let topics = Object.values(actions).map(actionName)
    if (!topics || !topics.length) {
      throw new Error('no topics found to be created')
    }

    const waiters = Object.values(actions).filter(
      action => action.__radiaction && action.__radiaction.wait
    )
    if (waiters.length) {
      topics = topics.concat(waiters.map(action => `${actionName(action)}${RESULT_SUFFIX}`))
    }

    console.log(`Creating topics with the following names:`)
    console.log(
      topics
        .map(x => chalk.yellow(x))
        .map(x => `\t* ${x}`)
        .join('\n')
    )

    const client = new Client()
    const producer = new Producer(client)

    // close connection when process is killed.
    process.on('exit', () => {
      client.close()
      producer.close()
    })

    producer.on('error', err => reject(err))
    producer.on('ready', () => {
      console.log('Producer ready.')
      producer.createTopics(topics, true, (err, output) => {
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
