import { NodeTypes, traverseAST } from 'svg-eslint-parser'
import type { ElementNode, Program } from 'svg-eslint-parser'

/**
 * Summarize document nodes without counting ESLint tokens or duplicate comments.
 */
export function summarizeDocument(program?: Program) {
  const elements: { node: ElementNode; depth: number }[] = []
  let nodes = 0
  let attributes = 0
  let comments = 0
  let depth = 0
  let maxDepth = 0

  if (program) {
    traverseAST(program.document, {
      enter(node) {
        nodes++
        if (node.type === NodeTypes.Element) {
          elements.push({ node, depth })
          depth++
          maxDepth = Math.max(maxDepth, depth)
          attributes += node.attributes.length
        }
        if (node.type === NodeTypes.Comment) {
          comments++
        }
      },
      leave(node) {
        if (node.type === NodeTypes.Element) {
          depth--
        }
      },
    })
  }

  const root = program?.document.children.find(
    node => node.type === NodeTypes.Element,
  )
  const rootAttributes =
    root?.attributes.map(attribute => ({
      name: attribute.key.value,
      value: attribute.value?.value ?? '',
    })) ?? []

  return { nodes, attributes, comments, maxDepth, elements, rootAttributes }
}
