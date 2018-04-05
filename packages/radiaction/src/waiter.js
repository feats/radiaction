const _ = require('lodash')
const { SimpleConsumer, LATEST_OFFSET } = require('no-kafka')
const { keepName, actionName } = require('./helpers')
const { IDLE_TIMEOUT, RESULT_SUFFIX, WAITER_TIMEOUT } = require('./config')

const stopAll = []
const records = {}
const listeners = {}
let initiated = {}

process.on('exit', () => {
  stopAll.forEach(stop => stop())
})

function validateInput(input) {
  if (!_.isPlainObject(input)) {
    throw new Error(
      `waiters expect to receive an object containing 'topic', 'partition' and 'offset' fields`
    )
  }

  if (input.error) {
    throw new Error(input.error)
  }

  if (!_.has(input, 'topic') || input.topic.constructor !== String) {
    throw new Error(`waiters expect to receive an object containing a valid 'topic' field`)
  }

  if (!_.has(input, 'partition') || input.partition.constructor !== Number) {
    throw new Error(`waiters expect to receive an object containing a valid 'partition' field`)
  }

  if (!_.has(input, 'offset') || input.offset.constructor !== Number) {
    throw new Error(`waiters expect to receive an object containing a valid 'offset' field`)
  }

  return input
}

function validateOutput(output) {
  const keys = new Set(Object.keys(output))

  if (!keys.has('key')) {
    throw new Error(`waiters require output objects to contain the 'key' field`)
  }

  if (!keys.has('value')) {
    throw new Error(`waiters require output objects to contain the 'value' field`)
  }

  keys.delete('value')
  keys.delete('key')

  if (keys.size > 0) {
    throw new Error(`output objects returned to a waiter can only contain fields 'value' and 'key'`)
  }

  return output
}

async function setup(action) {
  const key = actionName(action)

  if (initiated[key]) {
    return true
  }

  initiated[key] = true
  const consumer = new SimpleConsumer({ idleTimeout: IDLE_TIMEOUT })
  stopAll.push(consumer.close)
  await consumer.init()

  await consumer
    .subscribe(
      `${key}${RESULT_SUFFIX}`,
      0,
      { time: LATEST_OFFSET },
      (messageSet, topic, partition) => {
        messageSet.forEach(({ message }) => {
          validateOutput(message)

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

  if (_.has(records, identifier)) {
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
    await setup(action)
    const input = await action.apply(action, args)
    validateInput(input)

    return await spread(input)
  }

  newAction.__radiaction = {
    ...action.__radiaction,
    wait: true,
  }

  return keepName(newAction, action)
}

module.exports = descriptor => _.mapValues(descriptor, wrap)
