import type { Range } from '../types'

/**
 * Buffered source characters with their source range.
 */
export class Chars {
  constructor(
    public value: string,
    public range: Range,
  ) {}

  /**
   * Append adjacent characters into this range.
   */
  public append(chars: Chars): void {
    this.value += chars.value
    this.range[1] = chars.range[1]
  }

  /**
   * Compare the buffered value with raw text.
   */
  public equals(chars: string): boolean {
    return this.value === chars
  }

  /**
   * Get the buffered string length.
   */
  public length() {
    return this.value.length
  }
}
