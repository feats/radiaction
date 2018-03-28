const _ = require('lodash')
const sinon = require('sinon')
const mock = require('mock-require')

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
      (Array.isArray(messages) ? messages : [messages]).map(x => ({
        topic: x.topic,
        error: null,
        partition: parseInt(_.uniqueId()),
        offset: parseInt(_.uniqueId()),
      }))
    )
  )

mock('no-kafka', { Producer })
module.exports = mock
