const { Client, Producer } = require('kafka-node');
const { MODULE_KEY } = require('../definitions');
const actions = require('../actionCreators');
const { RESULT_SUFFIX, WAITER_BEHAVIOUR_ENABLED } = require('./config');

const producer = new Producer(new Client());
let keys = Object.values(actions).map(action => action.toString());
if (WAITER_BEHAVIOUR_ENABLED) {
  keys = keys.concat(keys.map(key => `${key}${RESULT_SUFFIX}`));
}

producer.on('ready', () => {
  producer.createTopics(keys, (err, output) => {
    console.log(`Creating topics related to the '${MODULE_KEY}' module.`);
    if (err) {
      throw err;
    }

    if (!output) {
      console.log('No data returned. It has probably failed.');
    } else {
      console.log('\nFinished. Output:\n', output);
    }

    process.exit(0);
  });
});
