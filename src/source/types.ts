/**
 * AST node source range and location metadata.
 */
export interface Locations {
  loc: SourceLocation
  range: Range
}

/**
 * One-based line and zero-based column position.
 */
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

/**
 * Character offset range in `[start, end]` form.
 */
export type Range = [number, number]

/**
 * Start and end positions for a node or token.
 */
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
