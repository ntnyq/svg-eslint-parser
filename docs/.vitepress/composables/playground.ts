import { createSharedComposable, useLocalStorage } from '@vueuse/core'
import { parseForESLint } from 'svg-eslint-parser'
import { computed, ref, watchEffect } from 'vue'
import { svgSample } from '../constants/sample'
import { packageName } from '../meta'

type ParseForESLintResult = ReturnType<typeof parseForESLint>

export function usePlaygroundState() {
  const code = useLocalStorage(`${packageName}:code`, svgSample)
  const ast = ref<ParseForESLintResult | undefined>()
  const astJson = computed(() => {
    if (!ast.value) return ''
    try {
      return JSON.stringify(ast.value, null, 2)
    } catch {
      return ''
    }
  })

  watchEffect(() => {
    ast.value = parseForESLint(code.value)
  })

  return {
    code,
    ast,
    astJson,
  }
}

export const useSharedPlaygroundState = createSharedComposable(usePlaygroundState)
