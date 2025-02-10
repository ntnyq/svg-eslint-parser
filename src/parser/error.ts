/**
 * parse error
 */
export class ParseError extends SyntaxError {
  public index: number
  public lineNumber: number
  public column: number

  public constructor(
    message: string,
    offset: number,
    line: number,
    column: number,
  ) {
    super(message)

    this.name = 'ParseError'
    this.index = offset
    this.lineNumber = line
    this.column = column
  }
}
