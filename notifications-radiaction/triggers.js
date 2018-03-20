const { emitter, waiter } = require('@quadric/radiaction')
const actions = require('./actions')

for (const name of Object.keys(actions)) {
  module.exports[name] = waiter(emitter(actions[name]))
}
