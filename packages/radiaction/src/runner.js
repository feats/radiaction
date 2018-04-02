const _ = require('lodash')
const { keepName, actionName } = require('./helpers')
const { Producer, SimpleConsumer, LATEST_OFFSET } = require('no-kafka')
const { RESULT_SUFFIX, IDLE_TIMEOUT } = require('./config')

const stopAll = []

process.on('exit', () => {
  stopAll.forEach(stop => stop())
})

const setup = async (reaction, actionName) => {
  const producer = new Producer()
  const consumer = new SimpleConsumer({ idleTimeout: IDLE_TIMEOUT })

  stopAll.push(producer.close)
  stopAll.push(consumer.close)

  producer.init()
  await consumer.init()
  return await consumer.subscribe(
    actionName,
    0,
    { time: LATEST_OFFSET },
    (messageSet, topic, partition) => {
      messageSet.forEach(async m => {
        const { value, key } = m.message
        const result = await reaction(value && value.toString('utf8'), key && key.toString('utf8'))

        producer
          .send({
            topic: `${actionName}${RESULT_SUFFIX}`,
            partition,
            message: {
              value: result || '',
              key: m.offset,
            },
          })
          // .then(results =>
          //   results.filter(result => result.error).map(result => throwError(result.error))
          // )
          .catch(e => {
            throw new Error(e)
          })
      })
    }
  )
}

function wrap(reaction, key) {
  const newReaction = () => setup(reaction, key)

  newReaction.__radiaction = {
    ...reaction.__radiaction,
    run: true,
  }

  return keepName(newReaction, reaction)
}

module.exports = descriptor => _.mapValues(descriptor, wrap)
