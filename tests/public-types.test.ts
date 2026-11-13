import { describe, expect, expectTypeOf, it } from 'vitest'
import { ParseError, parseForESLint } from '../src'
import type {
  AST,
  ParseDiagnostic,
  ParseResult,
  SVGParserServices,
} from '../src'

describe('public diagnostic types', () => {
  it('exports diagnostics separately from the thrown exception class', () => {
    const result = parseForESLint('<svg', { errorRecovery: true })
    const diagnostic: ParseDiagnostic = result.services.errors[0]

    expectTypeOf<
      SVGParserServices['errors'][number]
    >().toEqualTypeOf<ParseDiagnostic>()
    expectTypeOf<
      SVGParserServices['warnings'][number]
    >().toEqualTypeOf<ParseDiagnostic>()
    expectTypeOf<
      ParseResult['errors'][number]
    >().toEqualTypeOf<ParseDiagnostic>()
    expectTypeOf<
      ParseResult['warnings'][number]
    >().toEqualTypeOf<ParseDiagnostic>()
    expectTypeOf<AST.ParseDiagnostic>().toEqualTypeOf<ParseDiagnostic>()
    expectTypeOf<AST.ParseError>().toEqualTypeOf<ParseDiagnostic>()
    expectTypeOf(diagnostic).not.toEqualTypeOf<ParseError>()
    expect(diagnostic).not.toBeInstanceOf(ParseError)

    let thrown: unknown
    try {
      parseForESLint('<svg')
    } catch (error) {
      thrown = error
    }
    expect.assert(thrown instanceof ParseError)
    expectTypeOf(thrown).toEqualTypeOf<ParseError>()
    expect(thrown.cause).toEqual(diagnostic)
  })
})
