import { describe, expect, it } from 'vitest'
import { parseForESLint } from '../../src'
import { NodeTypes } from '../../src/constants'
import { unindent as $ } from '../helpers/unindent'

const SVG_SOURCE = $`
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg />
`

describe('doctype parsing', () => {
  it('should parse', () => {
    const ast = parseForESLint(SVG_SOURCE).ast

    expect(ast.type).toBe(NodeTypes.Program)
    expect(ast.document.children[0]?.type).toBe(NodeTypes.Doctype)
  })
})
