import { describe, expect, it, vi } from 'vitest'
import { parse, ParseError } from '../src'

vi.mock('../src/parser/parseForESLint', () => ({
  parseForESLint() {
    throw new Error('The document parser must not call the ESLint adapter.')
  },
}))

describe('document parser isolation', () => {
  it('parses a document independently of the ESLint adapter', () => {
    expect(parse('<!-- comment --><svg a="1"/>')).toMatchObject({
      type: 'Document',
      children: [{ type: 'Comment' }, { type: 'Element', name: 'svg' }],
    })
  })

  it('applies strict and recovery modes without the ESLint adapter', () => {
    expect(() => parse('<svg')).toThrow(ParseError)
    expect(parse('<svg', { errorRecovery: true })).toMatchObject({
      type: 'Document',
      children: [{ type: 'Element', name: 'svg' }],
    })
  })
})
