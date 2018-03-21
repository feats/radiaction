const { Producer, SimpleConsumer, LATEST_OFFSET } = require('no-kafka')
const { RESULT_SUFFIX, IDLE_TIMEOUT } = require('./config')

export default reactions => {
  const producer = new Producer()
  producer.init()

  // close connection when process is killed.
  process.on('exit', () => {
    producer.close()
  })

  const consumers = Object.keys(reactions).map(key => {
    const consumer = new SimpleConsumer({ idleTimeout: IDLE_TIMEOUT })

    // close connection when process is killed.
    process.on('exit', () => {
      consumer.close()
    })

    return consumer.init().then(() => {
      return consumer.subscribe(key, 0, { time: LATEST_OFFSET }, (messageSet, topic, partition) => {
        messageSet.forEach(async m => {
          const reaction = reactions[key]

          const result = await reaction(
            m.message.value.toString('utf8'),
            m.message.key && m.message.key.toString('utf8')
          )

          await producer.send({
            topic: `${key}${RESULT_SUFFIX}`,
            partition,
            message: {
              value: result || '',
              key: m.offset,
            },
          })
        })
      })
    })
  })

  return Promise.all(consumers)
}
