<script lang="ts" setup>
import type { OnHoverNodeFn, ParentNodeType } from './types'

const props = defineProps<{
  field?: string
  lastElement?: boolean
  level: string
  nodeType?: ParentNodeType
  onHover?: OnHoverNodeFn
  selectedPath?: string
  showTokens?: boolean
  typeName?: string
  value: any
}>()
</script>

<template>
  <RenderExpandableObject
    v-bind="props"
    :data="Object.entries(value as Iterable<unknown>)"
    close-bracket=")"
    open-bracket="("
  />
</template>
