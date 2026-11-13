import { afterEach, describe, expect, it, vi } from 'vitest'
import { NodeTypes, parse, parseForESLint, VisitorKeys } from '../../src'
import * as core from '../../src/parser/parseSource'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ESLint adapter', () => {
  it('wraps the core document and exposes comments without mutating core tokens', () => {
    const source =
      '<!-- before -->\n<svg><!-- inner --><g/></svg><!-- after -->'
    const raw = core.parseSource(source)
    const rawTypes = raw.tokens.map(token => token.type)
    Object.freeze(raw.tokens)
    const parseSource = vi.spyOn(core, 'parseSource').mockReturnValue(raw)

    const result = parseForESLint(source)

    expect(parseSource).toHaveBeenCalledExactlyOnceWith(source)
    expect(result.ast.type).toBe(NodeTypes.Program)
    expect(result.ast.body).toEqual([])
    expect(result.ast.document).toBe(raw.ast)
    expect(result.ast.range).toEqual(raw.ast.range)
    expect(result.ast.loc).toEqual(raw.ast.loc)
    expect(result.visitorKeys).toBe(VisitorKeys)
    expect(result.scopeManager).toBeNull()
    expect(result.services.errors).toBe(raw.errors)
    expect(result.services.warnings).toBe(raw.warnings)
    expect(result.services.isSVG).toBe(true)
    expect(result.ast.comments.map(comment => comment.value)).toEqual([
      ' before ',
      ' inner ',
      ' after ',
    ])
    expect(
      result.ast.comments.every(
        comment => source.slice(...comment.range) === `<!--${comment.value}-->`,
      ),
    ).toBe(true)
    expect(
      result.ast.tokens.some(token => token.type.startsWith('Comment')),
    ).toBe(false)
    expect(raw.tokens.map(token => token.type)).toEqual(rawTypes)
    expect(raw.tokens.some(token => token.type.startsWith('Comment'))).toBe(
      true,
    )
  })

  it.each([
    '<svg/>',
    '<?xml version="1.0"?><!DOCTYPE svg><svg><!-- comment --><![CDATA[text]]></svg>',
    '<svg a="1" a="2"><g>',
  ])('returns the same document through both entry points: %s', source => {
    const direct = parse(source, { errorRecovery: true })
    const adapted = parseForESLint(source, { errorRecovery: true })
    expect(direct).toEqual(adapted.ast.document)
    expect(direct.type).toBe(NodeTypes.Document)
    expect('tokens' in direct).toBe(false)
    expect('comments' in direct).toBe(false)
  })

  it('keeps compatibility options from changing either output contract', () => {
    const source = '<!-- comment --><svg/>'
    const options = {
      comment: false,
      loc: false,
      range: false,
      tokens: false,
      eslintVisitorKeys: false,
      eslintScopeManager: false,
    }
    const direct = parse(source, options)
    const adapted = parseForESLint(source, options)
    expect(direct).toEqual(adapted.ast.document)
    expect(adapted.ast.comments).toHaveLength(1)
    expect(adapted.ast.tokens.length).toBeGreaterThan(0)
    expect(adapted.visitorKeys).toBe(VisitorKeys)
    expect(adapted.scopeManager).toBeNull()
  })
})
