import { describe, expect, it } from 'vitest'
import { TokenTypes, TokenizerContextTypes } from '../src/constants'
import { Chars } from '../src/tokenizer/chars'
import { CharsBuffer } from '../src/tokenizer/charsBuffer'
import { parse as parseAttributeValueBare } from '../src/tokenizer/handlers/attributeValueBare'
import { parse as parseDoctypeOpen } from '../src/tokenizer/handlers/doctypeOpen'
import { parse as parseXMLDeclarationAttributeKey } from '../src/tokenizer/handlers/xmlDeclarationAttributeKey'
import { parse as parseXMLDeclarationAttributes } from '../src/tokenizer/handlers/xmlDeclarationAttributes'
import { parse as parseXMLDeclarationAttributeValue } from '../src/tokenizer/handlers/xmlDeclarationAttributeValue'
import { parse as parseXMLDeclarationAttributeValueWrapped } from '../src/tokenizer/handlers/xmlDeclarationAttributeValueWrapped'
import { parse as parseXMLDeclarationClose } from '../src/tokenizer/handlers/xmlDeclarationClose'
import { parse as parseXMLDeclarationOpen } from '../src/tokenizer/handlers/xmlDeclarationOpen'
import { SourceCode } from '../src/tokenizer/sourceCode'

function createBuffer(value = ''): CharsBuffer {
  const buffer = new CharsBuffer()
  if (value.length > 0) {
    buffer.charsBuffer.push(new Chars(value, [0, value.length]))
  }
  return buffer
}

function createState(overrides: Record<string, unknown> = {}) {
  const sourceCode = new SourceCode('abcdef')
  sourceCode.next()
  sourceCode.next()
  sourceCode.next()

  const emittedTokens: any[] = []
  const state: any = {
    accumulatedContent: createBuffer('ab'),
    decisionBuffer: createBuffer('c'),
    sourceCode,
    currentContext: TokenizerContextTypes.XMLDeclarationAttributes,
    contextParams: {},
    tokens: {
      push(token: any) {
        emittedTokens.push(token)
      },
    },
    ...overrides,
  }

  return { state, emittedTokens }
}

describe('tokenizer xml declaration handlers', () => {
  it('xmlDeclarationAttributes emits XMLDeclarationClose on declaration end', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationAttributes,
      decisionBuffer: createBuffer('?>'),
    })

    parseXMLDeclarationAttributes({ value: () => '?>' } as any, state)

    expect(emittedTokens[0]?.type).toBe(TokenTypes.XMLDeclarationClose)
    expect(state.currentContext).toBe(TokenizerContextTypes.Data)
  })

  it('xmlDeclarationAttributes appends content when not closed', () => {
    const { state, emittedTokens } = createState({
      decisionBuffer: createBuffer('v'),
      accumulatedContent: createBuffer('xml '),
    })

    parseXMLDeclarationAttributes({ value: () => 'v' } as any, state)

    expect(emittedTokens).toHaveLength(0)
    expect(state.accumulatedContent.value()).toContain('xml v')
  })

  it('xmlDeclarationAttributeKey emits key and switches context at key break', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationAttributeKey,
      accumulatedContent: createBuffer('version'),
      decisionBuffer: createBuffer(' '),
    })

    parseXMLDeclarationAttributeKey({ value: () => ' ' } as any, state)

    expect(emittedTokens[0]?.type).toBe(TokenTypes.XMLDeclarationAttributeKey)
    expect(emittedTokens[0]?.value).toBe('version')
    expect(state.currentContext).toBe(
      TokenizerContextTypes.XMLDeclarationAttributes,
    )
  })

  it('xmlDeclarationAttributeKey keeps consuming when key is incomplete', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationAttributeKey,
      accumulatedContent: createBuffer('ver'),
      decisionBuffer: createBuffer('s'),
    })

    parseXMLDeclarationAttributeKey({ value: () => 's' } as any, state)

    expect(emittedTokens).toHaveLength(0)
    expect(state.accumulatedContent.value()).toBe('vers')
  })

  it('xmlDeclarationAttributeValue handles wrapper and bare value transitions', () => {
    const wrapped = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationAttributeValue,
      decisionBuffer: createBuffer('"'),
      accumulatedContent: createBuffer(''),
      contextParams: {},
    })

    parseXMLDeclarationAttributeValue(
      { value: () => '"' } as any,
      wrapped.state,
    )
    expect(wrapped.state.currentContext).toBe(
      TokenizerContextTypes.AttributeValueWrapped,
    )
    expect(wrapped.emittedTokens[0]?.type).toBe(
      TokenTypes.AttributeValueWrapperStart,
    )

    const bare = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationAttributeValue,
      decisionBuffer: createBuffer('u'),
      accumulatedContent: createBuffer(''),
      contextParams: {},
    })

    parseXMLDeclarationAttributeValue({ value: () => 'u' } as any, bare.state)
    expect(bare.state.currentContext).toBe(
      TokenizerContextTypes.AttributeValueBare,
    )
  })

  it('xmlDeclarationAttributeValue switches back to attributes on tag end', () => {
    const { state } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationAttributeValue,
      decisionBuffer: createBuffer('>'),
      accumulatedContent: createBuffer(''),
      contextParams: {},
    })

    parseXMLDeclarationAttributeValue({ value: () => '>' } as any, state)

    expect(state.currentContext).toBe(TokenizerContextTypes.Attributes)
  })

  it('xmlDeclarationAttributeValueWrapped emits value and wrapper end', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationAttributeValueWrapped,
      accumulatedContent: createBuffer('1.0'),
      decisionBuffer: createBuffer('"'),
      contextParams: {
        [TokenizerContextTypes.AttributeValueWrapped]: {
          wrapper: '"',
        },
      },
    })

    parseXMLDeclarationAttributeValueWrapped({ value: () => '"' } as any, state)

    expect(emittedTokens.map(token => token.type)).toStrictEqual([
      TokenTypes.AttributeValue,
      TokenTypes.AttributeValueWrapperEnd,
    ])
    expect(state.currentContext).toBe(TokenizerContextTypes.Attributes)
    expect(
      state.contextParams[TokenizerContextTypes.AttributeValueWrapped],
    ).toBeUndefined()
  })

  it('xmlDeclarationAttributeValueWrapped keeps consuming when wrapper is not reached', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationAttributeValueWrapped,
      accumulatedContent: createBuffer('1'),
      decisionBuffer: createBuffer('.'),
      contextParams: {
        [TokenizerContextTypes.AttributeValueWrapped]: {
          wrapper: '"',
        },
      },
    })

    parseXMLDeclarationAttributeValueWrapped({ value: () => '0' } as any, state)

    expect(emittedTokens).toHaveLength(0)
    expect(state.accumulatedContent.value()).toBe('1.')
  })

  it('xmlDeclarationOpen emits open tag end on closing corner', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationOpen,
      accumulatedContent: createBuffer('<?xml'),
      decisionBuffer: createBuffer('>'),
      contextParams: {
        [TokenizerContextTypes.OpenTagEnd]: { tagName: 'xml' },
      },
    })

    parseXMLDeclarationOpen({ value: () => '>' } as any, state)

    expect(emittedTokens[0]?.type).toBe(TokenTypes.OpenTagEnd)
    expect(state.currentContext).toBe(TokenizerContextTypes.Data)
    expect(
      state.contextParams[TokenizerContextTypes.OpenTagEnd],
    ).toBeUndefined()
  })

  it('xmlDeclarationClose appends content when not at closing corner', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationClose,
      accumulatedContent: createBuffer('?'),
      decisionBuffer: createBuffer('x'),
    })

    parseXMLDeclarationClose({ value: () => 'x' } as any, state)

    expect(emittedTokens).toHaveLength(0)
    expect(state.accumulatedContent.value()).toBe('?x')
  })

  it('xmlDeclarationClose emits open tag end on closing corner', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.XMLDeclarationClose,
      accumulatedContent: createBuffer('?xml'),
      decisionBuffer: createBuffer('>'),
      contextParams: {
        [TokenizerContextTypes.OpenTagEnd]: { tagName: 'xml' },
      },
    })

    parseXMLDeclarationClose({ value: () => '>' } as any, state)

    expect(emittedTokens[0]?.type).toBe(TokenTypes.OpenTagEnd)
    expect(state.currentContext).toBe(TokenizerContextTypes.Data)
  })

  it('attributeValueBare emits attribute value when value ends', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.AttributeValueBare,
      accumulatedContent: createBuffer('value'),
      decisionBuffer: createBuffer(' '),
    })

    parseAttributeValueBare({ value: () => ' ' } as any, state)

    expect(emittedTokens[0]?.type).toBe(TokenTypes.AttributeValue)
    expect(emittedTokens[0]?.value).toBe('value')
    expect(state.currentContext).toBe(TokenizerContextTypes.Attributes)
  })

  it('attributeValueBare keeps consuming bare values', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.AttributeValueBare,
      accumulatedContent: createBuffer('va'),
      decisionBuffer: createBuffer('l'),
    })

    parseAttributeValueBare({ value: () => 'l' } as any, state)

    expect(emittedTokens).toHaveLength(0)
    expect(state.accumulatedContent.value()).toBe('val')
  })

  it('doctypeOpen switches to doctype attributes on whitespace', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.DoctypeOpen,
      accumulatedContent: createBuffer('<!DOCTYPE'),
      decisionBuffer: createBuffer(' '),
    })

    parseDoctypeOpen({ value: () => ' ' } as any, state)

    expect(emittedTokens[0]?.type).toBe(TokenTypes.DoctypeOpen)
    expect(state.currentContext).toBe(TokenizerContextTypes.DoctypeAttributes)
  })

  it('doctypeOpen switches to doctype close on right angle bracket', () => {
    const { state, emittedTokens } = createState({
      currentContext: TokenizerContextTypes.DoctypeOpen,
      accumulatedContent: createBuffer('<!DOCTYPE'),
      decisionBuffer: createBuffer('>'),
    })

    parseDoctypeOpen({ value: () => '>' } as any, state)

    expect(emittedTokens[0]?.type).toBe(TokenTypes.DoctypeOpen)
    expect(state.currentContext).toBe(TokenizerContextTypes.DoctypeClose)
  })
})
