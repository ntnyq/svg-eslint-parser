/**
 * Error handling types and interfaces
 */

import type { Range, SourceLocation } from '../source/types'

/**
 * Categories of recoverable parse diagnostics.
 */
export enum ParseErrorType {
  DuplicateAttribute = 'DuplicateAttribute',
  InvalidAttribute = 'InvalidAttribute',
  InvalidCharacter = 'InvalidCharacter',
  InvalidDoctype = 'InvalidDoctype',
  InvalidDoctypeAttribute = 'InvalidDoctypeAttribute',
  InvalidDocument = 'InvalidDocument',
  InvalidProcessingInstruction = 'InvalidProcessingInstruction',
  InvalidXMLDeclaration = 'InvalidXMLDeclaration',
  MalformedCDATA = 'MalformedCDATA',
  MalformedComment = 'MalformedComment',
  MismatchedTag = 'MismatchedTag',
  UnclosedTag = 'UnclosedTag',
  UnexpectedToken = 'UnexpectedToken',
  UnmatchedQuote = 'UnmatchedQuote',
}

/**
 * Recoverable parser diagnostic with source location information.
 */
export interface ParseDiagnostic {
  loc: SourceLocation
  message: string
  range: Range
  type: ParseErrorType
  recovery?: string
}

/**
 * @deprecated Use ParseDiagnostic for diagnostic objects. The package-level
 * ParseError export is the thrown SyntaxError subclass.
 */
export type ParseError = ParseDiagnostic

/**
 * Collector interface used while building parser diagnostics.
 */
export interface ErrorContext {
  errors: ParseDiagnostic[]
  warnings: ParseDiagnostic[]

  clear(): void
  getErrors(): ParseDiagnostic[]
  getWarnings(): ParseDiagnostic[]
  hasErrors(): boolean
  hasWarnings(): boolean
  addError(
    error: Omit<ParseDiagnostic, 'type'> & { type: ParseErrorType },
  ): void
  addWarning(
    warning: Omit<ParseDiagnostic, 'type'> & { type: ParseErrorType },
  ): void
}
