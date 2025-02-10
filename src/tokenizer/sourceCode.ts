import { getLineInfo } from '../utils'
import { Chars } from './chars'
import type { Range, SourceLocation } from '../types'

export class SourceCode {
  private charsList: Chars[]
  private charsIndex = 0

  public constructor(public readonly source: string) {
    this.charsList = this.createCharsList()
  }

  public getLocationOf(range: Range): SourceLocation {
    return {
      start: getLineInfo(this.source, range[0]),
      end: getLineInfo(this.source, range[1]),
    }
  }

  public current() {
    return this.charsList[this.charsIndex]
  }

  public next() {
    this.charsIndex++
  }

  public prev() {
    this.charsIndex--
  }

  public isEof() {
    return this.charsIndex >= this.charsList.length
  }

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
