import test from 'ava'
import noKafka from '../mocks/no-kafka'
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

test('name stays', t => {
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
