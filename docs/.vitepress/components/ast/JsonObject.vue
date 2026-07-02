<script lang="ts" setup>
import { computed } from 'vue'
import { filterProperties, getNodeType, getTypeName } from './utils'
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

const v = computed(() => {
  const nodeType = getNodeType(props.value)
  return {
    nodeType,
    typeName: getTypeName(props.value, nodeType),
    value: Object.entries(props.value as Record<string, any>).filter(item =>
      filterProperties(item[0], item[1], nodeType, props.showTokens),
    ),
  }
})
</script>

<template>
  <RenderExpandableObject
    v-bind="props"
    :data="v.value"
    :node-type="v.nodeType"
    :type-name="v.typeName"
    close-bracket="}"
    open-bracket="{"
  />
</template>
