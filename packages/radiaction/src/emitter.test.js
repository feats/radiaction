import test from 'ava'
import sinon from 'sinon'
import NoKafkaMock from '../mocks/no-kafka'
import emitter from './emitter'

test('flag is ON', t => {
  const processed = emitter({
    a: () => 1,
    b: () => 2,
    c: () => 3,
    d: () => 4,
  })

  t.is(processed.a.__radiaction.emit, true)
  t.is(processed.b.__radiaction.emit, true)
  t.is(processed.c.__radiaction.emit, true)
  t.is(processed.d.__radiaction.emit, true)
})

test('previous metadata is not lost', t => {
  const action = () => 1
  action.__radiaction = {
    x: -1,
    y: -2,
    z: -3,
  }

  const processed = emitter({
    a: action,
  })

  t.deepEqual(processed.a.__radiaction, { emit: true, z: -3, y: -2, x: -1 })
})

test(`names don't change`, t => {
  const processed = emitter({
    a: () => 1,
    b: () => 2,
    c: () => 3,
    d: () => 4,
  })

  t.is(processed.a.name, 'a')
  t.is(processed.b.name, 'b')
  t.is(processed.c.name, 'c')
  t.is(processed.d.name, 'd')
})

test('arguments are passed down', async t => {
  const actions = {
    a: sinon.spy().named('a'),
    b: sinon.spy().named('b'),
    c: sinon.spy().named('c'),
    d: sinon.spy().named('d'),
  }

  const processed = emitter(actions)
  await processed.a('a0', 'a1', 'a3')
  await processed.b('b0', 'b1', 'b3')
  await processed.c('c0', 'c1', 'c3')
  await processed.d('d0', 'd1', 'd3')

  t.true(actions.a.calledOnceWithExactly('a0', 'a1', 'a3'), actions.a.args.toString())
  t.true(actions.b.calledOnceWithExactly('b0', 'b1', 'b3'), actions.b.args.toString())
  t.true(actions.c.calledOnceWithExactly('c0', 'c1', 'c3'), actions.c.args.toString())
  t.true(actions.d.calledOnceWithExactly('d0', 'd1', 'd3'), actions.d.args.toString())
})

test('message broker is called with compatible descriptor', async t => {
  const processed = emitter({
    a: () => 'A',
    b: () => ({ b: 'B' }),
    c: () => ({ foo: 'bar', value: 'C' }),
    d: () => ({ value: 'D' }),
    e: () => ({ key: 'e', value: 'E' }),
  })

  await t.throws(processed.b, `plain objects sent to a emitter need to contain the 'value' field`)
  await t.throws(
    processed.c,
    `plain objects sent to a emitter can only contain fields 'value' and 'key'`
  )

  const output = {
    a: await processed.a(),
    d: await processed.d(),
    e: await processed.e(),
  }

  t.is(output.a.partition.constructor, Number)
  t.is(output.a.offset.constructor, Number)
  t.is(output.d.partition.constructor, Number)
  t.is(output.d.offset.constructor, Number)
  t.is(output.e.partition.constructor, Number)
  t.is(output.e.offset.constructor, Number)

  t.deepEqual(output.a, {
    topic: 'a',
    error: null,
    partition: output.a.partition,
    offset: output.a.offset,
  })

  t.deepEqual(output.d, {
    topic: 'd',
    error: null,
    partition: output.d.partition,
    offset: output.d.offset,
  })

  t.deepEqual(output.e, {
    topic: 'e',
    error: null,
    partition: output.e.partition,
    offset: output.e.offset,
  })
})

test.after.always(() => {
  NoKafkaMock.stopAll()
})
