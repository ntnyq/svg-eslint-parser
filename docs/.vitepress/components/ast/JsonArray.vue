<script lang="ts" setup>
import type { ParentNodeType } from './types'

const props = defineProps<{
  field?: string
  lastElement?: boolean
  level: string
  nodeType?: ParentNodeType
  showTokens?: boolean
  typeName?: string
  value: any
}>()
</script>

<template>
  <RenderExpandableObject
    v-bind="props"
    :data="Object.entries(value as unknown[])"
    close-bracket="]"
    open-bracket="["
  />
</template>
