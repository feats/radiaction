const _ = require('lodash')
const { SimpleConsumer, LATEST_OFFSET } = require('no-kafka')
const { keepName } = require('./helpers')
const { IDLE_TIMEOUT, RESULT_SUFFIX, WAITER_TIMEOUT } = require('./config')

const records = {}
const listeners = {}
let initiated = {}

async function setup(key) {
  if (initiated[key]) {
    return true
  }

  initiated[key] = true
  const consumer = new SimpleConsumer({ idleTimeout: IDLE_TIMEOUT })
  await consumer.init()

  process.on('exit', () => {
    consumer.close()
  })

  await consumer
    .subscribe(
      `${key}${RESULT_SUFFIX}`,
      0,
      { time: LATEST_OFFSET },
      (messageSet, topic, partition) => {
        messageSet.forEach(({ message }) => {
          if (!message.key) {
            throw new Error(`waiters can't handle falsy keys`)
          }

          const identifier = `${topic}:${partition}:${message.key.toString('utf8')}`
          const value = message.value && message.value.toString('utf8')

          if (listeners[identifier]) {
            listeners[identifier](value)
          } else {
            records[identifier] = value // TODO! remove records after a while)
          }
        })
      }
    )
    .catch(e => {
      initiated[key] = false
      throw new Error(e.message)
    })
}

function spread({ topic, partition, offset }) {
  const identifier = `${topic}${RESULT_SUFFIX}:${partition}:${offset}`

  if (records[identifier]) {
    const result = records[identifier]

    delete records[identifier]
    return result
  }

  return new Promise((resolve, reject) => {
    const stop = setTimeout(() => {
      reject(new Error(`timeout for waiter ${identifier}`))
    }, WAITER_TIMEOUT)

    listeners[identifier] = value => {
      clearTimeout(stop)
      delete listeners[identifier]
      delete records[identifier]
      resolve(value)
    }
  })
}

function wrap(action) {
  const newAction = async (...args) => {
    await setup(action.name)
    const output = await action.apply(action, args)

    return await spread(output[0])
  }

  newAction.__radiaction = {
    ...action.__radiaction,
    wait: true,
  }

  return keepName(newAction, action)
}

module.exports = descriptor => _.mapValues(descriptor, wrap)
