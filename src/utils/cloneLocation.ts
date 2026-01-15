import type { SourceLocation } from '../types'

/**
 * Create a shallow copy of a source location object
 * @param loc - Source location to clone
 * @returns Cloned location with new start and end objects
 */
export function cloneLocation(loc: SourceLocation): SourceLocation {
  return {
    start: {
      line: loc.start.line,
      column: loc.start.column,
    },
    end: {
      line: loc.end.line,
      column: loc.end.column,
    },
  }
}
