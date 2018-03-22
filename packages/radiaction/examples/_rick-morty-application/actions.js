const { compose, emitter, waiter, topicfy } = require('../../../src')
const { MODULE_KEY } = require('./definitions')

const actions = {
  buySauce(sauce, client = null) {
    console.log(`requesting a '${sauce}' for '${client}' at McDonald's`)

    return { value: sauce, key: client }
  },
  bringToFamilyTherapy(familyMember) {
    console.log(`requesting to bring '${familyMember}' to family therapy`)

    return { value: familyMember }
  },
}

module.exports = compose(waiter, emitter, topicfy(MODULE_KEY))(actions)
