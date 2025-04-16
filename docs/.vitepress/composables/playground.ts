import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import { parseForESLint } from 'svg-eslint-parser'
import { computed, ref, shallowRef, watchEffect } from 'vue'
import { InputTab, OutputTab } from '../constants'
import { svgSample } from '../constants/sample'
import { packageName } from '../meta'
import type { ParseForESLintResult } from 'svg-eslint-parser'

export function usePlaygroundState() {
  const code = useLocalStorage(`${packageName}:code`, svgSample)
  const ast = ref<ParseForESLintResult | undefined>()

  const loading = ref(false)
  const parseCost = ref(0)
  const error = shallowRef<unknown>()

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
    setCode(null)
    parseCost.value = 0
    error.value = null
    ast.value = undefined
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
      error.value = null
    } catch (err) {
      console.error(err)
      error.value = err
    } finally {
      loading.value = false
    }
  })

  return {
    code,

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
