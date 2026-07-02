import { first, last } from '../utils'
import type { Chars } from './chars'

/**
 * Mutable buffer used by tokenizer handlers while deciding token boundaries.
 */
export class CharsBuffer {
  public charsBuffer: Chars[] = []

  /**
   * Append a character wrapper to the buffer.
   */
  public concat(chars: Chars) {
    const theLast = this.last()

    if (theLast) {
      theLast.append(chars)
    } else {
      this.charsBuffer.push(chars)
    }
  }

  /**
   * Append another buffer without merging its entries.
   */
  public concatBuffer(buffer: CharsBuffer) {
    this.charsBuffer.push(...buffer.charsBuffer)
  }

  /**
   * Get the total buffered character length.
   */
  public length(): number {
    return this.charsBuffer
      .map(chars => chars.length())
      .reduce((a, b) => a + b, 0)
  }

  /**
   * Clear all buffered characters.
   */
  public clear() {
    this.charsBuffer = []
  }

  /**
   * Get the concatenated buffered string.
   */
  public value() {
    return this.charsBuffer.map(chars => chars.value).join('')
  }

  /**
   * Get the last buffered character wrapper.
   */
  public last(): Chars {
    return last(this.charsBuffer)
  }

  /**
   * Get the first buffered character wrapper.
   */
  public first(): Chars {
    return first(this.charsBuffer)
  }

  /**
   * Remove the last buffered entry.
   */
  public removeLast() {
    this.charsBuffer.splice(-1, 1)
  }

  /**
   * Remove the first buffered entry.
   */
  public removeFirst() {
    this.charsBuffer.splice(0, 1)
  }

  /**
   * Replace this buffer with a copy of another buffer.
   */
  public replace(other: CharsBuffer) {
    this.charsBuffer = [...other.charsBuffer]
  }
}
