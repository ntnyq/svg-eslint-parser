import { isNumber } from '@ntnyq/utils'

/**
 * parse error options
 */
interface ParseErrorOptions extends ErrorOptions {
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
    super(message, options as ErrorOptions)

    this.name = 'ParseError'
    this.index = isNumber(options) ? options : options.offset
    this.lineNumber = isNumber(options) ? (line ?? 0) : options.line
    this.column = isNumber(options) ? (column ?? 0) : options.column
  }
}
