import test from 'ava'
import runner from './runner'

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
  const action = () => 'A'
  action.__radiaction = {
    x: -1,
    y: -2,
    z: -3,
  }

  const processed = runner({
    amazing: action,
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
