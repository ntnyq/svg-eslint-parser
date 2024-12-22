export interface Locations {
  loc: SourceLocation
  range: Range
}

export interface Position {
  /**
   * 0 based index (>= 0)
   */
  column: number
  /**
   * 1 based index (>= 1)
   */
  line: number
}

export type Range = [number, number]

export interface SourceLocation {
  /**
   * end position of source
   */
  end: Position
  /**
   * start position of source
   */
  start: Position
}
