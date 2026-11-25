<script lang="ts" setup>
import { useToggle } from '@vueuse/core'
import type { ParentNodeType } from './types'

// oxlint-disable-next-line vue/max-props
const props = defineProps<{
  field?: string
  lastElement?: boolean
  level: string
  nodeType?: ParentNodeType
  showTokens?: boolean
  typeName?: string
  value: object | unknown[]
  closeBracket: string
  data: [string, unknown][]
  openBracket: string
}>()

const [isExpanded, setIsExpanded] = useToggle(props.level === 'ast')
</script>

<template>
  <div
    :class="{
      'ast-node-expandable': !isExpanded,
    }"
    :data-level="level"
    class="ast-node"
    role="list"
  >
    <template v-if="field">
      <PropertyName
        @click="setIsExpanded(!isExpanded)"
        :value="field"
        class="ast-prop-name"
      />
      <span>:&nbsp;</span>
    </template>
    <template v-if="typeName">
      <PropertyName
        @click="setIsExpanded(!isExpanded)"
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
        :last-element="idx === data.length - 1"
        :node-type
        :level="`${level}.${dataElement[0]}`"
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
