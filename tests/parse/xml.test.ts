import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'
import { parseForESLint } from '../../src'
import { NodeTypes } from '../../src/constants'

const SVG_SOURCE = $`
  <?xml version="1.0" encoding="UTF-8" standalone="no"?>
`

describe('xml declaration parsing', () => {
  it('should parse', () => {
    const ast = parseForESLint(SVG_SOURCE).ast

    expect(ast.type).toBe(NodeTypes.Program)
    expect(ast.document.type).toBe(NodeTypes.Document)
    expect(ast.document.children[0]?.type).toBe(NodeTypes.Text)
  })
})
