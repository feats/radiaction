const _ = require('lodash')
const { Producer } = require('no-kafka')
const { keepName } = require('./helpers')

const stopAll = []

process.on('exit', () => {
  stopAll.forEach(stop => stop())
})

function forceStructure(output) {
  if (!_.isPlainObject(output)) {
    return { value: output }
  }

  const keys = new Set(Object.keys(output))

  if (!keys.has('value')) {
    throw new Error(`plain objects sent to a emitter need to contain the 'value' field`)
  }

  keys.delete('value')
  keys.delete('key')

  if (keys.size > 0) {
    throw new Error(`plain objects sent to a emitter can only contain fields 'value' and 'key'`)
  }

  return output
}

function wrap(action) {
  const producer = new Producer()
  stopAll.push(producer.close)
  producer.init()

  const newAction = (...args) =>
    producer.send({
      topic: action.name,
      message: forceStructure(action.apply(action, args)),
    })

  newAction.__radiaction = {
    ...action.__radiaction,
    emit: true,
  }

  return keepName(newAction, action)
}

module.exports = descriptor => _.mapValues(descriptor, wrap)
