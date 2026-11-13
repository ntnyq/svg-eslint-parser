import { mkdtemp, readdir, rm } from 'node:fs/promises'
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
    const { parse } = await import(pathToFileURL(join(outDir, 'index.js')).href)
    expect(parse('<svg/>')).toMatchObject({
      type: 'Document',
      children: [{ type: 'Element', name: 'svg' }],
    })
  })
})
