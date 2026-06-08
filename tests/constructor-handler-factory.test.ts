import { describe, expect, it } from 'vitest'
import { TokenTypes } from '../src/constants'
import {
  createIncrementingHandler,
  createSkipHandler,
  createTokenDispatcher,
} from '../src/constructor/handlerFactory'

function createState() {
  return {
    caretPosition: 0,
  } as any
}

describe('constructor handler factory', () => {
  it('dispatches handler for exact token type', () => {
    const state = createState()
    const dispatcher = createTokenDispatcher([
      {
        tokenType: TokenTypes.OpenTagStart,
        handler(_token, nextState) {
          nextState.caretPosition += 2
          return nextState
        },
      },
    ])

    const result = dispatcher({ type: TokenTypes.OpenTagStart } as any, state)

    expect(result.caretPosition).toBe(2)
  })

  it('dispatches handler for set token types', () => {
    const state = createState()
    const dispatcher = createTokenDispatcher([
      {
        tokenType: new Set([
          TokenTypes.AttributeKey,
          TokenTypes.AttributeValue,
        ]),
        handler(_token, nextState) {
          nextState.caretPosition += 3
          return nextState
        },
      },
    ])

    const result = dispatcher({ type: TokenTypes.AttributeValue } as any, state)

    expect(result.caretPosition).toBe(3)
  })

  it('falls back to default handler when no token matches', () => {
    const state = createState()
    const dispatcher = createTokenDispatcher(
      [
        {
          tokenType: TokenTypes.AttributeKey,
          handler(_token, nextState) {
            nextState.caretPosition += 10
            return nextState
          },
        },
      ],
      (_token, nextState) => {
        nextState.caretPosition += 1
        return nextState
      },
    )

    const result = dispatcher({ type: TokenTypes.CommentOpen } as any, state)

    expect(result.caretPosition).toBe(1)
  })

  it('returns original state when no handler matches and no default handler exists', () => {
    const state = createState()
    const dispatcher = createTokenDispatcher([
      {
        tokenType: TokenTypes.AttributeKey,
        handler(_token, nextState) {
          nextState.caretPosition += 10
          return nextState
        },
      },
    ])

    const result = dispatcher({ type: TokenTypes.CommentOpen } as any, state)

    expect(result).toBe(state)
    expect(result.caretPosition).toBe(0)
  })

  it('createSkipHandler increments caret position', () => {
    const state = createState()
    const skip = createSkipHandler<any>()

    const result = skip({ type: TokenTypes.Text } as any, state)

    expect(result.caretPosition).toBe(1)
  })

  it('createIncrementingHandler executes callback then increments caret', () => {
    const state = createState()
    let callbackRan = false

    const incrementing = createIncrementingHandler<any>((_token, nextState) => {
      callbackRan = true
      nextState.caretPosition += 4
    })

    const result = incrementing({ type: TokenTypes.Text } as any, state)

    expect(callbackRan).toBeTruthy()
    expect(result.caretPosition).toBe(5)
  })
})
