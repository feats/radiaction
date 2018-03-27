const mock = require('mock-require')

class Producer {
  init() {
    return Promise.resolve()
  }

  send() {
    return Promise.resolve()
  }

  close() {}
}

mock('no-kafka', { Producer })
