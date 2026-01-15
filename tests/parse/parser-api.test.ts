import { describe, expect, it } from 'vitest'

import { NodeTypes } from '../../src/constants'
import { parse, parseForESLint } from '../../src/parser'
import type { CommentNode, TagNode, TextNode } from '../../src/types'

describe('Parser API', () => {
  describe('parseForESLint', () => {
    it('should return Program node', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.ast.type).toBe(NodeTypes.Program)
    })

    it('should include body array', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(Array.isArray(result.ast.body)).toBe(true)
      expect(result.ast.body).toHaveLength(1)
      expect(result.ast.body[0].type).toBe(NodeTypes.Document)
    })

    it('should include visitorKeys', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.visitorKeys).toBeDefined()
      expect(typeof result.visitorKeys).toBe('object')
    })

    it('should include services with isSVG flag', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.services).toBeDefined()
      expect(result.services.isSVG).toBe(true)
    })

    it('should include tokens array', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(Array.isArray(result.ast.tokens)).toBe(true)
      expect(result.ast.tokens.length).toBeGreaterThan(0)
    })

    it('should include comments array', () => {
      const source = '<!-- Comment --><div>Test</div>'
      const result = parseForESLint(source)

      expect(Array.isArray(result.ast.comments)).toBe(true)
      expect(result.ast.comments.length).toBeGreaterThan(0)
    })

    it('should have range and loc', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.ast.range).toBeDefined()
      expect(result.ast.loc).toBeDefined()
    })

    it('should include range information', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.ast.range).toBeDefined()
      expect(Array.isArray(result.ast.range)).toBe(true)
      expect(result.ast.range).toHaveLength(2)
    })

    it('should include location information', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.ast.loc).toBeDefined()
      expect(result.ast.loc.start).toBeDefined()
      expect(result.ast.loc.end).toBeDefined()
    })

    it('should return null scopeManager', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.scopeManager).toBeNull()
    })
  })

  describe('parse', () => {
    it('should return Document node directly', () => {
      const source = '<div>Test</div>'
      const result = parse(source)

      expect(result.ast.type).toBe(NodeTypes.Document)
    })

    it('should include children', () => {
      const source = '<div>Test</div>'
      const result = parse(source)

      expect(Array.isArray(result.ast.children)).toBe(true)
      expect(result.ast.children.length).toBeGreaterThan(0)
    })

    it('should include range information', () => {
      const source = '<div>Test</div>'
      const result = parse(source)

      expect(result.ast.range).toBeDefined()
      expect(Array.isArray(result.ast.range)).toBe(true)
    })

    it('should include location information', () => {
      const source = '<div>Test</div>'
      const result = parse(source)

      expect(result.ast.loc).toBeDefined()
      expect(result.ast.loc.start.line).toBe(1)
      expect(result.ast.loc.start.column).toBe(0)
    })

    it('should parse empty source', () => {
      const source = ''
      const result = parse(source)

      expect(result.ast.type).toBe(NodeTypes.Document)
      expect(result.ast.children).toHaveLength(0)
    })

    it('should parse multiple root elements', () => {
      const source = '<div></div><span></span>'
      const result = parse(source)

      expect(result.ast.children).toHaveLength(2)
    })
  })

  describe('Range and Location accuracy', () => {
    it('should have correct start position', () => {
      const source = '<div>Test</div>'
      const result = parse(source)

      expect(result.ast.range[0]).toBe(0)
      expect(result.ast.loc.start.line).toBe(1)
      expect(result.ast.loc.start.column).toBe(0)
    })

    it('should have correct end position', () => {
      const source = '<div>Test</div>'
      const result = parse(source)

      expect(result.ast.range[1]).toBe(source.length)
      expect(result.ast.loc.end.column).toBe(source.length)
    })

    it('should track positions correctly in multi-line', () => {
      const source = '<div>\n  <span>Test</span>\n</div>'
      const result = parse(source)
      const div = result.ast.children[0]

      expect(div.loc.start.line).toBe(1)
      expect(div.loc.end.line).toBe(3)
    })

    it('should track column positions correctly', () => {
      const source = '  <div>Test</div>'
      const result = parse(source)
      const text = result.ast.children[0] // First child is whitespace text

      // The div tag starts at column 2
      expect(text.type).toBe(NodeTypes.Text)
      expect(text.loc.start.column).toBe(0) // Text starts at column 0
    })
  })

  describe('Node structure validation', () => {
    it('should have valid Tag node structure', () => {
      const source = '<div id="test">Content</div>'
      const result = parse(source)
      const div = result.ast.children[0] as TagNode

      expect(div.type).toBe(NodeTypes.Tag)
      expect(div.name).toBe('div')
      expect(div.attributes).toBeDefined()
      expect(div.children).toBeDefined()
      expect(div.selfClosing).toBe(false)
    })

    it('should have valid Attribute node structure', () => {
      const source = '<div id="test"></div>'
      const result = parse(source)
      const div = result.ast.children[0] as TagNode
      const attr = div.attributes[0]

      expect(attr.type).toBe(NodeTypes.Attribute)
      expect(attr.key).toBeDefined()
      expect(attr.value).toBeDefined()
      expect(attr.range).toBeDefined()
      expect(attr.loc).toBeDefined()
    })

    it('should have valid Comment node structure', () => {
      const source = '<!-- Comment -->'
      const result = parse(source)
      const comment = result.ast.children[0] as CommentNode

      expect(comment.type).toBe(NodeTypes.Comment)
      expect(comment.content).toBeDefined()
    })

    it('should have valid Text node structure', () => {
      const source = '<div>Text content</div>'
      const result = parse(source)
      const div = result.ast.children[0] as TagNode
      const text = div.children[0] as TextNode

      expect(text.type).toBe(NodeTypes.Text)
      expect(text.range).toBeDefined()
      expect(text.loc).toBeDefined()
    })
  })

  describe('Visitor keys', () => {
    it('should include Document in visitor keys', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.visitorKeys.Document).toBeDefined()
    })

    it('should include Tag in visitor keys', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(result.visitorKeys.Tag).toBeDefined()
    })

    it('should define traversable properties', () => {
      const source = '<div>Test</div>'
      const result = parseForESLint(source)

      expect(Array.isArray(result.visitorKeys.Document)).toBe(true)
      expect(result.visitorKeys.Document.includes('children')).toBe(true)
    })
  })

  describe('Error handling', () => {
    it('should not throw on malformed input', () => {
      expect(() => parse('<div')).not.toThrow()
      expect(() => parse('<div></span>')).not.toThrow()
      expect(() => parse('<<div>>')).not.toThrow()
    })

    it('should produce valid AST even with errors', () => {
      const result = parse('<div')
      expect(result.ast.type).toBe(NodeTypes.Document)
      expect(result.ast.children).toBeDefined()
    })
  })
})
