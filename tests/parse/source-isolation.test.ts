import { describe, expect, it } from 'vitest'
import { parse, parseForESLint } from '../../src'

describe('source location isolation', () => {
  it('keeps document positions independent across parser entry points', () => {
    const first = parse('<svg/>')
    const second = parseForESLint('<svg/>').ast.document

    try {
      first.loc.start.line = 99
      first.loc.start.column = 42
      first.loc.end.column = 100
      first.range[0] = 10

      expect(second.loc).toEqual({
        start: { line: 1, column: 0 },
        end: { line: 1, column: 6 },
      })
      expect(second.range).toEqual([0, 6])
      expect(parse('<g/>').loc.start).toEqual({ line: 1, column: 0 })
    } finally {
      first.loc.start.line = 1
      first.loc.start.column = 0
    }
  })

  it('creates independent ranges and locations for recovered empty documents', () => {
    const first = parse('', { errorRecovery: true })
    const second = parseForESLint('', { errorRecovery: true }).ast.document

    try {
      first.range[0] = 10
      first.loc.start.line = 99
      first.loc.end.column = 42

      expect(second.range).toEqual([0, 0])
      expect(second.loc).toEqual({
        start: { line: 1, column: 0 },
        end: { line: 1, column: 0 },
      })
      const third = parse('', { errorRecovery: true })
      expect(third.range).toEqual([0, 0])
      expect(third.loc).toEqual(second.loc)
    } finally {
      first.range[0] = 0
      first.loc.start.line = 1
      first.loc.end.column = 0
    }
  })
})
