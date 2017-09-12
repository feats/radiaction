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
  await buyChinChin('pad-thai', 'Carlo')
  await buyCaliforniaKitchen('san diego', 'Victor')
  await buyCaliforniaKitchen('mexicali', 'bo')
}

async function consume() {
  require('./broker/consumer')
}

if (require.main === module) {
  consume();
  setInterval(produce, 2000);
}
