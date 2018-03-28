const _ = require('lodash')
const { Producer } = require('no-kafka')
const { keepName } = require('./helpers')

const stopAll = []

process.on('exit', () => {
  stopAll.forEach(stop => stop())
})

function wrap(action) {
  const producer = new Producer()
  stopAll.push(producer.close)
  producer.init()

  const newAction = (...args) =>
    producer.send({
      topic: action.name,
      message: action.apply(action, args),
    })

  newAction.__radiaction = {
    ...action.__radiaction,
    emit: true,
  }

  return keepName(newAction, action)
}

module.exports = descriptor => _.mapValues(descriptor, wrap)
