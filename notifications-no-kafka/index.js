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
  await buyChinChin('pad-thai')
  await buyChinChin(123, 'myKey')
  await buyCaliforniaKitchen(['san diego', 'mexicali'])
}

async function consume() {
  require('./broker/consumer')
}

if (require.main === module) {
  produce();
  // consume();
}
