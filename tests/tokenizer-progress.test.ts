import { describe, expect, it } from 'vitest'
import { CharsBuffer } from '../src/tokenizer/charsBuffer'
import { SourceCode } from '../src/tokenizer/sourceCode'
import { tokenizeChars } from '../src/tokenizer/tokenize'
import { TokenizerContextTypes } from '../src/tokenizer/tokenizerContextTypes'
import type { TokenizeHandler, TokenizerState } from '../src'

function createState(): TokenizerState {
  return {
    currentContext: TokenizerContextTypes.Data,
    contextParams: {},
    accumulatedContent: new CharsBuffer(),
    decisionBuffer: new CharsBuffer(),
    sourceCode: new SourceCode('xx'),
    errors: [],
    tokens: { push() {} },
  }
}

describe('tokenizer progress', () => {
  it('rejects a handler that does not advance or change context', () => {
    expect(() =>
      tokenizeChars(createState(), { Data: { parse() {} } }),
    ).toThrow('made no progress')
  })

  it.each([-1, 2])('rejects a cursor advance of %s', advance => {
    const parse: TokenizeHandler['parse'] = (_chars, state) => {
      if (advance < 0) {
        state.sourceCode.prev()
      } else {
        state.sourceCode.next()
        state.sourceCode.next()
      }
    }
    expect(() => tokenizeChars(createState(), { Data: { parse } })).toThrow(
      'consume exactly one character',
    )
  })

  it('rejects context cycles before a character is consumed', () => {
    expect(() =>
      tokenizeChars(createState(), {
        Data: {
          parse(_chars, state) {
            state.currentContext = TokenizerContextTypes.Attributes
          },
        },
        Attributes: {
          parse(_chars, state) {
            state.currentContext = TokenizerContextTypes.Data
          },
        },
      }),
    ).toThrow('context cycle')
  })

  it('allows context changes and resets cycle tracking after consuming a character', () => {
    const state = createState()
    tokenizeChars(state, {
      Data: {
        parse(_chars, current) {
          current.currentContext = TokenizerContextTypes.Attributes
        },
      },
      Attributes: {
        parse(_chars, current) {
          current.currentContext = TokenizerContextTypes.Data
          current.sourceCode.next()
        },
      },
    })
    expect(state.errors).toEqual([])
    expect(state.sourceCode.isEof()).toBe(false)
    // EOF handling backs the cursor up to the last consumed character.
    expect(state.sourceCode.index()).toBe(1)
  })

  it('reports missing handlers without looping', () => {
    expect(() => tokenizeChars(createState(), {})).toThrow(
      'Missing tokenizer handler',
    )
  })
})
