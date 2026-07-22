import { LineIndex } from '../utils/getLineInfo'
import { Chars } from './chars'
import type { Range, SourceLocation } from '../types'

/**
 * Cursor-based view over source text for tokenizer handlers.
 */
export class SourceCode {
  private charsIndex = 0
  private readonly lineIndex: LineIndex

  public constructor(public readonly source: string) {
    this.lineIndex = new LineIndex(source)
  }

  /**
   * Convert a character range to source locations.
   */
  public getLocationOf(range: Range): SourceLocation {
    return {
      start: this.lineIndex.getPosition(range[0]),
      end: this.lineIndex.getPosition(range[1]),
    }
  }

  /**
   * Get the current character wrapper.
   */
  public current(): Chars {
    return new Chars(this.source[this.charsIndex], [
      this.charsIndex,
      this.charsIndex + 1,
    ])
  }

  /**
   * Advance to the next character.
   */
  public next() {
    this.charsIndex++
  }

  /**
   * Move back to the previous character.
   */
  public prev() {
    this.charsIndex--
  }

  /**
   * Check whether the cursor has reached the end of source.
   */
  public isEof() {
    return this.charsIndex >= this.source.length
  }

  /**
   * Get the current zero-based character index.
   */
  public index() {
    return this.charsIndex
  }
}
