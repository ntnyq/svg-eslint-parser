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
      type: NodeTypes.Element,
      name: 'xml',
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
  it('xmlDeclaration parses name and exits context on open tag start', () => {
    const state = createState()

    constructXMLDeclaration(createToken(TokenTypes.OpenTagStart, '<SVG'), state)

    expect(state.currentNode.name).toBe('svg')
    expect(state.currentContext.type).toBe(ConstructTreeContextTypes.Tag)
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
        type: NodeTypes.Element,
        range: [0, 1] as [number, number],
        loc: {
          start: { line: 1, column: 0 },
          end: { line: 1, column: 1 },
        },
      },
    })

    constructXMLDeclarationAttributes(
      createToken(TokenTypes.AttributeKey, 'version'),
      state,
    )

    expect(state.currentNode.attributes).toHaveLength(1)
    expect(state.currentNode.attributes[0].type).toBe(NodeTypes.Attribute)
    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
  })

  it('xmlDeclarationAttributes exits on open tag end', () => {
    const state = createState({
      currentContext: {
        type: ConstructTreeContextTypes.XMLDeclarationAttributes,
        parentRef: { type: ConstructTreeContextTypes.XMLDeclaration },
      },
    })

    constructXMLDeclarationAttributes(
      createToken(TokenTypes.OpenTagEnd, '>'),
      state,
    )

    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclaration,
    )
  })

  it('xmlDeclarationAttribute handles value and wrapper tokens', () => {
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
      type: NodeTypes.Attribute,
      range: [0, 1],
      loc: {
        start: { line: 1, column: 0 },
        end: { line: 1, column: 1 },
      },
      key: { value: 'version' },
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
      createToken(TokenTypes.AttributeValue, '1.0'),
      state,
    )
    constructXMLDeclarationAttribute(
      createToken(TokenTypes.AttributeValueWrapperStart, '"'),
      state,
    )
    constructXMLDeclarationAttribute(
      createToken(TokenTypes.AttributeValueWrapperEnd, '"'),
      state,
    )

    expect(attribute.value?.value).toBe('1.0')
    expect(attribute.quoteChar).toBe('"')
    expect(state.caretPosition).toBe(3)
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
            type: NodeTypes.Attribute,
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
      createToken(TokenTypes.AttributeKey, 'encoding'),
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
      type: NodeTypes.Attribute,
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
      createToken(TokenTypes.AttributeValueWrapperStart, '"'),
      state,
    )
    constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.AttributeValue, '1.0'),
      state,
    )
    constructXMLDeclarationAttributeValue(
      createToken(TokenTypes.AttributeValueWrapperEnd, '"'),
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
            type: NodeTypes.Attribute,
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
      createToken(TokenTypes.AttributeValue, 'next'),
      state,
    )

    expect(state.currentContext.type).toBe(
      ConstructTreeContextTypes.XMLDeclarationAttribute,
    )
  })
})
