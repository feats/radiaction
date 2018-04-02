import test from 'ava'
import sinon from 'sinon'
import NoKafkaMock from '../mocks/no-kafka'
import { Producer } from 'no-kafka'
import runner from './runner'

const DeferredPromise = () => {
  let resolver

  const q = new Promise(resolve => {
    resolver = resolve
  })

  q.resolve = resolver
  return q
}

const emit = (topic, message = {}) => new Producer().send({ topic, message })

test('flag is ON', t => {
  const processed = runner({
    adventurous: () => 'A',
    beautiful: () => ({ b: 'B' }),
    charming: () => ({ value: 'C' }),
    delightful: () => ({ key: 'd', value: 'D' }),
  })

  t.is(processed.adventurous.__radiaction.run, true)
  t.is(processed.beautiful.__radiaction.run, true)
  t.is(processed.charming.__radiaction.run, true)
  t.is(processed.delightful.__radiaction.run, true)
})

test('previous metadata is not lost', t => {
  const reaction = () => 'A'
  reaction.__radiaction = {
    x: -1,
    y: -2,
    z: -3,
  }

  const processed = runner({
    amazing: reaction,
  })

  t.deepEqual(processed.amazing.__radiaction, { run: true, z: -3, y: -2, x: -1 })
})

test(`names don't change`, t => {
  const processed = runner({
    amusing: () => 'A',
    brave: () => ({ b: 'B' }),
    calm: () => ({ value: 'C' }),
    distinguished: () => ({ key: 'd', value: 'D' }),
  })

  t.is(processed.amusing.name, 'amusing')
  t.is(processed.brave.name, 'brave')
  t.is(processed.calm.name, 'calm')
  t.is(processed.distinguished.name, 'distinguished')
})

test('arguments are NOT passed down', async t => {
  const ACTION = `Let's pretend I am the output of an action ;)`
  const q = DeferredPromise()

  const myUniqueReaction = (value, key) => q.resolve({ value, key })
  const runners = runner({ myUniqueReaction })
  await runners.myUniqueReaction('a0', 'a1', 'a3')

  await emit('myUniqueReaction', { key: 10, value: ACTION })
  t.deepEqual(await q, { value: ACTION, key: '10' })
})

test('reactions are executed by the runner', async t => {
  const promises = {
    awesome: DeferredPromise(),
    bravery: DeferredPromise(),
    comfort: DeferredPromise(),
  }

  const runners = runner({
    awesome: (value, key) => promises.awesome.resolve({ value, key }),
    bravery: (value, key) => promises.bravery.resolve({ value, key }),
    comfort: (value, key) => promises.comfort.resolve({ value, key }),
  })

  await runners.awesome()
  await emit('awesome', { key: 'something', value: 'action of a' })
  t.deepEqual(await promises.awesome, { value: 'action of a', key: 'something' })

  await runners.bravery()
  await emit('bravery', { key: 1 })
  t.deepEqual(await promises.bravery, { key: '1', value: undefined })

  await runners.comfort()
  await emit('comfort', { value: 'action of c' })
  t.deepEqual(await promises.comfort, { value: 'action of c', key: undefined })
})

test.after.always(() => {
  NoKafkaMock.stopAll()
})
