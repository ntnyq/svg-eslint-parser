import {
  COMMENT_START,
  RE_OPEN_TAG_START,
  TokenizerContextTypes,
  TokenTypes,
} from '../../constants'
import { calculateTokenPosition } from '../../utils'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (RE_OPEN_TAG_START.test(value)) {
    return parseOpeningCornerBraceWithText(state)
  }

  if (value === '</') {
    return parseOpeningCornerBraceWithSlash(state)
  }

  if (value === '<' || value === '<!' || value === '<!-') {
    return state.sourceCode.next()
  }

  if (value === COMMENT_START) {
    return parseCommentOpen(state)
  }

  if (isIncompleteDoctype(value)) {
    return state.sourceCode.next()
  }

  if (value.toUpperCase() === '<!DOCTYPE') {
    return parseDoctypeOpen(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

export function handleContentEnd(state: TokenizerState) {
  const textContent = state.accumulatedContent.value() + state.decisionBuffer.value()

  if (textContent.length !== 0) {
    const position = calculateTokenPosition(state, { keepBuffer: false })

    state.tokens.push({
      type: TokenTypes.Text,
      value: textContent,
      range: position.range,
      loc: position.loc,
    })
  }
}

function generateTextToken(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })
  return {
    type: TokenTypes.Text,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  }
}

function isIncompleteDoctype(chars: string) {
  const charsUpperCase = chars.toUpperCase()

  return (
    charsUpperCase === '<!' ||
    charsUpperCase === '<!D' ||
    charsUpperCase === '<!DO' ||
    charsUpperCase === '<!DOC' ||
    // cSpell: disable-next-line
    charsUpperCase === '<!DOCT' ||
    // cSpell: disable-next-line
    charsUpperCase === '<!DOCTY' ||
    charsUpperCase === '<!DOCTYP'
  )
}

function parseOpeningCornerBraceWithText(state: TokenizerState) {
  if (state.accumulatedContent.length() !== 0) {
    state.tokens.push(generateTextToken(state))
  }
  state.accumulatedContent.replace(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.OpenTagStart
  state.sourceCode.next()
}

function parseOpeningCornerBraceWithSlash(state: TokenizerState) {
  if (state.accumulatedContent.length() !== 0) {
    state.tokens.push(generateTextToken(state))
  }
  state.accumulatedContent.replace(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.CloseTag
  state.sourceCode.next()
}

function parseCommentOpen(state: TokenizerState) {
  if (state.accumulatedContent.length() !== 0) {
    state.tokens.push(generateTextToken(state))
  }

  const range: Range = [
    state.sourceCode.index() - (COMMENT_START.length - 1),
    state.sourceCode.index() + 1,
  ]

  state.tokens.push({
    type: TokenTypes.CommentOpen,
    value: state.decisionBuffer.value(),
    range,
    loc: state.sourceCode.getLocationOf(range),
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.CommentContent
  state.sourceCode.next()
}

function parseDoctypeOpen(state: TokenizerState) {
  if (state.accumulatedContent.length() !== 0) {
    state.tokens.push(generateTextToken(state))
  }

  state.accumulatedContent.replace(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeOpen
  state.sourceCode.next()
}
