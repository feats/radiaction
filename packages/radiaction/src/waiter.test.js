import test from 'ava'
import sinon from 'sinon'
import NoKafkaMock from '../mocks/no-kafka'
import { Producer } from 'no-kafka'
import waiter from './waiter'

const emit = (topic, message = {}) => new Producer().send({ topic, message })

test('flag is ON', t => {
  const processed = waiter({
    adventurous: () => 'A',
    beautiful: () => ({ b: 'B' }),
    charming: () => ({ value: 'C' }),
    delightful: () => ({ key: 'd', value: 'D' }),
  })

  t.is(processed.adventurous.__radiaction.wait, true)
  t.is(processed.beautiful.__radiaction.wait, true)
  t.is(processed.charming.__radiaction.wait, true)
  t.is(processed.delightful.__radiaction.wait, true)
})

test('previous metadata is not lost', t => {
  const action = () => 'A'
  action.__radiaction = {
    x: -1,
    y: -2,
    z: -3,
  }

  const processed = waiter({
    amazing: action,
  })

  t.deepEqual(processed.amazing.__radiaction, { wait: true, z: -3, y: -2, x: -1 })
})

test(`names don't change`, t => {
  const processed = waiter({
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

test('arguments are passed down', async t => {
  const REACTION = `Let's pretend I am the output of a reaction ;)`

  const myUniqueAction = sinon.stub().returns({ topic: 'myUniqueAction', partition: 0, offset: 0 })
  Object.defineProperty(myUniqueAction, 'name', { value: 'myUniqueAction' })

  const processed = waiter({ myUniqueAction })
  const reaction = processed.myUniqueAction('a0', 'a1', 'a3')
  await emit('myUniqueAction.output', { key: 0, value: REACTION })
  const result = await reaction

  t.true(myUniqueAction.calledOnceWithExactly('a0', 'a1', 'a3'), myUniqueAction.args.toString())
  t.is(result, REACTION)
})

test('forces actions to return compatible descriptor', async t => {
  const processed = waiter({
    authentic: () => 'A',
    brilliant: () => ({ error: null, partition: 1, offset: 10 }),
    creative: () => ({ topic: 'creative', error: null, offset: 20 }),
    delicious: () => ({ topic: 'delicious', error: null, partition: 3 }),
    effective: () => ({ topic: 'effective', error: new Error('E'), partition: 4, offset: 40 }),
    fantastic: () => ({ topic: 'fantastic', error: null, partition: 0, offset: 0 }),
  })

  await t.throws(
    processed.authentic,
    `waiters expect to receive an object containing 'topic', 'partition' and 'offset' fields`
  )
  await t.throws(
    processed.brilliant,
    `waiters expect to receive an object containing a valid 'topic' field`
  )
  await t.throws(
    processed.creative,
    `waiters expect to receive an object containing a valid 'partition' field`
  )
  await t.throws(
    processed.delicious,
    `waiters expect to receive an object containing a valid 'offset' field`
  )
  await t.throws(processed.effective, `Error: E`)
  await emit('fantastic.output', { key: 0, value: '' }) // emits whatever just to avoid 'f' from timing out
  await t.notThrows(processed.fantastic)
})

test('reactions are returned by the waiter', async t => {
  const processed = waiter({
    awesome: () => ({ topic: 'awesome', partition: 0, offset: 0 }),
    bravery: () => ({ topic: 'bravery', partition: 0, offset: 0 }),
    comfort: () => ({ topic: 'comfort', partition: 0, offset: 0 }),
    dignity: () => ({ topic: 'dignity', partition: 0, offset: 0 }),
    empathy: () => ({ topic: 'empathy', partition: 0, offset: 0 }),
    festive: () => ({ topic: 'festive', partition: 0, offset: 0 }),
  })

  const a = processed.awesome()
  await emit('awesome.output', { key: 0, value: 'reaction of a' })
  t.is(await a, 'reaction of a')

  await t.throws(async () => {
    await emit('bravery.output', { key: 0 })
    await processed.bravery()
  }, `waiters require output objects to contain the 'value' field`)

  await t.throws(async () => {
    await emit('comfort.output', { value: 'reaction of c' })
    await processed.comfort()
  }, `waiters require output objects to contain the 'key' field`)

  await t.throws(async () => {
    await emit('dignity.output', { key: 0, value: 'reaction of d', d: 'dignity' })
    await processed.dignity()
  }, `output objects returned to a waiter can only contain fields 'value' and 'key'`)

  const e = processed.empathy()
  await emit('empathy.output', { key: 0, value: 'reaction of e' })
  t.is(await e, 'reaction of e')

  const f = processed.festive()
  await emit('festive.output', { key: 0, value: 'reaction of f' })
  t.is(await f, 'reaction of f')
})

test.after.always(() => {
  NoKafkaMock.stopAll()
})
