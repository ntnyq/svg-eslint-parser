<script lang="ts" setup>
import { isFunction, isNil } from '@ntnyq/utils'
import { useToggle } from '@vueuse/core'
import { computed, watchEffect } from 'vue'
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
  value: object | unknown[]
  closeBracket: string
  data: [string, unknown][]
  openBracket: string
}>()

const lastIndex = props.data.length - 1

const [isExpanded, setIsExpanded] = useToggle(
  props.level === 'ast' || !!props.selectedPath?.startsWith(props.level),
)
const isActive = computed(
  () => props.level !== 'ast' && props.selectedPath === props.level,
)

function handleHoverItem(isHovering: boolean) {
  if (isNil(props.onHover) || !isFunction(props.onHover)) {
    return
  }

  if (isHovering) {
    props.onHover?.()
  } else {
    props.onHover?.()
  }
}

watchEffect(() => {
  const shouldOpen = !!props.selectedPath?.startsWith(props.level)

  if (shouldOpen) {
    setIsExpanded(isExpanded.value || shouldOpen)
  }
})
</script>

<template>
  <div
    :class="{
      'ast-node-expandable': !isExpanded,
      'ast-node-selected': isActive,
    }"
    :data-level="level"
    class="ast-node"
    role="list"
  >
    <template v-if="field">
      <PropertyName
        @click="setIsExpanded(!isExpanded)"
        @hover="handleHoverItem"
        :value="field"
        class="ast-prop-name"
      />
      <span>:&nbsp;</span>
    </template>
    <template v-if="typeName">
      <PropertyName
        @click="setIsExpanded(!isExpanded)"
        @hover="handleHoverItem"
        :value="typeName"
        class="ast-token-name"
      />
      <span>&nbsp;</span>
    </template>

    <span class="ast-open-bracket">{{ openBracket }}</span>

    <div
      v-if="isExpanded"
      class="ast-sub-list"
    >
      <DataRender
        v-for="(dataElement, idx) in data"
        :key="dataElement[0]"
        :field="dataElement[0]"
        :last-element="idx === lastIndex"
        :node-type
        :level="`${level}.${dataElement[0]}`"
        :on-hover
        :selected-path
        :show-tokens
        :value="dataElement[1]"
      />
    </div>
    <HiddenItem
      v-else
      :is-array="openBracket === '['"
      :level
      :value="data"
    />

    <span class="ast-close-bracket">{{ closeBracket }}</span>
    <span v-if="!lastElement">,</span>
  </div>
</template>
