// it is not running
// https://github.com/Quadric/radiaction/issues/3

import test from 'ava'
import keepName from './keepName'

test('accept arrow functions', t => {
  function myFunction() {}
  const newFn = () => {}

  const processedFn = keepName(newFn, myFunction)

  t.is(processedFn.name, 'myFunction')
})

test('accept anonymous fns', async t => {
  const myFunction = () => {}
  const newFn = () => {}

  const processedFn = keepName(newFn, myFunction)

  t.is(processedFn.name, 'myFunction')
})
