import { describe, expect, it } from 'vitest'
import {
  filterProperties,
  getNodeType,
} from '../docs/.vitepress/components/ast/utils'
import { parseForESLint } from '../src'

describe('AST viewer property visibility', () => {
  const program = parseForESLint('<!-- comment --><svg a="1" />').ast

  function visibleFields(showTokens?: boolean) {
    return Object.entries(program)
      .filter(([key, value]) =>
        filterProperties(key, value, getNodeType(program), showTokens),
      )
      .map(([key]) => key)
  }

  it('keeps tokens visible by default alongside the document and comments', () => {
    expect(visibleFields()).toEqual(
      expect.arrayContaining([
        'document',
        'comments',
        'tokens',
        'range',
        'loc',
      ]),
    )
    expect(visibleFields(true)).toEqual(visibleFields())
  })

  it('hides tokens without hiding the AST, comments, or source positions', () => {
    const fields = visibleFields(false)
    expect(fields).not.toContain('tokens')
    expect(fields).toEqual(
      visibleFields(true).filter(field => field !== 'tokens'),
    )
  })
})
