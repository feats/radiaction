const Assert = require('assert')
const Sandbox = require('sandboxjs')

if (!process.env.WEBTASK_TOKEN) {
  throw new Error('a Webstack token is required to run this application')
}

const profile = Sandbox.fromToken(process.env.WEBTASK_TOKEN)

const wrapper = code => `
  const reaction = ${code}

  module.exports = (context, callback) => {
    try {
      callback(null, reaction.apply(this, context.body))
    } catch (e) {
      callback(e)
    }
  }
`

const createWebtask = (name, reaction) => {
  const code = wrapper(reaction.toString())

  return profile.create(code, { name })
}

module.exports = async (name, reaction) => {
  const webtask = await createWebtask(name, reaction)

  return async (...args) => {
    const result = await webtask.run({ method: 'post', body: args })

    if (result.error) {
      throw new Error(result.error)
    }

    console.log(result.body)
    return result.body
  }
}
