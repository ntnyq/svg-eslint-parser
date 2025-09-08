<script lang="ts" setup>
import 'floating-vue/style.css'
import { Tooltip } from 'floating-vue'
import { useData } from 'vitepress/client'
import { computed } from 'vue'
import type { ParentNodeType } from './types'

const props = defineProps<{
  field?: string
  lastElement?: boolean
  nodeType?: ParentNodeType
  value: any
}>()

const { isDark } = useData()

const tooltip = computed(() => {
  if (props.field && props.nodeType) {
    return ''
  }
  return undefined
})
</script>

<template>
  <div
    class="ast-value-body"
    role="listitem"
  >
    <span
      v-if="field"
      class="ast-prop-name"
      >{{ field }}:&nbsp;</span
    >

    <Tooltip
      v-if="tooltip"
      :class="{ dark: isDark }"
      :triggers="['hover']"
      placement="right"
    >
      <PropertyValue :value />
      <template #popper>
        {{ tooltip }}
      </template>
    </Tooltip>
    <PropertyValue
      v-else
      :value
    />

    <span
      v-if="!lastElement"
      class="ast-label"
      >,</span
    >
  </div>
</template>
