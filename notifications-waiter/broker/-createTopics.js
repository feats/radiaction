const { Client, Producer } = require('kafka-node');
const { MODULE_KEY } = require('../definitions');
const supplies = require('../supplies');
const { RESULT_SUFFIX } = require('./config');

const producer = new Producer(new Client());
const keys = Object.keys(supplies).concat(
  Object.keys(supplies).map(key => `${key}${RESULT_SUFFIX}`),
);

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
