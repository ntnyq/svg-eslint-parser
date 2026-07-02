import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'
import { parseForESLint } from '../../src'
import { NodeTypes } from '../../src/constants'
import type { XMLDeclarationNode } from '../../src/types'

const SVG_SOURCE = $`
  <?xml version="1.0" encoding="UTF-8" standalone="no"?>
`

describe('xml declaration parsing', () => {
  it('should parse', () => {
    const ast = parseForESLint(SVG_SOURCE).ast
    const declaration = ast.document.children[0] as XMLDeclarationNode

    expect(ast.type).toBe(NodeTypes.Program)
    expect(ast.document.type).toBe(NodeTypes.Document)
    expect(declaration.type).toBe(NodeTypes.XMLDeclaration)
    expect(
      declaration.attributes.map(attribute => attribute.key.value),
    ).toStrictEqual(['version', 'encoding', 'standalone'])
    expect(declaration.attributes[0].value?.value).toBe('1.0')
  })
})
