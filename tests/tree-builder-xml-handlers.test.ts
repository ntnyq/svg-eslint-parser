import { describe, expect, it } from 'vitest'
import { NodeTypes } from '../src/ast/nodeTypes'
import { TokenTypes } from '../src/tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../src/treeBuilder/constructTreeContextTypes'
import { construct as constructXMLDeclaration } from '../src/treeBuilder/handlers/xmlDeclaration'
import { construct as constructXMLDeclarationAttribute } from '../src/treeBuilder/handlers/xmlDeclarationAttribute'
import { construct as constructXMLDeclarationAttributes } from '../src/treeBuilder/handlers/xmlDeclarationAttributes'
import { construct as constructXMLDeclarationAttributeValue } from '../src/treeBuilder/handlers/xmlDeclarationAttributeValue'
import { createContext } from '../src/treeBuilder/transitions'
import {
  createLocations,
  createState,
  createToken,
} from './helpers/constructTree'
import type {
  ConstructTreeContext,
  XMLDeclarationAttributeNode,
  XMLDeclarationNode,
} from '../src'

type XMLContext =
  | ConstructTreeContextTypes.XMLDeclaration
  | ConstructTreeContextTypes.XMLDeclarationAttributes
  | ConstructTreeContextTypes.XMLDeclarationAttribute
  | ConstructTreeContextTypes.XMLDeclarationAttributeValue

function createXMLState(
  kind: XMLContext,
  attributes: XMLDeclarationAttributeNode[] = [],
) {
  const root = createState()
  const node: XMLDeclarationNode = {
    type: NodeTypes.XMLDeclaration,
    attributes,
    ...createLocations(),
  }
  let context: ConstructTreeContext = root.currentContext
  for (const type of [
    ConstructTreeContextTypes.XMLDeclaration,
    ConstructTreeContextTypes.XMLDeclarationAttributes,
    ConstructTreeContextTypes.XMLDeclarationAttribute,
    ConstructTreeContextTypes.XMLDeclarationAttributeValue,
  ] as const) {
    context = createContext(type, node, context)
    if (type === kind) {
      break
    }
  }
  return {
    node,
    state: { ...root, currentContext: context },
  }
}

describe('constructor xml handlers', () => {
  it('enters attributes context and consumes the declaration opening', () => {
    const { node, state } = createXMLState(
      ConstructTreeContextTypes.XMLDeclaration,
    )
    const result = constructXMLDeclaration(
      createToken(TokenTypes.XMLDeclarationOpen, '<?xml'),
      state,
    )
    expect(result.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttributes,
    )
    expect(result.currentContext.node).toBe(node)
    expect(result.caretPosition).toBe(1)
  })

  it('consumes unexpected tokens through the explicit fallback', () => {
    const { state } = createXMLState(ConstructTreeContextTypes.XMLDeclaration)
    expect(
      constructXMLDeclaration(createToken(TokenTypes.Text), state)
        .caretPosition,
    ).toBe(1)
  })

  it('creates an attribute and reprocesses the same token in its context', () => {
    const { node, state } = createXMLState(
      ConstructTreeContextTypes.XMLDeclarationAttributes,
    )
    const result = constructXMLDeclarationAttributes(
      createToken(TokenTypes.XMLDeclarationAttributeKey, 'version'),
      state,
    )
    expect(node.attributes).toHaveLength(1)
    expect(result.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
    expect(result.caretPosition).toBe(0)
  })

  it('restores the document frame when the declaration closes', () => {
    const { state } = createXMLState(
      ConstructTreeContextTypes.XMLDeclarationAttributes,
    )
    const result = constructXMLDeclarationAttributes(
      createToken(TokenTypes.XMLDeclarationClose, '?>'),
      state,
    )
    expect(result.currentContext.type).toBe(
      ConstructTreeContextTypes.TagContent,
    )
    expect(result.currentContext.node).toBe(result.rootNode)
    expect(result.caretPosition).toBe(1)
  })

  it('fills the key and enters the value context on assignment', () => {
    const attribute: XMLDeclarationAttributeNode = {
      type: NodeTypes.XMLDeclarationAttribute,
      ...createLocations(),
    }
    const { state } = createXMLState(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
      [attribute],
    )
    const keyed = constructXMLDeclarationAttribute(
      createToken(TokenTypes.XMLDeclarationAttributeKey, 'version'),
      state,
    )
    const result = constructXMLDeclarationAttribute(
      createToken(TokenTypes.XMLDeclarationAttributeAssignment, '='),
      keyed,
    )
    expect(attribute.key?.value).toBe('version')
    expect(result.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttributeValue,
    )
    expect(result.caretPosition).toBe(2)
  })

  it('reprocesses a closing delimiter in the parent attributes context', () => {
    const { state } = createXMLState(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
    const result = constructXMLDeclarationAttribute(
      createToken(TokenTypes.XMLDeclarationClose, '?>'),
      state,
    )
    expect(result.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttributes,
    )
    expect(result.caretPosition).toBe(0)
  })

  it('fills the quoted value and returns to its attribute context', () => {
    const attribute: XMLDeclarationAttributeNode = {
      type: NodeTypes.XMLDeclarationAttribute,
      ...createLocations(),
    }
    const { state } = createXMLState(
      ConstructTreeContextTypes.XMLDeclarationAttributeValue,
      [attribute],
    )
    const quoted = constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.XMLDeclarationAttributeValueWrapperStart, '"'),
      state,
    )
    const valued = constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.XMLDeclarationAttributeValue, '1.0'),
      quoted,
    )
    const result = constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.XMLDeclarationAttributeValueWrapperEnd, '"'),
      valued,
    )
    expect(attribute.value?.value).toBe('1.0')
    expect(attribute.quoteChar).toBe('"')
    expect(result.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
    expect(result.caretPosition).toBe(3)
  })

  it('reprocesses a new value when the active attribute already has one', () => {
    const attribute: XMLDeclarationAttributeNode = {
      type: NodeTypes.XMLDeclarationAttribute,
      value: {
        type: NodeTypes.XMLDeclarationAttributeValue,
        value: 'already',
        ...createLocations(),
      },
      ...createLocations(),
    }
    const { state } = createXMLState(
      ConstructTreeContextTypes.XMLDeclarationAttributeValue,
      [attribute],
    )
    const result = constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.XMLDeclarationAttributeValue, 'next'),
      state,
    )
    expect(result.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
    expect(result.caretPosition).toBe(0)
    expect(attribute.value?.value).toBe('already')
  })
})
