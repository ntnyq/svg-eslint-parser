import { getLineInfo } from './getLineInfo'
import type { Range } from '../types'

export function calculateTokenLocation(source: string, range: Range) {
  return {
    start: getLineInfo(source, range[0]),
    end: getLineInfo(source, range[1]),
  }
}
