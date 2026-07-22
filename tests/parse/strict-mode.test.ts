import { describe, expect, it } from 'vitest'
import { NodeTypes, parse, ParseError, parseForESLint } from '../../src'

describe('parser error recovery mode', () => {
  it('throws a positioned ParseError by default', () => {
    let thrown: unknown

    try {
      parseForESLint('<svg')
    } catch (error) {
      thrown = error
    }

    expect.assert(thrown instanceof ParseError)
    expect(thrown).toMatchObject({
      name: 'ParseError',
      index: 0,
      lineNumber: 1,
      column: 1,
    })
    expect(thrown.message).toBe('Unterminated opening tag.')
  })

  it('returns a recovered ESLint result when enabled', () => {
    const result = parseForESLint('<svg', { errorRecovery: true })

    expect(result.ast.document.children[0]).toMatchObject({
      type: NodeTypes.Element,
      name: 'svg',
    })
    expect(result.services.errors).not.toHaveLength(0)
  })

  it('applies strict mode to the direct public parser', () => {
    expect(() => parse('<svg')).toThrow(ParseError)

    const document = parse('<svg', { errorRecovery: true })
    expect(document.children[0]).toMatchObject({
      type: NodeTypes.Element,
      name: 'svg',
    })
  })

  it('parses valid source without recovery options', () => {
    expect(parse('<svg />')).toMatchObject({
      type: NodeTypes.Document,
      children: [expect.objectContaining({ type: NodeTypes.Element })],
    })
  })
})
