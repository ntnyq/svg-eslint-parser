import type { ParseErrorType } from '../types'

/**
 * parse error options
 */
interface ParseErrorOptions extends ErrorOptions {
  /**
   * Machine-readable parser error category.
   */
  code?: ParseErrorType
  /**
   * The index of the error in the source code
   */
  column: number
  /**
   * The line number of the error in the source code
   */
  line: number
  /**
   * The offset of the error in the source code
   */
  offset: number
}

/**
 * parse error
 */
export class ParseError extends SyntaxError {
  public code?: ParseErrorType
  public index: number
  public lineNumber: number
  public column: number

  public constructor(message: string, options: ParseErrorOptions)
  public constructor(
    message: string,
    offset: number,
    line: number,
    column: number,
  )
  public constructor(
    message: string,
    options: ParseErrorOptions | number,
    line?: number,
    column?: number,
  ) {
    if (typeof options === 'number') {
      options = {
        offset: options,
        line: line ?? 0,
        column: column ?? 0,
      }
    }

    super(message, options)

    this.name = 'ParseError'
    this.code = options.code
    this.index = options.offset
    this.lineNumber = options.line
    this.column = options.column
  }
}
