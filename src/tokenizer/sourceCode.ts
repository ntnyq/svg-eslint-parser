import { getLineInfo } from '../utils'
import { Chars } from './chars'
import type { Range, SourceLocation } from '../types'

/**
 * Cursor-based view over source text for tokenizer handlers.
 */
export class SourceCode {
  private charsList: Chars[]
  private charsIndex = 0

  public constructor(public readonly source: string) {
    this.charsList = this.createCharsList()
  }

  /**
   * Convert a character range to source locations.
   */
  public getLocationOf(range: Range): SourceLocation {
    return {
      start: getLineInfo(this.source, range[0]),
      end: getLineInfo(this.source, range[1]),
    }
  }

  /**
   * Get the current character wrapper.
   */
  public current() {
    return this.charsList[this.charsIndex]
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
    return this.charsIndex >= this.charsList.length
  }

  /**
   * Get the current zero-based character index.
   */
  public index() {
    const current = this.current()
    return current.range[1] - 1
  }

  private createCharsList() {
    const charsList: Chars[] = []

    let sourceIndex = 0

    while (sourceIndex < this.source.length) {
      charsList.push(
        new Chars(this.source[sourceIndex], [sourceIndex, sourceIndex + 1]),
      )
      sourceIndex++
    }

    return charsList
  }
}
