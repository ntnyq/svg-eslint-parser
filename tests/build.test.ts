import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'tsdown'
import ts from 'typescript'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('package build', () => {
  let outDir: string
  let outputFiles: string[]

  beforeAll(async () => {
    outDir = await mkdtemp(
      fileURLToPath(
        new URL('../node_modules/.svg-parser-build-', import.meta.url),
      ),
    )
    await build({
      config: fileURLToPath(new URL('../tsdown.config.ts', import.meta.url)),
      outDir,
      logLevel: 'silent',
    })
    outputFiles = await readdir(outDir)
  }, 30_000)

  afterAll(async () => {
    if (outDir) {
      await rm(outDir, { recursive: true, force: true })
    }
  })

  it('emits only index.js and index.d.ts', () => {
    expect(outputFiles.toSorted()).toEqual(['index.d.ts', 'index.js'])
  })

  it('emits declarations accepted by TypeScript with library checking enabled', () => {
    const program = ts.createProgram([join(outDir, 'index.d.ts')], {
      module: ts.ModuleKind.NodeNext,
      target: ts.ScriptTarget.ESNext,
      noEmit: true,
      strict: true,
      skipLibCheck: false,
      types: [],
    })
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .map(diagnostic =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      )

    expect(diagnostics).toEqual([])
  })

  it('loads the emitted JavaScript entry and its bundled helpers', async () => {
    const { parse, findNodeByType, findNodesByType } = await import(
      pathToFileURL(join(outDir, 'index.js')).href
    )
    expect(findNodeByType).toBe(findNodesByType)
    expect(parse('<svg/>')).toMatchObject({
      type: 'Document',
      children: [{ type: 'Element', name: 'svg' }],
    })
  })

  it('preserves typed legacy imports alongside the plural query in emitted declarations', async () => {
    const consumerFile = join(outDir, 'consumer.mts')
    await writeFile(
      consumerFile,
      `
      import {
        findNodeByType, findNodesByType, NodeTypes, parseForESLint,
      } from './index.js'
      import type {
        AST, AttributeKeyNode, ConstructTreeState, ElementNode,
      } from './index.js'

      const { ast } = parseForESLint('<svg id="root"><path /></svg>')
      const legacy: ElementNode[] = findNodeByType(ast, NodeTypes.Element)
      const preferred: ElementNode[] = findNodesByType(ast, NodeTypes.Element)
      const keys: AttributeKeyNode[] = findNodesByType(ast, NodeTypes.AttributeKey)
      const namespaceKeys: AST.AttributeKeyNode[] = keys
      const compatibleQuery: typeof findNodeByType = findNodesByType
      const cursor: Pick<ConstructTreeState, 'caretPosition'> = { caretPosition: 0 }
      void [legacy, preferred, namespaceKeys, compatibleQuery, cursor]
    `,
    )
    const program = ts.createProgram([consumerFile], {
      module: ts.ModuleKind.NodeNext,
      target: ts.ScriptTarget.ESNext,
      noEmit: true,
      strict: true,
      skipLibCheck: false,
      types: [],
    })
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .map(diagnostic =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      )
    expect(diagnostics).toEqual([])
  })
})
