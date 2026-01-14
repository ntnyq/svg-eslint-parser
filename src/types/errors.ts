/**
 * Error handling types and interfaces
 */

import type { Range, SourceLocation } from './ast'

export enum ParseErrorType {
  InvalidAttribute = 'InvalidAttribute',
  InvalidCharacter = 'InvalidCharacter',
  InvalidDoctypeAttribute = 'InvalidDoctypeAttribute',
  InvalidXMLDeclaration = 'InvalidXMLDeclaration',
  MalformedComment = 'MalformedComment',
  MismatchedTag = 'MismatchedTag',
  UnclosedTag = 'UnclosedTag',
  UnexpectedToken = 'UnexpectedToken',
  UnmatchedQuote = 'UnmatchedQuote',
}

export interface ParseError {
  loc: SourceLocation
  message: string
  range: Range
  type: ParseErrorType
  recovery?: string
}

export interface ErrorContext {
  errors: ParseError[]
  warnings: ParseError[]

  addError(error: Omit<ParseError, 'type'> & { type: ParseErrorType }): void
  addWarning(warning: Omit<ParseError, 'type'> & { type: ParseErrorType }): void
  clear(): void
  getErrors(): ParseError[]
  getWarnings(): ParseError[]
  hasErrors(): boolean
  hasWarnings(): boolean
}
