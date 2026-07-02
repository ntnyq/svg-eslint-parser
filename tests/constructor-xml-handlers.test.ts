import { describe, expect, it } from 'vitest'
import {
  ConstructTreeContextTypes,
  NodeTypes,
  TokenTypes,
} from '../src/constants'
import { construct as constructXMLDeclaration } from '../src/constructor/handlers/xmlDeclaration'
import { construct as constructXMLDeclarationAttribute } from '../src/constructor/handlers/xmlDeclarationAttribute'
import { construct as constructXMLDeclarationAttributes } from '../src/constructor/handlers/xmlDeclarationAttributes'
import { construct as constructXMLDeclarationAttributeValue } from '../src/constructor/handlers/xmlDeclarationAttributeValue'

function createToken(type: TokenTypes, value = 'x') {
  return {
    type,
    value,
    range: [2, 3] as [number, number],
    loc: {
      start: { line: 1, column: 2 },
      end: { line: 1, column: 3 },
    },
  }
}

function createState(overrides: Record<string, unknown> = {}) {
  const parentContext = { type: ConstructTreeContextTypes.Tag }
  return {
    caretPosition: 0,
    currentContext: {
      type: ConstructTreeContextTypes.XMLDeclaration,
      parentRef: parentContext,
    },
    currentNode: {
      type: NodeTypes.XMLDeclaration,
      range: [0, 1] as [number, number],
      loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 },
      },
      attributes: [],
    },
    ...overrides,
  } as any
}

describe('constructor xml handlers', () => {
  it('xmlDeclaration enters attributes context on declaration open', () => {
    const state = createState()

    constructXMLDeclaration(
      createToken(TokenTypes.XMLDeclarationOpen, '<?xml'),
      state,
    )

    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttributes,
    )
    expect(state.caretPosition).toBe(1)
  })

  it('xmlDeclaration default branch increments caret', () => {
    const state = createState()

    constructXMLDeclaration(createToken(TokenTypes.Text, 't'), state)

    expect(state.caretPosition).toBe(1)
  })

  it('xmlDeclarationAttributes creates new attribute context', () => {
    const state = createState({
      currentContext: {
        type: ConstructTreeContextTypes.XMLDeclarationAttributes,
        parentRef: { type: ConstructTreeContextTypes.XMLDeclaration },
      },
      currentNode: {
        type: NodeTypes.XMLDeclaration,
        range: [0, 1] as [number, number],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 1 },
        },
      },
    })

    constructXMLDeclarationAttributes(
      createToken(TokenTypes.XMLDeclarationAttributeKey, 'version'),
      state,
    )

    expect(state.currentNode.attributes).toHaveLength(1)
    expect(state.currentNode.attributes[0].type).toBe(
      NodeTypes.XMLDeclarationAttribute,
    )
    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
  })

  it('xmlDeclarationAttributes exits on declaration close', () => {
    const state = createState({
      currentContext: {
        type: ConstructTreeContextTypes.XMLDeclarationAttributes,
        parentRef: { type: ConstructTreeContextTypes.XMLDeclaration },
      },
      currentNode: {
        ...createState().currentNode,
        parentRef: { type: NodeTypes.Document },
      },
    })

    constructXMLDeclarationAttributes(
      createToken(TokenTypes.XMLDeclarationClose, '?>'),
      state,
    )

    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclaration,
    )
  })

  it('xmlDeclarationAttribute handles key and assignment tokens', () => {
    const attribute: {
      key?: { value: string }
      loc: {
        end: { column: number; line: number }
        start: { column: number; line: number }
      }
      quoteChar?: string
      range: [number, number]
      type: NodeTypes
      value?: { value: string }
    } = {
      type: NodeTypes.XMLDeclarationAttribute,
      range: [0, 1],
      loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 },
      },
    }
    const state = createState({
      currentContext: {
        type: ConstructTreeContextTypes.XMLDeclarationAttribute,
        parentRef: { type: ConstructTreeContextTypes.XMLDeclarationAttributes },
      },
      currentNode: {
        attributes: [attribute],
      },
    })

    constructXMLDeclarationAttribute(
      createToken(TokenTypes.XMLDeclarationAttributeKey, 'version'),
      state,
    )
    constructXMLDeclarationAttribute(
      createToken(TokenTypes.XMLDeclarationAttributeAssignment, '='),
      state,
    )

    expect(attribute.key?.value).toBe('version')
    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttributeValue,
    )
    expect(state.caretPosition).toBe(2)
  })

  it('xmlDeclarationAttribute exits to parent on end tokens', () => {
    const state = createState({
      currentContext: {
        type: ConstructTreeContextTypes.XMLDeclarationAttribute,
        parentRef: { type: ConstructTreeContextTypes.XMLDeclarationAttributes },
      },
      currentNode: {
        attributes: [
          {
            type: NodeTypes.XMLDeclarationAttribute,
            range: [0, 1],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            },
          },
        ],
      },
    })

    constructXMLDeclarationAttribute(
      createToken(TokenTypes.XMLDeclarationClose, '?>'),
      state,
    )

    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttributes,
    )
  })

  it('xmlDeclarationAttributeValue sets and finalizes attribute value', () => {
    const attribute: {
      key: { value: string }
      loc: {
        end: { column: number; line: number }
        start: { column: number; line: number }
      }
      quoteChar?: string
      range: [number, number]
      type: NodeTypes
      value?: { value: string }
    } = {
      type: NodeTypes.XMLDeclarationAttribute,
      range: [0, 1],
      loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 },
      },
      key: { value: 'version' },
    }
    const state = createState({
      currentContext: {
        type: ConstructTreeContextTypes.XMLDeclarationAttributeValue,
        parentRef: { type: ConstructTreeContextTypes.XMLDeclarationAttribute },
      },
      currentNode: {
        attributes: [attribute],
      },
    })

    constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.XMLDeclarationAttributeValueWrapperStart, '"'),
      state,
    )
    constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.XMLDeclarationAttributeValue, '1.0'),
      state,
    )
    constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.XMLDeclarationAttributeValueWrapperEnd, '"'),
      state,
    )

    expect(attribute.value?.value).toBe('1.0')
    expect(attribute.quoteChar).toBe('"')
    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
  })

  it('xmlDeclarationAttributeValue exits when value already exists', () => {
    const state = createState({
      currentContext: {
        type: ConstructTreeContextTypes.XMLDeclarationAttributeValue,
        parentRef: { type: ConstructTreeContextTypes.XMLDeclarationAttribute },
      },
      currentNode: {
        attributes: [
          {
            type: NodeTypes.XMLDeclarationAttribute,
            range: [0, 1],
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 1 },
            },
            value: { value: 'already' },
          },
        ],
      },
    })

    constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.XMLDeclarationAttributeValue, 'next'),
      state,
    )

    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
  })
})
