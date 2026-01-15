import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'

import { NodeTypes } from '../../src/constants'
import { parseForESLint } from '../../src/parser'
import type { TagNode } from '../../src/types'

describe('Tag Parsing', () => {
  it('should parse self-closing tags with />', () => {
    const source = '<circle cx="50" cy="50" r="40" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.type).toBe(NodeTypes.Tag)
    expect(tag.selfClosing).toBe(true)
    expect(tag.children).toHaveLength(0)
  })

  it('should parse tags with opening and closing tags', () => {
    const source = '<div>Content</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.selfClosing).toBe(false)
  })

  it('should parse nested tags', () => {
    const source = $`
      <div>
        <span>
          <strong>Text</strong>
        </span>
      </div>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const span = div.children[1] as any // children[0] is whitespace

    expect(div.name).toBe('div')
    expect(span.type).toBe(NodeTypes.Tag)
    expect(span.name).toBe('span')
  })

  it('should parse tags with mixed content', () => {
    const source = '<p>Text before <strong>bold</strong> text after</p>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const p = document.children[0] as TagNode

    expect(p.children).toHaveLength(3)
    expect(p.children[0].type).toBe(NodeTypes.Text)
    expect(p.children[1].type).toBe(NodeTypes.Tag)
    expect(p.children[2].type).toBe(NodeTypes.Text)
  })

  it('should parse empty tags', () => {
    const source = '<div></div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.children).toHaveLength(0)
  })

  it('should parse tags with only whitespace', () => {
    const source = '<div>   \n\t  </div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.children).toHaveLength(1)
    expect(tag.children[0].type).toBe(NodeTypes.Text)
  })

  it('should parse multiple sibling tags', () => {
    const source = '<div></div><span></span><p></p>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.children).toHaveLength(3)
    expect((document.children[0] as TagNode).name).toBe('div')
    expect((document.children[1] as TagNode).name).toBe('span')
    expect((document.children[2] as TagNode).name).toBe('p')
  })

  it('should parse tags with uppercase names', () => {
    const source = '<DIV><SPAN>Text</SPAN></DIV>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    // Parser converts tags to lowercase
    expect(tag.name).toBe('div')
    expect((tag.children[0] as TagNode).name).toBe('span')
  })

  it('should parse tags with numbers in names', () => {
    const source = '<h1>Heading</h1><h2>Subheading</h2>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect((document.children[0] as TagNode).name).toBe('h1')
    expect((document.children[1] as TagNode).name).toBe('h2')
  })

  it('should parse tags with hyphens in names', () => {
    const source = '<custom-element></custom-element>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.name).toBe('custom-element')
  })

  it('should parse deeply nested tags', () => {
    const source = '<a><b><c><d><e>Text</e></d></c></b></a>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    let current = document.children[0] as TagNode
    expect(current.name).toBe('a')

    current = current.children[0] as TagNode
    expect(current.name).toBe('b')

    current = current.children[0] as TagNode
    expect(current.name).toBe('c')

    current = current.children[0] as TagNode
    expect(current.name).toBe('d')

    current = current.children[0] as TagNode
    expect(current.name).toBe('e')
  })

  it('should parse SVG-specific tags', () => {
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
    const document = ast.body[0]
    const svg = document.children[0] as TagNode

    const tagNames = svg.children
      .filter((child: any) => child.type === NodeTypes.Tag)
      .map((child: any) => child.name)

    expect(tagNames).toEqual([
      'circle',
      'rect',
      'path',
      'polygon',
      'line',
      'ellipse',
    ])
  })

  it('should parse tags with namespace prefixes', () => {
    const source = '<svg:circle xmlns:svg="http://www.w3.org/2000/svg" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.name).toBe('svg:circle')
  })
})
