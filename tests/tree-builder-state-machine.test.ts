import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  ConstructTreeContextTypes,
  NodeTypes,
  parseForESLint,
  TokenTypes,
} from '../src'
import { tokenize } from '../src/tokenizer/tokenize'
import { constructTree } from '../src/treeBuilder/constructTree'
import { processTokens } from '../src/treeBuilder/processTokens'
import { createTokenDispatcher } from '../src/treeBuilder/tokenDispatcher'
import {
  consume,
  createContext,
  getParentContext,
  reprocess,
} from '../src/treeBuilder/transitions'
import {
  createDocument,
  createLocations,
  createState,
  createToken,
} from './helpers/constructTree'
import type {
  ConstructTreeContext,
  ConstructTreeState,
} from '../src/treeBuilder/constructTreeState'
import type {
  ContextualCommentNode,
  ContextualDocumentNode,
  ContextualElementNode,
} from '../src/treeBuilder/contextualNode'
import type { ConstructTreeHandlers } from '../src/treeBuilder/processTokens'

const rootType = ConstructTreeContextTypes.TagContent
const commentType = ConstructTreeContextTypes.Comment

function createComment(): ContextualCommentNode {
  return {
    type: NodeTypes.Comment,
    content: '',
    value: '',
    ...createLocations(),
  }
}

describe('construction state contracts', () => {
  it.each(['', '<svg />', '<svg width="10"><g /></svg>'])(
    'retains caretPosition as a token index for %j',
    source => {
      const { tokens } = tokenize(source)
      const { state } = constructTree(tokens, source)
      expectTypeOf(state.caretPosition).toEqualTypeOf<number>()
      expect(state.caretPosition).toBe(tokens.length)
    },
  )

  it('binds context discriminants to their valid node types', () => {
    const comment = createContext(commentType, createComment())
    const document = createContext(rootType, createDocument())
    expectTypeOf(comment.node).toEqualTypeOf<ContextualCommentNode>()
    expectTypeOf(document.node).toEqualTypeOf<
      ContextualDocumentNode | ContextualElementNode
    >()
    expectTypeOf<
      ConstructTreeState<ConstructTreeContextTypes.Comment>['currentContext']['node']
    >().toEqualTypeOf<ContextualCommentNode>()
    expectTypeOf<
      Extract<
        ConstructTreeContext,
        { type: ConstructTreeContextTypes.Comment }
      >['node']
    >().toEqualTypeOf<ContextualCommentNode>()
    // @ts-expect-error A document cannot be owned by the comment context.
    createContext(commentType, createDocument())
    const handler = createTokenDispatcher(commentType, [], (_token, state) =>
      consume(state),
    )
    expectTypeOf<typeof handler>().not.toExtend<
      ConstructTreeHandlers['TagContent']['construct']
    >()
    expect(handler.contextType).toBe(commentType)
  })

  it('consumes one token while keeping the input state unchanged', () => {
    const state = createState()
    const next = consume(state)
    expect(next.caretPosition).toBe(1)
    expect(next.currentContext).toBe(state.currentContext)
    expect(state.caretPosition).toBe(0)
    const invalidMutation = () => {
      // @ts-expect-error Token advancement must use transitions.
      state.caretPosition++
      // @ts-expect-error Context and node changes must use transitions.
      state.currentContext = createContext(commentType, createComment())
    }
    expectTypeOf(invalidMutation).returns.toBeVoid()
  })

  it('restores the parent node and context together without consuming a token', () => {
    const root = createState()
    const comment = createContext(
      commentType,
      createComment(),
      root.currentContext,
    )
    const nested = reprocess(root, comment)
    const restored = reprocess(nested, getParentContext(nested))
    expect(restored.currentContext).toBe(root.currentContext)
    expect(restored.currentContext.node).toBe(root.rootNode)
    expect(restored.caretPosition).toBe(0)
    expect(() => getParentContext(root)).toThrow(
      'Cannot leave root construction context',
    )
  })
})

describe('construction progress', () => {
  const tokens = [createToken(TokenTypes.Text)]

  it.each([
    ['unchanged frame', (state: ConstructTreeState) => state],
    [
      'equivalent new frame',
      (state: ConstructTreeState) =>
        reprocess(state, createContext(rootType, state.rootNode)),
    ],
  ])('rejects a stall with an %s', (_name, handler) => {
    const construct = createTokenDispatcher(rootType, [], (_token, state) =>
      handler(state),
    )
    expect(() =>
      processTokens(tokens, createState(), { TagContent: { construct } }),
    ).toThrow('made no progress')
  })

  it.each([-1, 2, Number.NaN])(
    'rejects an invalid token advance of %s',
    advance => {
      const construct = createTokenDispatcher(
        rootType,
        [],
        (_token, state) => ({
          ...state,
          caretPosition: state.caretPosition + advance,
        }),
      )
      expect(() =>
        processTokens(tokens, createState(), { TagContent: { construct } }),
      ).toThrow('consume exactly one token')
    },
  )

  it('rejects cycling back to a previously visited frame', () => {
    const root = createState()
    const comment = createContext(
      commentType,
      createComment(),
      root.currentContext,
    )
    const enter = createTokenDispatcher(rootType, [], (_token, state) =>
      reprocess(state, comment),
    )
    const leave = createTokenDispatcher(commentType, [], (_token, state) =>
      reprocess(state, getParentContext(state)),
    )
    expect(() =>
      processTokens(tokens, root, {
        TagContent: { construct: enter },
        Comment: { construct: leave },
      }),
    ).toThrow('context cycle')
  })

  it('allows reprocessing in a child frame and resets cycle tracking after consumption', () => {
    const root = createState()
    const comment = createContext(
      commentType,
      createComment(),
      root.currentContext,
    )
    const enter = createTokenDispatcher(rootType, [], (_token, state) =>
      reprocess(state, comment),
    )
    const leave = createTokenDispatcher(commentType, [], (_token, state) =>
      consume(state, getParentContext(state)),
    )
    const result = processTokens([...tokens, ...tokens], root, {
      TagContent: { construct: enter },
      Comment: { construct: leave },
    })
    expect(result.caretPosition).toBe(2)
    expect(result.currentContext).toBe(root.currentContext)
  })

  it('reports missing handlers without looping', () => {
    expect(() => processTokens(tokens, createState(), {})).toThrow(
      'Missing construction handler',
    )
  })

  it('recovers nested mismatches and attributes requiring repeated context transitions', () => {
    const source = '<svg a="1" b="2"><g><path></svg>'
    const result = parseForESLint(source, { errorRecovery: true })
    expect(result.ast.document.children[0]).toMatchObject({
      name: 'svg',
      attributes: [{ key: { value: 'a' } }, { key: { value: 'b' } }],
      children: [{ name: 'g', children: [{ name: 'path' }] }],
    })
    expect(result.services.errors.map(error => error.type)).toEqual([
      'UnclosedTag',
      'UnclosedTag',
      'MismatchedTag',
    ])
    expect(result.ast.document.children[0].range[1]).toBe(source.length)
  })

  it('retains typed source tokens without treating them as child nodes', () => {
    const result = parseForESLint('<!DOCTYPE svg><svg></svg>')
    const [doctype, element] = result.ast.document.children
    expect.assert(doctype.type === NodeTypes.Doctype)
    expect.assert(element.type === NodeTypes.Element)
    expectTypeOf(element.openStart).toEqualTypeOf<
      import('../src').Token<TokenTypes.OpenTagStart> | undefined
    >()
    expectTypeOf(doctype.open).toEqualTypeOf<
      import('../src').Token<TokenTypes.DoctypeOpen> | undefined
    >()
    expect(doctype.open?.value).toBe('<!DOCTYPE')
    expect(doctype.close?.value).toBe('>')
    expect(element.openStart?.value).toBe('<svg')
    expect(element.openEnd?.value).toBe('>')
    expect(element.close?.value).toBe('</svg>')
    expect(result.visitorKeys.Element).toEqual(['attributes', 'children'])
    expect(result.visitorKeys.Doctype).toEqual(['attributes'])
  })
})
