import { describe, expect, it } from 'vitest'
import { NodeTypes } from '../src/ast/nodeTypes'
import { TokenTypes } from '../src/tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../src/treeBuilder/constructTreeContextTypes'
import {
  createConsumeHandler,
  createTokenDispatcher,
  createUpdateAndConsumeHandler,
} from '../src/treeBuilder/tokenDispatcher'
import { consume, createContext } from '../src/treeBuilder/transitions'
import {
  createLocations,
  createState,
  createToken,
} from './helpers/constructTree'

const contextType = ConstructTreeContextTypes.TagContent

describe('tree builder token dispatcher', () => {
  it.each([
    TokenTypes.OpenTagStart,
    new Set([TokenTypes.OpenTagStart, TokenTypes.AttributeValue]),
  ])('dispatches exact and set token cases', tokenType => {
    const state = createState()
    const dispatcher = createTokenDispatcher(contextType, [
      { tokenType, handler: (_, current) => consume(current) },
    ])
    const result = dispatcher(createToken(TokenTypes.OpenTagStart), state)
    expect(result.caretPosition).toBe(1)
    expect(state.caretPosition).toBe(0)
    expect(dispatcher.contextType).toBe(contextType)
  })

  it('uses an explicit fallback for unmatched tokens', () => {
    const dispatcher = createTokenDispatcher(
      contextType,
      [],
      createConsumeHandler(),
    )
    expect(
      dispatcher(createToken(TokenTypes.CommentOpen), createState())
        .caretPosition,
    ).toBe(1)
  })

  it('rejects unmatched tokens without a fallback', () => {
    const dispatcher = createTokenDispatcher(contextType, [])
    expect(() =>
      dispatcher(createToken(TokenTypes.CommentOpen), createState()),
    ).toThrow('Unhandled token CommentOpen')
  })

  it('rejects dispatching a state belonging to another context', () => {
    const comment = {
      type: NodeTypes.Comment,
      content: '',
      value: '',
      ...createLocations(),
    } as const
    const state = createState(
      createContext(ConstructTreeContextTypes.Comment, comment),
    )
    const dispatcher = createTokenDispatcher(
      contextType,
      [],
      createConsumeHandler(),
    )
    expect(() => dispatcher(createToken(TokenTypes.Text), state)).toThrow(
      'Expected construction context TagContent, received Comment',
    )
  })

  it('updates the context-owned node before consuming one token', () => {
    const state = createState()
    const dispatcher = createTokenDispatcher(
      contextType,
      [],
      createUpdateAndConsumeHandler((_token, current) => {
        current.currentContext.node.children.push({
          type: NodeTypes.Text,
          value: 'added',
          ...createLocations(),
        })
      }),
    )
    const result = dispatcher(createToken(TokenTypes.Text), state)
    expect(result.caretPosition).toBe(1)
    expect(result.currentContext.node).toMatchObject({
      children: [{ value: 'added' }],
    })
    expect(state.caretPosition).toBe(0)
  })
})
