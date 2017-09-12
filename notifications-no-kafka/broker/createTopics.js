const { Client, Producer } = require('kafka-node');
const { MODULE_KEY } = require('../definitions');
const supplies = require('../supplies');

const producer = new Producer(new Client());

producer.on('ready', () => {
  producer.createTopics(Object.keys(supplies), (err, output) => {
    console.log(`Creating topics related to the '${MODULE_KEY}' module.`);
    if (err) {
      throw err;
    }

    if (!output) {
      console.log('No data returned. It has probably failed.');
    } else {
      console.log('Finished. Output: ', output);
    }

    process.exit(0);
  });
});
