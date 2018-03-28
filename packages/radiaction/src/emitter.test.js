import test from 'ava'
import sinon from 'sinon'
import noKafkaMock from '../mocks/no-kafka'
import emitter from './emitter'

test('flag is ON', t => {
  const processed = emitter({
    a: () => 1,
    b: () => 2,
    c: () => 3,
    d: () => 4,
  })

  t.is(processed.a.__radiaction.emmit, true)
  t.is(processed.b.__radiaction.emmit, true)
  t.is(processed.c.__radiaction.emmit, true)
  t.is(processed.d.__radiaction.emmit, true)
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
