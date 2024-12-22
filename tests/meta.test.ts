import { expect, it } from 'vitest'
import * as parserSVG from '../src'

it('should meta valid', () => {
  expect(parserSVG.meta.name).toMatchInlineSnapshot(`"svg-eslint-parser"`)
  expect(parserSVG.meta).toHaveProperty(['version'])
})
