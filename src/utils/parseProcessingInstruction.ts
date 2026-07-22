import { PROCESSING_INSTRUCTION_END } from '../constants'

/**
 * Extract the target and data from a processing instruction token.
 */
export function parseProcessingInstruction(source: string): {
  target: string
  value: string
} {
  const endOffset = source.endsWith(PROCESSING_INSTRUCTION_END)
    ? -PROCESSING_INSTRUCTION_END.length
    : undefined
  const body = source.slice(2, endOffset).trim()
  const whitespaceIndex = body.search(/\s/u)

  if (whitespaceIndex < 0) {
    return {
      target: body,
      value: '',
    }
  }

  return {
    target: body.slice(0, whitespaceIndex),
    value: body.slice(whitespaceIndex).trim(),
  }
}
