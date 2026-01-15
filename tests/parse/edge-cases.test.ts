import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'

import { NodeTypes } from '../../src/constants'
import { parseForESLint } from '../../src/parser'
import type { TagNode, TextNode } from '../../src/types'

describe('Edge Cases', () => {
  it('should handle empty input', () => {
    const source = ''
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.type).toBe(NodeTypes.Document)
    expect(document.children).toHaveLength(0)
  })

  it('should handle whitespace-only input', () => {
    const source = '   \n\t  '
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.children).toHaveLength(1)
    expect(document.children[0].type).toBe(NodeTypes.Text)
  })

  it('should handle unclosed tags gracefully', () => {
    const source = '<div><span>Text'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.type).toBe(NodeTypes.Document)
    // Parser should still produce some output
    expect(document.children.length).toBeGreaterThan(0)
  })

  it('should handle mismatched tags', () => {
    const source = '<div></span>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.type).toBe(NodeTypes.Document)
    expect(document.children.length).toBeGreaterThan(0)
  })

  it('should handle tags with no closing bracket', () => {
    const source = '<div'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.type).toBe(NodeTypes.Document)
  })

  it('should handle multiple root elements', () => {
    const source = '<div></div><span></span><p></p>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.children).toHaveLength(3)
    expect(document.children[0].type).toBe(NodeTypes.Tag)
    expect(document.children[1].type).toBe(NodeTypes.Tag)
    expect(document.children[2].type).toBe(NodeTypes.Tag)
  })

  it('should handle very deeply nested structure', () => {
    let source = '<a>'
    for (let i = 0; i < 50; i++) {
      source += '<b>'
    }
    source += 'Text'
    for (let i = 0; i < 50; i++) {
      source += '</b>'
    }
    source += '</a>'

    const { ast } = parseForESLint(source)
    expect(ast.body[0].type).toBe(NodeTypes.Document)
  })

  it('should handle tag names with unusual characters', () => {
    const source = '<custom-element-123></custom-element-123>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.name).toBe('custom-element-123')
  })

  it('should handle attributes without spaces', () => {
    const source = '<div class="test"id="main"data-value="foo"></div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.attributes.length).toBeGreaterThan(0)
  })

  it('should handle mixed case in tag names', () => {
    const source = '<DiV><SpAn>Text</SpAn></DiV>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    // Parser converts to lowercase
    expect((document.children[0] as TagNode).name).toBe('div')
    expect(
      ((document.children[0] as TagNode).children[0] as TagNode).name,
    ).toBe('span')
  })

  it('should handle self-closing tags without space before slash', () => {
    const source = '<img/>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    // Parser may or may not treat this as self-closing based on implementation
    expect(tag.type).toBe(NodeTypes.Tag)
  })

  it('should handle attributes with no value and no equals', () => {
    const source = '<input checked>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.attributes[0].key.value).toBe('checked')
    expect(tag.attributes[0].value).toBeUndefined()
  })

  it('should handle large number of attributes', () => {
    let source = '<div '
    for (let i = 0; i < 100; i++) {
      source += `attr${i}="value${i}" `
    }
    source += '></div>'

    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.attributes.length).toBe(100)
  })

  it('should handle large number of sibling elements', () => {
    let source = ''
    for (let i = 0; i < 100; i++) {
      source += `<div>Text ${i}</div>`
    }

    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.children.length).toBe(100)
  })

  it('should handle comments with unusual content', () => {
    const source = '<!-- <!-- nested? --> -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.children.length).toBeGreaterThan(0)
  })

  it('should handle special characters in tag names', () => {
    const source = '<ns:tag-name.with-dots></ns:tag-name.with-dots>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.children.length).toBeGreaterThan(0)
  })

  it('should handle consecutive text nodes', () => {
    const source = '<div>Text1Text2Text3</div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode

    expect(div.children[0].type).toBe(NodeTypes.Text)
    expect((div.children[0] as TextNode).value).toBe('Text1Text2Text3')
  })

  it('should handle extremely long attribute values', () => {
    const longValue = 'x'.repeat(10000)
    const source = `<div data-long="${longValue}"></div>`
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.attributes[0].value?.value).toBe(longValue)
  })

  it('should handle newlines in attribute values', () => {
    const source = $`
      <div title="Line 1
      Line 2
      Line 3"></div>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const tag = document.children[0] as TagNode

    expect(tag.attributes[0].value?.value).toContain('\n')
  })
})
