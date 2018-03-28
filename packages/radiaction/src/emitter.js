const _ = require('lodash')
const { Producer } = require('no-kafka')
const { keepName } = require('./helpers')

function wrap(action) {
  const producer = new Producer()
  producer.init()

  process.on('exit', () => {
    producer.close()
  })

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
