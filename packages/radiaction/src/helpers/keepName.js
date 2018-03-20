module.exports = (newAction, oldAction) => {
  if (!oldAction.name) {
    throw new Error('function cannot be unnamed')
  }

  Object.defineProperty(newAction, 'name', { value: oldAction.name })
  newAction.toString = () => oldAction.name

  return newAction
}
