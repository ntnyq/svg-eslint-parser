import { describe, expect, it } from 'vitest'
import * as parserSVG from '../src'

describe('meta', () => {
  it('should meta valid', () => {
    expect(parserSVG.meta.name).toMatchInlineSnapshot(`"svg-eslint-parser"`)
    expect(parserSVG.meta).toHaveProperty(['version'])
  })
})
