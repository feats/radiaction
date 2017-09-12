const { TOPIC_1, TOPIC_2 } = require('./topics');

module.exports = {
  [TOPIC_1]: async (value, key) => {
    console.log({ [TOPIC_1]: { value, key } });
  },
  [TOPIC_2]: async (value, key) => {
    console.log({ [TOPIC_2]: { value, key } });
  },
};
