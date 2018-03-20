const { Producer } = require('no-kafka')
const { keepName } = require('./helpers')

function wrap(action) {
  const producer = new Producer()
  producer.init()

  process.on('exit', () => {
    producer.close()
  })

  const newAction = async (...args) =>
    await producer.send({
      topic: action.name,
      message: action.apply(action, args),
    })

  return keepName(newAction, action)
}

module.exports = descriptor => {
  const result = {}

  for (const key of Object.keys(descriptor)) {
    result[key] = wrap(descriptor[key])
  }

  return result
}
