const _ = require('lodash');
const { buyChinChin, buyCaliforniaKitchen } = require('./actions');

// catches uncaught rejections
process.on('unhandledRejection', (error) => {
  throw error;
});

async function produce() {
  let order;
  const actors = ['Lioba', 'Ahmed', 'Carlo', 'Victor'] // ladies first ;)

  order = await buyChinChin(_.sample(['pad-thai', 'Mix a wok']), _.sample(actors));
  console.log('   ->', order, '\n');

  order = await buyCaliforniaKitchen(_.sample(['san diego', 'mexicali']), _.sample(actors));
  console.log('   ->', order, '\n');
}

// async function consume() {
//   require('./broker/consumer')
// }

async function main() {
  // consume();

  while(true) {
    await produce();
  }
}

if (require.main === module) {
  main();
}
