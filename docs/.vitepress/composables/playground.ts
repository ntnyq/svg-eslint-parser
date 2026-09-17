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
  const ast = shallowRef<ParseForESLintResult | undefined>()
  const activeInputTab = ref<InputTab>(InputTab.Code)

  const loading = ref(false)
  const parseCost = ref(0)
  const parseError = shallowRef<string>()
  const errorRecovery = shallowRef(false)
  const errorRange = shallowRef<Range>()
  const selectedRange = shallowRef<Range>()
  const summary = computed(() => summarizeDocument(ast.value?.ast))
  const tokens = computed(() => ast.value?.ast.tokens ?? [])
  const diagnostics = computed(() => [
    ...(ast.value?.services.errors ?? []).map(error => ({
      ...error,
      severity: 'Error',
    })),
    ...(ast.value?.services.warnings ?? []).map(error => ({
      ...error,
      severity: 'Warning',
    })),
  ])
  const sourceSize = computed(() => new TextEncoder().encode(code.value).length)
  const lineCount = computed(() => code.value.split(/\r\n|\r|\n/u).length)

  function selectRange(range: Range) {
    activeInputTab.value = InputTab.Code
    selectedRange.value = [...range]
  }

  const astJson = computed(() => {
    if (!ast.value) {
      return ''
    }
    try {
      return JSON.stringify(ast.value, null, 2)
    } catch {
      return ''
    }
  })
  const astTree = computed(() => ast.value?.ast)

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
      loading.value = true

      ast.value = parseForESLint(code.value, {
        errorRecovery: errorRecovery.value,
      })
      parseError.value = undefined
    } catch (error) {
      ast.value = undefined
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
      parseCost.value = window.performance.now() - startTime
      loading.value = false
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
    sourceSize,
    lineCount,

    ast,
    astJson,
    astTree,

    loading,
    parseCost,

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
