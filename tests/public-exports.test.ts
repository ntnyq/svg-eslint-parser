import { describe, expect, it } from 'vitest'
import * as api from '../src'
import { cloneNode, cloneNodeWithParent } from '../src/ast/cloneNode'
import { findFirstNodeByType, findNodeByType } from '../src/ast/findNodesByType'
import {
  countNodes,
  filterNodes,
  getNodeDepth,
  getParentChain,
  mapNodes,
} from '../src/ast/nodeHelpers'
import { NodeTypes } from '../src/ast/nodeTypes'
import { traverseAST, walkAST } from '../src/ast/traverseAST'
import { isNodeType, validateNode } from '../src/ast/validateNode'
import { visitorKeys } from '../src/ast/visitorKeys'
import { ParseError } from '../src/diagnostics/parseError'
import { ParseErrorType } from '../src/diagnostics/types'
import { defineSVGRule } from '../src/eslint/defineSVGRule'
import { meta } from '../src/meta'
import { parse } from '../src/parser/parse'
import { parseForESLint } from '../src/parser/parseForESLint'
import {
  CDATA_END,
  CDATA_START,
  COMMENT_END,
  COMMENT_START,
  PROCESSING_INSTRUCTION_END,
  RE_CLOSE_TAG_NAME,
  RE_INCOMPLETE_CLOSING_TAG,
  RE_OPEN_TAG_NAME,
  RE_OPEN_TAG_START,
  RE_XML_NAME,
  XML_DECLARATION_END,
  XML_DECLARATION_START,
} from '../src/syntax/constants'
import {
  DEPRECATED_SVG_ELEMENTS,
  SELF_CLOSING_ELEMENTS,
  SVG_ELEMENTS,
} from '../src/syntax/svgElements'
import { SPECIAL_CHAR } from '../src/tokenizer/specialChar'
import { TokenizerContextTypes } from '../src/tokenizer/tokenizerContextTypes'
import { TokenTypes } from '../src/tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../src/treeBuilder/constructTreeContextTypes'

const ownedExports = {
  meta,
  ParseError,
  parse,
  parseForESLint,
  defineSVGRule,
  cloneNode,
  cloneNodeWithParent,
  countNodes,
  filterNodes,
  findFirstNodeByType,
  findNodeByType,
  getNodeDepth,
  getParentChain,
  isNodeType,
  mapNodes,
  traverseAST,
  validateNode,
  walkAST,
  ParseErrorType,
  COMMENT_START,
  COMMENT_END,
  CDATA_START,
  CDATA_END,
  XML_DECLARATION_START,
  XML_DECLARATION_END,
  PROCESSING_INSTRUCTION_END,
  RE_XML_NAME,
  RE_OPEN_TAG_START,
  RE_OPEN_TAG_NAME,
  RE_CLOSE_TAG_NAME,
  RE_INCOMPLETE_CLOSING_TAG,
  NodeTypes,
  TokenTypes,
  SPECIAL_CHAR,
  SVG_ELEMENTS,
  DEPRECATED_SVG_ELEMENTS,
  SELF_CLOSING_ELEMENTS,
  TokenizerContextTypes,
  ConstructTreeContextTypes,
  name: meta.name,
  VisitorKeys: visitorKeys,
}

describe('public runtime exports', () => {
  it('preserves the complete existing export surface without leaking new internals', () => {
    expect(Object.keys(api).sort()).toEqual([
      'CDATA_END',
      'CDATA_START',
      'COMMENT_END',
      'COMMENT_START',
      'ConstructTreeContextTypes',
      'DEPRECATED_SVG_ELEMENTS',
      'NodeTypes',
      'PROCESSING_INSTRUCTION_END',
      'ParseError',
      'ParseErrorType',
      'RE_CLOSE_TAG_NAME',
      'RE_INCOMPLETE_CLOSING_TAG',
      'RE_OPEN_TAG_NAME',
      'RE_OPEN_TAG_START',
      'RE_XML_NAME',
      'SELF_CLOSING_ELEMENTS',
      'SPECIAL_CHAR',
      'SVG_ELEMENTS',
      'TokenTypes',
      'TokenizerContextTypes',
      'VisitorKeys',
      'XML_DECLARATION_END',
      'XML_DECLARATION_START',
      'cloneNode',
      'cloneNodeWithParent',
      'countNodes',
      'defineSVGRule',
      'filterNodes',
      'findFirstNodeByType',
      'findNodeByType',
      'getNodeDepth',
      'getParentChain',
      'isNodeType',
      'mapNodes',
      'meta',
      'name',
      'parse',
      'parseForESLint',
      'traverseAST',
      'validateNode',
      'walkAST',
    ])
  })

  it('forwards existing names to the same values in their owning modules', () => {
    for (const [name, value] of Object.entries(ownedExports)) {
      expect(Reflect.get(api, name)).toBe(value)
    }
  })
})
