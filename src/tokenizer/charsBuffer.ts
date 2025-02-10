import { first, last } from '../utils'
import type { Chars } from './chars'

export class CharsBuffer {
  public charsBuffer: Chars[] = []

  public concat(chars: Chars) {
    const last = this.last()

    if (!last) {
      this.charsBuffer.push(chars)
    } else {
      last.concat(chars)
    }
  }

  public concatBuffer(buffer: CharsBuffer) {
    this.charsBuffer.push(...buffer.charsBuffer)
  }

  public length(): number {
    return this.charsBuffer
      .map(chars => chars.length())
      .reduce((a, b) => a + b, 0)
  }

  public clear() {
    this.charsBuffer = []
  }

  public value() {
    return this.charsBuffer.map(chars => chars.value).join('')
  }

  public last(): Chars {
    return last(this.charsBuffer)
  }

  public first(): Chars {
    return first(this.charsBuffer)
  }

  public removeLast() {
    this.charsBuffer.splice(-1, 1)
  }

  public removeFirst() {
    this.charsBuffer.splice(0, 1)
  }

  public replace(other: CharsBuffer) {
    this.charsBuffer = [...other.charsBuffer]
  }
}
