import { describe, expect, it } from 'vitest'
import { parseCloseTagName, parseOpenTagName } from '../src/utils'

describe('parse tag name utilities', () => {
  describe(parseOpenTagName, () => {
    it('parses and normalizes an uppercase open tag', () => {
      expect(parseOpenTagName('<SVG width="100">')).toBe('svg')
    })

    it('parses custom open tag names', () => {
      expect(parseOpenTagName('<custom-element-123 data-x="1">')).toBe(
        'custom-element-123',
      )
    })

    it('throws for invalid open tag input', () => {
      expect(() => parseOpenTagName('not-a-tag')).toThrow(
        'Unable to parse open tag name.',
      )
    })
  })

  describe(parseCloseTagName, () => {
    it('parses and normalizes an uppercase close tag', () => {
      expect(parseCloseTagName('</SVG>')).toBe('svg')
    })

    it('trims whitespace around close tag names', () => {
      expect(parseCloseTagName('</  g  >')).toBe('g')
    })

    it('parses close tag names containing namespace separators', () => {
      expect(parseCloseTagName('</ns:tag-name.with-dots>')).toBe(
        'ns:tag-name.with-dots',
      )
    })

    it('throws for invalid close tag input', () => {
      expect(() => parseCloseTagName('<svg>')).toThrow(
        'Unable to parse close tag name.',
      )
    })
  })
})
