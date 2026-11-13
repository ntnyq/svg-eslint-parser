import { describe, expect, it } from 'vitest'
import { ParseErrorType } from '../src'
import { ErrorHandler } from '../src/diagnostics/errorHandler'
import { sortDiagnostics } from '../src/diagnostics/sortDiagnostics'
import type { ParseDiagnostic } from '../src'

function createDiagnostic(offset: number, message: string): ParseDiagnostic {
  return {
    type: ParseErrorType.UnexpectedToken,
    message,
    range: [offset, offset + 1],
    loc: {
      start: { line: 1, column: offset },
      end: { line: 1, column: offset + 1 },
    },
  }
}

describe('shared diagnostic ordering', () => {
  it('sorts frozen input without changing diagnostic identity or reporting order on ties', () => {
    const late = createDiagnostic(10, 'late')
    const first = createDiagnostic(2, 'first at offset')
    const second = createDiagnostic(2, 'second at offset')
    const input = Object.freeze([late, first, second])
    const sorted = sortDiagnostics(input)
    expect(sorted).toEqual([first, second, late])
    expect(sorted[0]).toBe(first)
    expect(input).toEqual([late, first, second])
    expect(sorted).not.toBe(input)
    expect(sortDiagnostics([])).toEqual([])
  })

  it('orders errors, warnings, combined issues, and formatted output consistently', () => {
    const handler = new ErrorHandler()
    const lateError = createDiagnostic(20, 'late error')
    const earlyError = createDiagnostic(2, 'early error')
    const lateWarning = createDiagnostic(30, 'late warning')
    const earlyWarning = createDiagnostic(2, 'early warning')
    handler.addError(lateError)
    handler.addError(earlyError)
    handler.addWarning(lateWarning)
    handler.addWarning(earlyWarning)

    expect(handler.getErrors()).toEqual([earlyError, lateError])
    expect(handler.getWarnings()).toEqual([earlyWarning, lateWarning])
    expect(handler.getAllIssues()).toEqual([
      earlyError,
      earlyWarning,
      lateError,
      lateWarning,
    ])
    expect(handler.format().split('\n')).toEqual([
      '1:2 [UnexpectedToken] early error',
      '1:2 [UnexpectedToken] early warning',
      '1:20 [UnexpectedToken] late error',
      '1:30 [UnexpectedToken] late warning',
    ])
    expect(handler.errors).toEqual([lateError, earlyError])
    expect(handler.warnings).toEqual([lateWarning, earlyWarning])
  })
})
