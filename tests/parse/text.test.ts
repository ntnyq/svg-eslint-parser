import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'

import { NodeTypes } from '../../src/constants'
import { parseForESLint } from '../../src/parser'
import type { TagNode, TextNode } from '../../src/types'

describe('Text Content Parsing', () => {
  it('should parse simple text content', () => {
    const source = '<div>Hello World</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.type).toBe(NodeTypes.Text)
    expect(text.value).toBe('Hello World')
  })

  it('should parse empty text', () => {
    const source = '<div></div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode

    expect(div.children).toHaveLength(0)
  })

  it('should parse text with whitespace', () => {
    const source = '<div>  Text with spaces  </div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.value).toBe('  Text with spaces  ')
  })

  it('should parse text with newlines', () => {
    const source = $`
      <div>
        Line 1
        Line 2
      </div>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode

    const textNodes = div.children.filter(
      (child: any) => child.type === NodeTypes.Text,
    )
    expect(textNodes.length).toBeGreaterThan(0)
  })

  it('should parse text with special HTML entities', () => {
    const source = '<div>&amp; &lt; &gt; &quot; &apos;</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.value).toBe('&amp; &lt; &gt; &quot; &apos;')
  })

  it('should parse text with numbers', () => {
    const source = '<div>12345 67890</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.value).toBe('12345 67890')
  })

  it('should parse text with punctuation', () => {
    const source = '<div>Hello, World! How are you?</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.value).toBe('Hello, World! How are you?')
  })

  it('should parse text with unicode characters', () => {
    // cSpell: disable-next-line
    const source = '<div>你好世界 🌍 Привет</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    // cSpell: disable-next-line
    expect(text.value).toBe('你好世界 🌍 Привет')
  })

  it('should parse mixed text and tags', () => {
    const source = '<p>Before <strong>bold</strong> after</p>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const p = document.children[0] as TagNode

    expect(p.children[0].type).toBe(NodeTypes.Text)
    expect((p.children[0] as TextNode).value).toBe('Before ')
    expect(p.children[1].type).toBe(NodeTypes.Tag)
    expect(p.children[2].type).toBe(NodeTypes.Text)
    expect((p.children[2] as TextNode).value).toBe(' after')
  })

  it('should parse text between multiple tags', () => {
    const source =
      '<div>Text1<span>Inner</span>Text2<span>Inner2</span>Text3</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode

    const textNodes = div.children.filter(
      (child: any) => child.type === NodeTypes.Text,
    ) as TextNode[]
    expect(textNodes).toHaveLength(3)
    expect(textNodes[0].value).toBe('Text1')
    expect(textNodes[1].value).toBe('Text2')
    expect(textNodes[2].value).toBe('Text3')
  })

  it('should preserve tabs and newlines in text', () => {
    const source = '<div>\tTabbed\n\tText\n</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.value).toContain('\t')
    expect(text.value).toContain('\n')
  })

  it('should parse text with URLs', () => {
    const source = '<div>Visit https://example.com for more info</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.value).toBe('Visit https://example.com for more info')
  })

  it('should parse text with email addresses', () => {
    const source = '<div>Contact: test@example.com</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.value).toBe('Contact: test@example.com')
  })

  it('should parse long text content', () => {
    const longText = 'Lorem ipsum '.repeat(100)
    const source = `<div>${longText}</div>`
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode
    const text = div.children[0] as TextNode

    expect(text.value).toBe(longText)
  })
})
