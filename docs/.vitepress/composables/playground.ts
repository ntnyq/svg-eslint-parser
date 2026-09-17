import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import { ParseError, parseForESLint } from 'svg-eslint-parser'
import { computed, ref, shallowRef, watchEffect } from 'vue'
import { InputTab, OutputTab } from '../constants'
import { svgSample } from '../constants/sample'
import { packageName } from '../meta'
import type { ParseForESLintResult } from 'svg-eslint-parser'

export function usePlaygroundState() {
  const code = useLocalStorage(`${packageName}:code`, svgSample)
  const ast = shallowRef<ParseForESLintResult | undefined>()

  const loading = ref(false)
  const parseCost = ref(0)
  const parseError = shallowRef<string>()

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

  const activeInputTab = ref<InputTab>(InputTab.Code)

  function setActiveInputTab(tab: InputTab) {
    activeInputTab.value = tab
  }

  const activeOutputTab = ref<OutputTab>(OutputTab.Json)

  function setActiveOutputTab(tab: OutputTab) {
    activeOutputTab.value = tab
  }

  watchEffect(() => {
    try {
      loading.value = true

      const startTime = window.performance.now()

      ast.value = parseForESLint(code.value)

      parseCost.value = window.performance.now() - startTime
      parseError.value = undefined
    } catch (error) {
      ast.value = undefined
      parseCost.value = 0
      parseError.value =
        error instanceof ParseError
          ? `Line ${error.lineNumber}, column ${error.column}: ${error.message}`
          : error instanceof Error
            ? error.message
            : String(error)
    } finally {
      loading.value = false
    }
  })

  return {
    code,
    parseError,

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
