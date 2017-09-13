const emitter = require('./broker/emitter');
const waiter = require('./broker/waiter');
const actions = require('./actionCreators');

for (const name of Object.keys(actions)) {
  module.exports[name] = waiter(emitter(actions[name]));
}
