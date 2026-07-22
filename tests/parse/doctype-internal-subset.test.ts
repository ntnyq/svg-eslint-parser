import { describe, expect, it } from 'vitest'
import { NodeTypes, ParseErrorType, parseForESLint } from '../../src'
import type { DoctypeNode, ElementNode } from '../../src/types'

describe('doctype internal subset parsing', () => {
  it('keeps element and entity declarations inside the doctype', () => {
    const source = `<!DOCTYPE svg [
  <!ELEMENT svg ANY>
  <!ENTITY example "<circle />">
  <!ENTITY marker "]>">
]>
<svg>&example;</svg>`
    const { ast } = parseForESLint(source)
    const doctype = ast.document.children[0] as DoctypeNode
    const svg = ast.document.children.find(
      node => node.type === NodeTypes.Element,
    ) as ElementNode

    expect(doctype).toMatchObject({
      type: NodeTypes.Doctype,
      internalSubset:
        '\n  <!ELEMENT svg ANY>\n  <!ENTITY example "<circle />">\n  <!ENTITY marker "]>">\n',
    })
    expect(svg.name).toBe('svg')
    expect(svg.children).toEqual([
      expect.objectContaining({
        type: NodeTypes.Text,
        value: '&example;',
      }),
    ])
  })

  it('recovers an unterminated internal subset', () => {
    const source = '<!DOCTYPE svg [<!ELEMENT svg ANY>'
    const result = parseForESLint(source, { errorRecovery: true })
    const doctype = result.ast.document.children[0] as DoctypeNode

    expect(doctype.internalSubset).toBe('<!ELEMENT svg ANY>')
    expect(doctype.range).toStrictEqual([0, source.length])
    expect(result.services.errors).toEqual([
      expect.objectContaining({
        type: ParseErrorType.InvalidDoctype,
        range: [14, source.length],
      }),
    ])
  })
})
