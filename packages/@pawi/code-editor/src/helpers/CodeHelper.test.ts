import { describe, it, expect } from 'test'
import { compileCode } from './CodeHelper'

describe('CodeHelper compileCode', () => {
  it('should return errors on invalid code', () => {
    return compileCode('x').then(({ js, errors }) => {
      expect(js).toBe(undefined)

      expect(errors[0]).toEqual({
        message: "Cannot find name 'x'.",
        line: 0,
        ch: 0,
      })
    })
  })

  it('should recognize lucidity', (assert, done) => {
    const src = "import { Meta } from 'lucidity'"
    compileCode(src, ({ js, errors }) => {
      assert.same(errors, undefined)
      assert.equal(js, '"use strict";\n')
      done()
    })
  })

  it('should recognize browser libs', (assert, done) => {
    const src = 'window.boom()'
    compileCode(src, ({ js, errors }) => {
      assert.equal(
        "Property 'boom' does not exist on type 'Window'.",
        errors[0].message
      )
      done()
    })
  })
})

describe('CodeHelper compileCode scrub', (it, setupDone) => {
  const src = `// This is a comment
   export const init =
   ( { context } ) => {
     const foo = ( a, b ) => a + b
     const x = 0
     context.test.a = 10
     context.test.b = -20
     context.test.x = x - 30
     context.test.y = - 40
     foo ( -  50 , 60 )
     const bar = { x: -70, y: [ - 80, 90, 100 - 110 ] }
   }

   export const update =
   () => {
     return 120
   }
  `

  let scrub, errors
  compileCode(src, res => {
    errors = res.errors
    scrub = res.scrub
    setupDone()
  })

  it('should compile', assert => {
    assert.same(errors, undefined)
  })

  it('should get values with unary minus', assert => {
    assert.equal(scrub.literals.map(l => l.value), [
      0,
      10,
      -20,
      30,
      -40,
      -50,
      60,
      -70,
      -80,
      90,
      100,
      110,
      120,
    ])
  })

  it('should get literal position', assert => {
    assert.equal(scrub.literals.map(l => l.line), [
      4,
      5,
      6,
      7,
      8,
      9,
      9,
      10,
      10,
      10,
      10,
      10,
      15,
    ])
  })
})
