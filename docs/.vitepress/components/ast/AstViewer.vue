<script lang="ts" setup>
import './style.css'
import { isNil, isObject } from '@ntnyq/utils'
import { computed } from 'vue'
import type { OnHoverNodeFn } from './types'

const props = defineProps<{
  cursorPosition?: number
  enableScrolling?: boolean
  hideCopyButton?: boolean
  onHoverNode?: OnHoverNodeFn
  showTokens?: boolean
  value: unknown
}>()

const model = computed(() => props.value)

const selectedPath = computed(() => {
  if (isNil(props.cursorPosition) || !model.value || !isObject(model.value)) {
    return 'ast'
  }
  return 'ast'
})
</script>

<template>
  <div class="ast-list">
    <DataRender
      :value="model"
      :selected-path="selectedPath"
      level="ast"
      last-element
    />

    <CopyButton
      v-if="!hideCopyButton"
      :value="model"
    />
  </div>
</template>
