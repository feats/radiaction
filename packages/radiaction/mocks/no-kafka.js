const _ = require('lodash')
const sinon = require('sinon')
const mock = require('mock-require')
const NoKafka = require('no-kafka')

const STORE = {}
const SUBSCRIBERS = {}

function writeMessage({ topic, partition, message }) {
  const identifier = `${topic}:${partition}`
  const store = (STORE[identifier] = STORE[identifier] || [])
  const offset = store.length

  store[offset] = { message: _.mapValues(message, String), offset }

  for (const subscriber of SUBSCRIBERS[identifier] || []) {
    subscriber([store[offset]], topic, partition)
  }

  return offset
}

class Producer {
  close() {}
}

Producer.prototype.init = sinon
  .stub()
  .named('init')
  .resolves('hello!')

Producer.prototype.send = sinon
  .stub()
  .named('send')
  .callsFake(messages =>
    Promise.resolve(
      (Array.isArray(messages) ? messages : [messages]).map(x => {
        const { topic, message } = x
        const partition = 0
        const offset = writeMessage({
          topic,
          message,
          partition,
        })

        return {
          error: null,
          topic,
          partition,
          offset,
        }
      })
    )
  )

class SimpleConsumer {
  close() {}
}

SimpleConsumer.prototype.init = sinon
  .stub()
  .named('init')
  .resolves('hello!')

SimpleConsumer.prototype.subscribe = sinon
  .stub()
  .named('subscribe')
  .callsFake((topic, partition, options, dataHandler) =>
    Promise.resolve().then(() => {
      const identifier = `${topic}:${partition}`
      const messages = STORE[identifier] || []

      messages.length && dataHandler(messages, topic, partition)
      SUBSCRIBERS[identifier] = SUBSCRIBERS[identifier] || []
      SUBSCRIBERS[identifier].push(dataHandler)
    })
  )

mock('no-kafka', { ...NoKafka, Producer, SimpleConsumer })
module.exports = mock
