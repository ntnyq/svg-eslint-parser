import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'

import { NodeTypes } from '../../src/constants'
import { parseForESLint } from '../../src/parser'
import type { CommentNode, TagNode } from '../../src/types'

describe('Comment Parsing', () => {
  it('should parse simple comments', () => {
    const source = '<!-- This is a comment -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const comment = document.children[0] as CommentNode

    expect(comment.type).toBe(NodeTypes.Comment)
    expect(comment.content).toBe(' This is a comment ')
  })

  it('should parse empty comments', () => {
    const source = '<!---->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const comment = document.children[0] as CommentNode

    expect(comment.type).toBe(NodeTypes.Comment)
    expect(comment.content).toBe('')
  })

  it('should parse comments with special characters', () => {
    const source = '<!-- Test & Demo < > " \' -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const comment = document.children[0] as CommentNode

    expect(comment.content).toBe(' Test & Demo < > " \' ')
  })

  it('should parse multi-line comments', () => {
    const source = $`
      <!--
        Line 1
        Line 2
        Line 3
      -->
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const comment = document.children[0] as CommentNode

    expect(comment.type).toBe(NodeTypes.Comment)
    expect(comment.content).toContain('Line 1')
    expect(comment.content).toContain('Line 2')
    expect(comment.content).toContain('Line 3')
  })

  it('should parse multiple comments', () => {
    const source = '<!-- Comment 1 --><!-- Comment 2 --><!-- Comment 3 -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    const comments = document.children.filter(
      (child: any) => child.type === NodeTypes.Comment,
    ) as CommentNode[]
    expect(comments).toHaveLength(3)
    expect(comments[0].content).toBe(' Comment 1 ')
    expect(comments[1].content).toBe(' Comment 2 ')
    expect(comments[2].content).toBe(' Comment 3 ')
  })

  it('should parse comments between tags', () => {
    const source = '<div><!-- Comment --></div>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode

    expect(div.children[0].type).toBe(NodeTypes.Comment)
    expect((div.children[0] as CommentNode).content).toBe(' Comment ')
  })

  it('should parse comments with hyphens', () => {
    const source = '<!-- This-is-a-test -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const comment = document.children[0] as CommentNode

    expect(comment.content).toBe(' This-is-a-test ')
  })

  it('should parse comments with numbers', () => {
    const source = '<!-- Version 1.0.0 -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const comment = document.children[0] as CommentNode

    expect(comment.content).toBe(' Version 1.0.0 ')
  })

  it('should parse comments adjacent to tags', () => {
    const source = '<!-- Before --><div></div><!-- After -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]

    expect(document.children[0].type).toBe(NodeTypes.Comment)
    expect(document.children[1].type).toBe(NodeTypes.Tag)
    expect(document.children[2].type).toBe(NodeTypes.Comment)
  })

  it('should parse nested comments in structure', () => {
    const source = $`
      <div>
        <!-- Outer comment -->
        <span>
          <!-- Inner comment -->
        </span>
      </div>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const div = document.children[0] as TagNode

    const comments = div.children.filter(
      (child: any) => child.type === NodeTypes.Comment,
    )
    expect(comments.length).toBeGreaterThan(0)
  })

  it('should parse comments with URLs', () => {
    const source = '<!-- https://example.com/path?query=value -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const comment = document.children[0] as CommentNode

    expect(comment.content).toBe(' https://example.com/path?query=value ')
  })

  it('should parse comments with code examples', () => {
    const source = '<!-- <div class="test"></div> -->'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const comment = document.children[0] as CommentNode

    expect(comment.content).toBe(' <div class="test"></div> ')
  })
})
