import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'
import { NodeTypes } from '../../src/constants'
import { parseForESLint } from '../../src/parser'
import type { ElementNode } from '../../src/types'

describe('element parsing', () => {
  it('should parse self-closing elements with />', () => {
    const source = '<circle cx="50" cy="50" r="40" />'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.type).toBe(NodeTypes.Element)
    expect(element.selfClosing).toBeTruthy()
    expect(element.children).toHaveLength(0)
  })

  it('should parse elements with opening and closing elements', () => {
    const source = '<div>Content</div>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.selfClosing).toBeFalsy()
  })

  it('should parse nested elements', () => {
    const source = $`
      <div>
        <span>
          <strong>Text</strong>
        </span>
      </div>
    `
    const { ast } = parseForESLint(source)
    const document = ast.document
    const div = document.children[0] as ElementNode
    const span = div.children[1] as any // children[0] is whitespace

    expect(div.name).toBe('div')
    expect(span.type).toBe(NodeTypes.Element)
    expect(span.name).toBe('span')
  })

  it('should parse elements with mixed content', () => {
    const source = '<p>Text before <strong>bold</strong> text after</p>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const p = document.children[0] as ElementNode

    expect(p.children).toHaveLength(3)
    expect(p.children[0].type).toBe(NodeTypes.Text)
    expect(p.children[1].type).toBe(NodeTypes.Element)
    expect(p.children[2].type).toBe(NodeTypes.Text)
  })

  it('should parse empty elements', () => {
    const source = '<div></div>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.children).toHaveLength(0)
  })

  it('should parse elements with only whitespace', () => {
    const source = '<div>   \n\t  </div>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.children).toHaveLength(1)
    expect(element.children[0].type).toBe(NodeTypes.Text)
  })

  it('should parse multiple sibling elements', () => {
    const source = '<div></div><span></span><p></p>'
    const { ast } = parseForESLint(source)
    const document = ast.document

    expect(document.children).toHaveLength(3)
    expect((document.children[0] as ElementNode).name).toBe('div')
    expect((document.children[1] as ElementNode).name).toBe('span')
    expect((document.children[2] as ElementNode).name).toBe('p')
  })

  it('should parse elements with uppercase names', () => {
    const source = '<DIV><SPAN>Text</SPAN></DIV>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    // Parser converts elements to lowercase
    expect(element.name).toBe('div')
    expect((element.children[0] as ElementNode).name).toBe('span')
  })

  it('should parse elements with numbers in names', () => {
    const source = '<h1>Heading</h1><h2>Subheading</h2>'
    const { ast } = parseForESLint(source)
    const document = ast.document

    expect((document.children[0] as ElementNode).name).toBe('h1')
    expect((document.children[1] as ElementNode).name).toBe('h2')
  })

  it('should parse elements with hyphens in names', () => {
    const source = '<custom-element></custom-element>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.name).toBe('custom-element')
  })

  it('should parse deeply nested elements', () => {
    const source = '<a><b><c><d><e>Text</e></d></c></b></a>'
    const { ast } = parseForESLint(source)
    const document = ast.document

    let current = document.children[0] as ElementNode
    expect(current.name).toBe('a')

    current = current.children[0] as ElementNode
    expect(current.name).toBe('b')

    current = current.children[0] as ElementNode
    expect(current.name).toBe('c')

    current = current.children[0] as ElementNode
    expect(current.name).toBe('d')

    current = current.children[0] as ElementNode
    expect(current.name).toBe('e')
  })

  it('should parse SVG-specific elements', () => {
    const source = $`
      <svg>
        <circle />
        <rect />
        <path />
        <polygon />
        <line />
        <ellipse />
      </svg>
    `
    const { ast } = parseForESLint(source)
    const document = ast.document
    const svg = document.children[0] as ElementNode

    const tagNames = svg.children
      .filter((child: any) => child.type === NodeTypes.Element)
      .map((child: any) => child.name)

    expect(tagNames).toStrictEqual([
      'circle',
      'rect',
      'path',
      'polygon',
      'line',
      'ellipse',
    ])
  })

  it('should parse elements with namespace prefixes', () => {
    const source = '<svg:circle xmlns:svg="http://www.w3.org/2000/svg" />'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.name).toBe('svg:circle')
  })
})
