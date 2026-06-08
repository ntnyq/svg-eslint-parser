import { describe, expect, it } from 'vitest'
import { NodeTypes } from '../../src/constants'
import { parseForESLint } from '../../src/parser'
import type { ElementNode } from '../../src/types'

describe('attribute parsing', () => {
  it('should parse attributes with double quotes', () => {
    const source = '<svg width="100" height="200"></svg>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.type).toBe(NodeTypes.Element)
    expect(element.attributes).toHaveLength(2)
    expect(element.attributes[0].key.value).toBe('width')
    expect(element.attributes[0].value?.value).toBe('100')
    expect(element.attributes[1].key.value).toBe('height')
    expect(element.attributes[1].value?.value).toBe('200')
  })

  it('should parse attributes with single quotes', () => {
    const source = "<svg width='100' height='200'></svg>"
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes[0].value?.value).toBe('100')
    expect(element.attributes[1].value?.value).toBe('200')
  })

  it('should parse attributes without values', () => {
    const source = '<input checked disabled />'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes).toHaveLength(2)
    expect(element.attributes[0].key.value).toBe('checked')
    expect(element.attributes[0].value).toBeUndefined()
    expect(element.attributes[1].key.value).toBe('disabled')
    expect(element.attributes[1].value).toBeUndefined()
  })

  it('should parse attributes with empty values', () => {
    const source = '<div class="" id=""></div>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes[0].value?.value).toBe('')
    expect(element.attributes[1].value?.value).toBe('')
  })

  it('should parse attributes with special characters', () => {
    const source =
      '<svg data-value="foo@bar.com" aria-label="Test & Demo"></svg>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes[0].value?.value).toBe('foo@bar.com')
    expect(element.attributes[1].value?.value).toBe('Test & Demo')
  })

  it('should parse attributes with spaces in values', () => {
    const source = '<div title="Hello World" class="btn btn-primary"></div>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes[0].value?.value).toBe('Hello World')
    expect(element.attributes[1].value?.value).toBe('btn btn-primary')
  })

  it('should parse attributes with namespaces', () => {
    const source = '<svg xmlns:xlink="http://www.w3.org/1999/xlink"></svg>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes[0].key.value).toBe('xmlns:xlink')
    expect(element.attributes[0].value?.value).toBe(
      'http://www.w3.org/1999/xlink',
    )
  })

  it('should parse multiple attributes with various spacing', () => {
    const source = '<div  class="test"   id="main"    data-foo="bar"  ></div>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes).toHaveLength(3)
    expect(element.attributes[0].key.value).toBe('class')
    expect(element.attributes[1].key.value).toBe('id')
    expect(element.attributes[2].key.value).toBe('data-foo')
  })

  it('should parse attributes with numbers', () => {
    const source = '<circle cx="50" cy="50" r="40"></circle>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes[0].value?.value).toBe('50')
    expect(element.attributes[1].value?.value).toBe('50')
    expect(element.attributes[2].value?.value).toBe('40')
  })

  it('should parse attributes with hyphens and underscores', () => {
    const source = '<div data-test-id="123" data_value="test"></div>'
    const { ast } = parseForESLint(source)
    const document = ast.document
    const element = document.children[0] as ElementNode

    expect(element.attributes[0].key.value).toBe('data-test-id')
    expect(element.attributes[1].key.value).toBe('data_value')
  })
})
