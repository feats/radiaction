const producer = require('./broker/producer');
const { buyChinChin, buyCaliforniaKitchen } = require('./requests');

// catches uncaught rejections
process.on('unhandledRejection', (error) => {
  throw error;
});

// do something when app is closing
process.on('exit', () => {
  producer.close();
  console.log('application closed');
});

async function produce() {
  await producer.on('ready')
  await buyChinChin('pad-thai')
  await buyCaliforniaKitchen(['san diego', 'mexicali'])
}

async function consume() {
  require('./broker/consumer')
}

if (require.main === module) {
  produce();
  // consume();
}
