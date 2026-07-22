import {
  CDATA_START,
  COMMENT_START,
  TokenizerContextTypes,
  TokenTypes,
  XML_DECLARATION_START,
} from '../constants'
import { ParseErrorType } from '../types'
import type { AnyToken, Range, TokenizerState } from '../types'

function getPendingValue(state: TokenizerState): string {
  return state.accumulatedContent.value() + state.decisionBuffer.value()
}

function getTrailingRange(state: TokenizerState, value: string): Range {
  return [
    state.sourceCode.source.length - value.length,
    state.sourceCode.source.length,
  ]
}

function getConstructRange(state: TokenizerState, marker?: string): Range {
  const { source } = state.sourceCode
  const start = marker ? source.lastIndexOf(marker) : source.lastIndexOf('<')

  return [Math.max(0, start), source.length]
}

function pushTrailingToken(
  state: TokenizerState,
  type: TokenTypes,
  value: string,
): void {
  if (value.length === 0) {
    return
  }

  const range = getTrailingRange(state, value)

  state.tokens.push({
    type,
    value,
    range,
    loc: state.sourceCode.getLocationOf(range),
  } as AnyToken)
}

function reportError(
  state: TokenizerState,
  type: ParseErrorType,
  message: string,
  range: Range,
  recovery: string,
): void {
  state.errors.push({
    type,
    message,
    range,
    loc: state.sourceCode.getLocationOf(range),
    recovery,
  })
}

function reportUnexpectedConstructEnd(
  state: TokenizerState,
  message: string,
  marker?: string,
): void {
  reportError(
    state,
    ParseErrorType.UnexpectedToken,
    message,
    getConstructRange(state, marker),
    'The parser kept the incomplete construct in the AST when possible.',
  )
}

function finalizeAttributeValue(
  state: TokenizerState,
  type:
    | TokenTypes.AttributeValue
    | TokenTypes.DoctypeAttributeValue
    | TokenTypes.XMLDeclarationAttributeValue,
): void {
  const value = getPendingValue(state)
  pushTrailingToken(state, type, value)

  const range: Range = [
    Math.max(0, state.sourceCode.source.length - value.length - 1),
    state.sourceCode.source.length,
  ]

  reportError(
    state,
    ParseErrorType.UnmatchedQuote,
    'Unterminated quoted value.',
    range,
    'The parser kept the value content without a closing quote.',
  )
}

/**
 * Flush a tokenizer context that reached the end of source unexpectedly.
 */
export function finalizeTokenizer(state: TokenizerState): void {
  const value = getPendingValue(state)

  switch (state.currentContext) {
    case TokenizerContextTypes.Data:
      return

    case TokenizerContextTypes.OpenTagStart:
      pushTrailingToken(state, TokenTypes.OpenTagStart, value)
      reportUnexpectedConstructEnd(state, 'Unterminated opening tag.')
      return

    case TokenizerContextTypes.OpenTagEnd:
      pushTrailingToken(state, TokenTypes.OpenTagEnd, value)
      reportUnexpectedConstructEnd(state, 'Unterminated opening tag.')
      return

    case TokenizerContextTypes.CloseTag:
      pushTrailingToken(state, TokenTypes.Text, value)
      reportUnexpectedConstructEnd(state, 'Unterminated closing tag.')
      return

    case TokenizerContextTypes.ProcessingInstruction:
      pushTrailingToken(state, TokenTypes.ProcessingInstruction, value)
      reportError(
        state,
        ParseErrorType.InvalidProcessingInstruction,
        'Unterminated processing instruction.',
        getConstructRange(state, '<?'),
        'The parser kept the partial processing instruction in the AST.',
      )
      return

    case TokenizerContextTypes.Attributes:
      reportUnexpectedConstructEnd(state, 'Unterminated opening tag.')
      return

    case TokenizerContextTypes.AttributeKey:
      pushTrailingToken(state, TokenTypes.AttributeKey, value)
      reportUnexpectedConstructEnd(state, 'Unterminated opening tag.')
      return

    case TokenizerContextTypes.AttributeValue:
      reportError(
        state,
        ParseErrorType.InvalidAttribute,
        'Missing attribute value.',
        [state.sourceCode.source.length, state.sourceCode.source.length],
        'The parser kept the attribute without a value.',
      )
      return

    case TokenizerContextTypes.AttributeValueBare:
      pushTrailingToken(state, TokenTypes.AttributeValue, value)
      reportUnexpectedConstructEnd(state, 'Unterminated opening tag.')
      return

    case TokenizerContextTypes.AttributeValueWrapped:
      finalizeAttributeValue(state, TokenTypes.AttributeValue)
      return

    case TokenizerContextTypes.CommentContent:
      pushTrailingToken(state, TokenTypes.CommentContent, value)
      reportError(
        state,
        ParseErrorType.MalformedComment,
        'Unterminated comment.',
        getConstructRange(state, COMMENT_START),
        'The parser kept the comment content without a closing delimiter.',
      )
      return

    case TokenizerContextTypes.CDATAContent:
      pushTrailingToken(state, TokenTypes.CDATAContent, value)
      reportError(
        state,
        ParseErrorType.MalformedCDATA,
        'Unterminated CDATA section.',
        getConstructRange(state, CDATA_START),
        'The parser kept the CDATA content without a closing delimiter.',
      )
      return

    case TokenizerContextTypes.XMLDeclarationAttributeKey:
      pushTrailingToken(state, TokenTypes.XMLDeclarationAttributeKey, value)
      reportError(
        state,
        ParseErrorType.InvalidXMLDeclaration,
        'Unterminated XML declaration.',
        getConstructRange(state, XML_DECLARATION_START),
        'The parser kept the partial declaration in the AST.',
      )
      return

    case TokenizerContextTypes.XMLDeclarationAttributeValueWrapped:
      finalizeAttributeValue(state, TokenTypes.XMLDeclarationAttributeValue)
      return

    case TokenizerContextTypes.XMLDeclarationAttributes:
    case TokenizerContextTypes.XMLDeclarationAttributeValue:
    case TokenizerContextTypes.XMLDeclarationClose:
    case TokenizerContextTypes.XMLDeclarationOpen:
      reportError(
        state,
        ParseErrorType.InvalidXMLDeclaration,
        'Unterminated XML declaration.',
        getConstructRange(state, XML_DECLARATION_START),
        'The parser kept the partial declaration in the AST.',
      )
      return

    case TokenizerContextTypes.DoctypeAttributeBare:
      pushTrailingToken(state, TokenTypes.DoctypeAttributeValue, value)
      reportUnexpectedConstructEnd(state, 'Unterminated doctype declaration.')
      return

    case TokenizerContextTypes.DoctypeAttributeWrapped:
      finalizeAttributeValue(state, TokenTypes.DoctypeAttributeValue)
      return

    case TokenizerContextTypes.DoctypeOpen:
      pushTrailingToken(state, TokenTypes.DoctypeOpen, value)
      reportUnexpectedConstructEnd(state, 'Unterminated doctype declaration.')
      return

    case TokenizerContextTypes.DoctypeAttributes:
    case TokenizerContextTypes.DoctypeClose:
      reportUnexpectedConstructEnd(state, 'Unterminated doctype declaration.')
      return

    case TokenizerContextTypes.CommentClose:
    case TokenizerContextTypes.CommentOpen:
      reportUnexpectedConstructEnd(
        state,
        'Unterminated comment.',
        COMMENT_START,
      )
  }
}
