import { describe, expect, it } from 'vitest'
import { parse, ParseError, ParseErrorType, parseForESLint } from '../../src'
import { parseSource } from '../../src/parser/parseSource'

describe('diagnostic ordering', () => {
  it('merges tokenizer, constructor, and validation errors in source order', () => {
    const source = '<svg a="1" a="2"><g><!-- unfinished'
    const result = parseSource(source)
    const expected = [
      [ParseErrorType.UnclosedTag, 0],
      [ParseErrorType.DuplicateAttribute, source.lastIndexOf('a=')],
      [ParseErrorType.UnclosedTag, source.indexOf('<g>')],
      [ParseErrorType.MalformedComment, source.indexOf('<!--')],
    ]

    expect(result.errors.map(error => [error.type, error.range[0]])).toEqual(
      expected,
    )
    expect(
      parseForESLint(source, { errorRecovery: true }).services.errors,
    ).toEqual(result.errors)
  })

  it('keeps phase reporting order when diagnostics start at the same offset', () => {
    const result = parseSource('<1svg')
    expect(result.errors.map(error => [error.type, error.range[0]])).toEqual([
      [ParseErrorType.UnexpectedToken, 0],
      [ParseErrorType.UnclosedTag, 0],
      [ParseErrorType.InvalidCharacter, 0],
    ])
  })

  it('orders validation errors across sibling elements and preserves EOF diagnostics', () => {
    const source = '<svg><a x/><b y/>'
    const result = parseSource(source)
    expect(result.errors.map(error => error.range[0])).toEqual([
      0,
      source.indexOf('x'),
      source.indexOf('y'),
    ])
    const incomplete = '<svg a='
    const errors = parseSource(incomplete).errors
    expect(errors.map(error => error.range[0])).toEqual([
      0,
      incomplete.indexOf('a'),
      incomplete.length,
    ])
    expect(errors.at(-1)?.range).toEqual([incomplete.length, incomplete.length])
  })

  it.each([
    ['parse', parse],
    ['parseForESLint', parseForESLint],
  ] as const)(
    '%s throws the first ordered diagnostic with its original metadata',
    (_name, parseEntry) => {
      const source = '<svg>\n  <g a="1" a="2"><!-- unfinished'
      const [first] = parseSource(source).errors
      let thrown: unknown
      try {
        parseEntry(source)
      } catch (error) {
        thrown = error
      }
      expect.assert(thrown instanceof ParseError)
      expect(thrown).toMatchObject({
        message: first.message,
        code: first.type,
        index: first.range[0],
        lineNumber: first.loc.start.line,
        column: first.loc.start.column + 1,
        cause: first,
      })
    },
  )

  it.each([
    ['parse', parse],
    ['parseForESLint', parseForESLint],
  ] as const)(
    '%s converts the first diagnostic location to one-based exception coordinates',
    (_name, parseEntry) => {
      const source = '<svg>\n  <g></svg>'
      let thrown: unknown
      try {
        parseEntry(source, { errorRecovery: false })
      } catch (error) {
        thrown = error
      }
      expect.assert(thrown instanceof ParseError)
      expect(thrown).toMatchObject({
        code: ParseErrorType.UnclosedTag,
        index: source.indexOf('<g>'),
        lineNumber: 2,
        column: 3,
        cause: {
          loc: { start: { line: 2, column: 2 } },
        },
      })
    },
  )
})
