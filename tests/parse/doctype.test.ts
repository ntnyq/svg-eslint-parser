import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'
import { parseForESLint } from '../../src'
import { NodeTypes } from '../../src/constants'

const SVG_SOURCE = $`
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN">
`

describe('doctype parsing', () => {
  it('should parse', () => {
    const ast = parseForESLint(SVG_SOURCE).ast

    expect(ast.type).toBe(NodeTypes.Program)
    expect(ast.document.children[0]?.type).toBe(NodeTypes.Doctype)
  })
})
