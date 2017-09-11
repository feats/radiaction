const producer = require('./producer');
const { TOPIC_1, TOPIC_2 } = require('./topics');

// catches uncaught rejections
process.on('unhandledRejection', (error) => {
  throw error;
});

// do something when app is closing
process.on('exit', () => {
  producer.close();
  console.log('application closed');
});

async function main() {
  const payloads = [
    { topic: TOPIC_1, messages: 'hi' },
    { topic: TOPIC_2, messages: ['hello', 'world'] },
  ];

  await producer.on('ready')
  const x = await producer.send(payloads);
  console.log(x);
}

if (require.main === module) {
  main();
}
