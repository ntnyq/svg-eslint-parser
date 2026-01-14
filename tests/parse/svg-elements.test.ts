import { unindent as $ } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'

import { NodeTypes } from '../../src/constants'
import { parseForESLint } from '../../src/parser'
import type { TagNode, TextNode } from '../../src/types'

describe('SVG-Specific Parsing', () => {
  it('should parse basic SVG element', () => {
    const source = '<svg width="100" height="100"></svg>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const svg = document.children[0] as TagNode

    expect(svg.type).toBe(NodeTypes.Tag)
    expect(svg.name).toBe('svg')
    expect(svg.attributes).toHaveLength(2)
  })

  it('should parse SVG with viewBox', () => {
    const source = '<svg viewBox="0 0 100 100"></svg>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const svg = document.children[0] as TagNode

    const viewBox = svg.attributes.find(
      (attr: any) => attr.key.value === 'viewBox',
    )
    expect(viewBox!.value?.value).toBe('0 0 100 100')
  })

  it('should parse SVG with xmlns', () => {
    const source = '<svg xmlns="http://www.w3.org/2000/svg"></svg>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const svg = document.children[0] as TagNode

    const xmlns = svg.attributes.find((attr: any) => attr.key.value === 'xmlns')
    expect(xmlns!.value?.value).toBe('http://www.w3.org/2000/svg')
  })

  it('should parse circle element', () => {
    const source = '<circle cx="50" cy="50" r="40" fill="red" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const circle = document.children[0] as TagNode

    expect(circle.name).toBe('circle')
    expect(circle.selfClosing).toBe(true)
    expect(circle.attributes).toHaveLength(4)
  })

  it('should parse rect element', () => {
    const source = '<rect x="10" y="10" width="50" height="50" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const rect = document.children[0] as TagNode

    expect(rect.name).toBe('rect')
    expect(rect.attributes).toHaveLength(4)
  })

  it('should parse path element with d attribute', () => {
    const source = '<path d="M 10 10 L 50 50 L 10 50 Z" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const path = document.children[0] as TagNode

    expect(path.name).toBe('path')
    const d = path.attributes.find((attr: any) => attr.key.value === 'd')
    expect(d!.value?.value).toBe('M 10 10 L 50 50 L 10 50 Z')
  })

  it('should parse line element', () => {
    const source = '<line x1="0" y1="0" x2="100" y2="100" stroke="black" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const line = document.children[0] as TagNode

    expect(line.name).toBe('line')
    expect(line.attributes).toHaveLength(5)
  })

  it('should parse polygon element', () => {
    const source = '<polygon points="50,0 100,100 0,100" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const polygon = document.children[0] as TagNode

    expect(polygon.name).toBe('polygon')
    const points = polygon.attributes.find(
      (attr: any) => attr.key.value === 'points',
    )
    expect(points!.value?.value).toBe('50,0 100,100 0,100')
  })

  it('should parse polyline element', () => {
    const source = '<polyline points="0,0 50,50 100,0" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const polyline = document.children[0] as TagNode

    expect(polyline.name).toBe('polyline')
  })

  it('should parse ellipse element', () => {
    const source = '<ellipse cx="50" cy="50" rx="40" ry="20" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const ellipse = document.children[0] as TagNode

    expect(ellipse.name).toBe('ellipse')
    expect(ellipse.attributes).toHaveLength(4)
  })

  it('should parse text element', () => {
    const source = '<text x="10" y="20">Hello SVG</text>'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const textTag = document.children[0] as TagNode

    expect(textTag.name).toBe('text')
    expect((textTag.children[0] as TextNode).value).toBe('Hello SVG')
  })

  it('should parse g (group) element', () => {
    const source = $`
      <g id="group1">
        <circle cx="50" cy="50" r="40" />
        <rect x="10" y="10" width="50" height="50" />
      </g>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const g = document.children[0] as TagNode

    expect(g.name).toBe('g')
    const shapes = g.children.filter(
      (child: any) => child.type === NodeTypes.Tag,
    )
    expect(shapes.length).toBeGreaterThan(0)
  })

  it('should parse defs element', () => {
    const source = $`
      <defs>
        <linearGradient id="grad1">
          <stop offset="0%" stop-color="red" />
          <stop offset="100%" stop-color="blue" />
        </linearGradient>
      </defs>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const defs = document.children[0] as TagNode

    expect(defs.name).toBe('defs')
  })

  it('should parse use element with xlink:href', () => {
    const source = '<use xlink:href="#icon" x="10" y="10" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const use = document.children[0] as TagNode

    expect(use.name).toBe('use')
    const href = use.attributes.find(
      (attr: any) => attr.key.value === 'xlink:href',
    )
    expect(href!.value?.value).toBe('#icon')
  })

  it('should parse symbol element', () => {
    const source = $`
      <symbol id="icon" viewBox="0 0 32 32">
        <path d="M 0 0 L 32 32" />
      </symbol>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const symbol = document.children[0] as TagNode

    expect(symbol.name).toBe('symbol')
  })

  it('should parse clipPath element', () => {
    const source = $`
      <clipPath id="clip">
        <circle cx="50" cy="50" r="40" />
      </clipPath>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const clipPath = document.children[0] as TagNode

    // Parser converts to lowercase
    expect(clipPath.name).toBe('clippath')
  })

  it('should parse mask element', () => {
    const source = $`
      <mask id="mask">
        <rect x="0" y="0" width="100" height="100" fill="white" />
      </mask>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const mask = document.children[0] as TagNode

    expect(mask.name).toBe('mask')
  })

  it('should parse pattern element', () => {
    const source = $`
      <pattern id="pattern" x="0" y="0" width="10" height="10">
        <circle cx="5" cy="5" r="5" />
      </pattern>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const pattern = document.children[0] as TagNode

    expect(pattern.name).toBe('pattern')
  })

  it('should parse complex SVG with multiple elements', () => {
    const source = $`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stop-color="red" />
            <stop offset="100%" stop-color="blue" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#grad)" />
        <circle cx="50" cy="50" r="40" fill="white" />
        <text x="50" y="55" text-anchor="middle">SVG</text>
      </svg>
    `
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const svg = document.children[0] as TagNode

    expect(svg.name).toBe('svg')
    const tags = svg.children.filter(
      (child: any) => child.type === NodeTypes.Tag,
    )
    expect(tags.length).toBeGreaterThan(0)
  })

  it('should parse SVG with transform attribute', () => {
    const source =
      '<rect transform="rotate(45 50 50)" x="25" y="25" width="50" height="50" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const rect = document.children[0] as TagNode

    const transform = rect.attributes.find(
      (attr: any) => attr.key.value === 'transform',
    )
    expect(transform!.value?.value).toBe('rotate(45 50 50)')
  })

  it('should parse SVG with style attribute', () => {
    const source =
      '<circle cx="50" cy="50" r="40" style="fill: red; stroke: blue;" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const circle = document.children[0] as TagNode

    const style = circle.attributes.find(
      (attr: any) => attr.key.value === 'style',
    )
    expect(style!.value?.value).toContain('fill: red')
  })

  it('should parse SVG with class attribute', () => {
    const source =
      '<circle class="primary-color large" cx="50" cy="50" r="40" />'
    const { ast } = parseForESLint(source)
    const document = ast.body[0]
    const circle = document.children[0] as TagNode

    const className = circle.attributes.find(
      (attr: any) => attr.key.value === 'class',
    )
    expect(className!.value?.value).toBe('primary-color large')
  })
})
