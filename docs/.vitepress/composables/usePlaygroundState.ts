import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import { ParseError, parseForESLint } from 'svg-eslint-parser'
import { computed, ref, shallowRef, watchEffect } from 'vue'
import { InputTab, OutputTab } from '../constants'
import { svgSample } from '../constants/sample'
import { packageName } from '../meta'
import { summarizeDocument } from '../utils/summarizeDocument'
import type { ParseForESLintResult, Range } from 'svg-eslint-parser'

export function usePlaygroundState() {
  const code = useLocalStorage(`${packageName}:code`, svgSample)
  const parseResult = shallowRef<ParseForESLintResult | undefined>()
  const activeInputTab = ref<InputTab>(InputTab.Code)

  const isParsing = ref(false)
  const parseDurationMs = ref(0)
  const parseError = shallowRef<string>()
  const errorRecovery = shallowRef(false)
  const errorRange = shallowRef<Range>()
  const selectedRange = shallowRef<Range>()
  const summary = computed(() => summarizeDocument(parseResult.value?.ast))
  const tokens = computed(() => parseResult.value?.ast.tokens ?? [])
  const diagnostics = computed(() => [
    ...(parseResult.value?.services.errors ?? []).map(error => ({
      ...error,
      severity: 'Error',
    })),
    ...(parseResult.value?.services.warnings ?? []).map(error => ({
      ...error,
      severity: 'Warning',
    })),
  ])
  const sourceSizeBytes = computed(
    () => new TextEncoder().encode(code.value).length,
  )
  const lineCount = computed(() => code.value.split(/\r\n|\r|\n/u).length)

  function selectRange(range: Range) {
    activeInputTab.value = InputTab.Code
    selectedRange.value = [...range]
  }

  const parseResultJson = computed(() => {
    if (!parseResult.value) {
      return ''
    }
    try {
      return JSON.stringify(parseResult.value, null, 2)
    } catch {
      return ''
    }
  })
  const program = computed(() => parseResult.value?.ast)

  function setCode(newCode: string | null) {
    code.value = newCode
  }

  function resetPlayground() {
    setCode(svgSample)
  }

  function setActiveInputTab(tab: InputTab) {
    activeInputTab.value = tab
  }

  const activeOutputTab = ref<OutputTab>(OutputTab.Json)

  function setActiveOutputTab(tab: OutputTab) {
    activeOutputTab.value = tab
  }

  watchEffect(() => {
    const startTime = window.performance.now()
    selectedRange.value = undefined
    errorRange.value = undefined
    try {
      isParsing.value = true

      parseResult.value = parseForESLint(code.value, {
        errorRecovery: errorRecovery.value,
      })
      parseError.value = undefined
    } catch (error) {
      parseResult.value = undefined
      if (error instanceof ParseError) {
        errorRange.value = [error.index, error.index + 1]
      }
      parseError.value =
        error instanceof ParseError
          ? `Line ${error.lineNumber}, column ${error.column}: ${error.message}`
          : error instanceof Error
            ? error.message
            : String(error)
    } finally {
      parseDurationMs.value = window.performance.now() - startTime
      isParsing.value = false
    }
  })

  return {
    code,
    parseError,
    errorRecovery,
    errorRange,
    selectedRange,
    selectRange,
    summary,
    tokens,
    diagnostics,
    sourceSizeBytes,
    lineCount,

    parseResult,
    parseResultJson,
    program,

    isParsing,
    parseDurationMs,

    activeInputTab,
    setActiveInputTab,

    activeOutputTab,
    setActiveOutputTab,

    setCode,
    resetPlayground,
  }
}

export const useSharedPlaygroundState =
  createSharedComposable(usePlaygroundState)
