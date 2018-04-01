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
