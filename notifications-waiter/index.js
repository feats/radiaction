const _ = require('lodash');
const producer = require('./broker/producer');
const { buyChinChin, buyCaliforniaKitchen } = require('./requests');

// catches uncaught rejections
process.on('unhandledRejection', (error) => {
  throw error;
});

// do something when app is closing
process.on('exit', () => {
  producer.client.close();
  console.log('application closed');
});

async function produce() {
  const actors = ['Lioba', 'Ahmed', 'Carlo', 'Victor'] // ladies first ;)

  console.log('   ->', await buyChinChin(_.sample(['pad-thai', 'Mix a wok']), _.sample(actors)));
  console.log('');
  console.log('   ->', await buyCaliforniaKitchen(_.sample(['san diego', 'mexicali']), _.sample(actors)));
  console.log('');
}

async function consume() {
  require('./broker/consumer')
}

async function main() {
  // consume();

  while(true) {
    await produce();
  }
}

if (require.main === module) {
  main();
}
