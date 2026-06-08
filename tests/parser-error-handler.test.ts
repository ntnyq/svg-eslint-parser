import { describe, expect, it } from 'vitest'
import { NodeTypes } from '../src/constants'
import { ParseError } from '../src/parser/error'
import { ErrorHandler } from '../src/parser/errorHandler'
import { traverse } from '../src/parser/traverse'
import { ParseErrorType } from '../src/types/errors'

function createIssue(
  type: ParseErrorType,
  rangeStart: number,
  message: string,
) {
  return {
    type,
    message,
    range: [rangeStart, rangeStart + 1] as [number, number],
    loc: {
      start: { line: 1, column: rangeStart },
      end: { line: 1, column: rangeStart + 1 },
    },
  }
}

describe('parser errors', () => {
  it('creates ParseError with expected metadata', () => {
    const error = new ParseError('Unexpected token', 12, 3, 5)

    expect(error).toBeInstanceOf(SyntaxError)
    expect(error.name).toBe('ParseError')
    expect(error.message).toBe('Unexpected token')
    expect(error.index).toBe(12)
    expect(error.lineNumber).toBe(3)
    expect(error.column).toBe(5)
  })
})

describe('error handler', () => {
  it('adds and reports errors/warnings', () => {
    const handler = new ErrorHandler()

    expect(handler.hasErrors()).toBeFalsy()
    expect(handler.hasWarnings()).toBeFalsy()

    handler.addError(createIssue(ParseErrorType.UnexpectedToken, 6, 'error'))
    handler.addWarning(createIssue(ParseErrorType.UnclosedTag, 10, 'warning'))

    expect(handler.hasErrors()).toBeTruthy()
    expect(handler.hasWarnings()).toBeTruthy()
    expect(handler.getErrors()).toHaveLength(1)
    expect(handler.getWarnings()).toHaveLength(1)
  })

  it('returns defensive copies for issue lists', () => {
    const handler = new ErrorHandler()
    handler.addError(
      createIssue(ParseErrorType.MalformedComment, 2, 'bad comment'),
    )

    const errors = handler.getErrors()
    errors.push(
      createIssue(ParseErrorType.UnexpectedToken, 8, 'mutated copy') as any,
    )

    expect(handler.getErrors()).toHaveLength(1)
  })

  it('merges handlers and sorts all issues by range start', () => {
    const left = new ErrorHandler()
    const right = new ErrorHandler()

    left.addWarning(createIssue(ParseErrorType.UnclosedTag, 30, 'late warning'))
    right.addError(
      createIssue(ParseErrorType.UnexpectedToken, 5, 'early error'),
    )

    left.mergeErrors(right)

    const all = left.getAllIssues()
    expect(all.map(issue => issue.range[0])).toStrictEqual([5, 30])
  })

  it('formats output for empty and non-empty issue lists', () => {
    const handler = new ErrorHandler()
    expect(handler.format()).toBe('No errors or warnings')

    handler.addError(
      createIssue(ParseErrorType.InvalidCharacter, 1, 'bad char'),
    )
    const formatted = handler.format()

    expect(formatted).toContain('[InvalidCharacter] bad char')
    expect(formatted).toContain('1:1')
  })

  it('clears all issues', () => {
    const handler = new ErrorHandler()
    handler.addError(
      createIssue(ParseErrorType.InvalidAttribute, 1, 'bad attr'),
    )
    handler.addWarning(
      createIssue(ParseErrorType.UnmatchedQuote, 2, 'bad quote'),
    )

    handler.clear()

    expect(handler.getErrors()).toStrictEqual([])
    expect(handler.getWarnings()).toStrictEqual([])
    expect(handler.hasErrors()).toBeFalsy()
    expect(handler.hasWarnings()).toBeFalsy()
  })
})

describe('parser traverse', () => {
  it('returns early for falsy node', () => {
    const visited: string[] = []
    traverse(undefined as any, node => {
      visited.push(node.type)
    })
    expect(visited).toStrictEqual([])
  })

  it('walks nested nodes and arrays', () => {
    const visited: string[] = []
    const ast = {
      type: NodeTypes.Program,
      body: [],
      comments: [],
      range: [0, 11] as [number, number],
      loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 11 },
      },
      document: {
        type: NodeTypes.Document,
        children: [
          {
            type: NodeTypes.Text,
            value: 'hello',
            range: [0, 5] as [number, number],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 5 },
            },
          },
        ],
        range: [0, 11] as [number, number],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 11 },
        },
      },
      tokens: [],
    }

    traverse(ast as any, node => {
      visited.push(node.type)
    })

    expect(visited).toContain(NodeTypes.Program)
    expect(visited).toContain(NodeTypes.Document)
    expect(visited).toContain(NodeTypes.Text)
  })
})
