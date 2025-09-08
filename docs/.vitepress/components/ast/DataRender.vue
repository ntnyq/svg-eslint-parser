<script lang="ts" setup>
import { isArray, isMap, isObject, isSet } from '@ntnyq/utils'
import { computed } from 'vue'
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
  value: unknown
}>()

const isTypeArray = computed(() => isArray(props.value))
const isTypeObject = computed(() => isObject(props.value))
const isTypeMap = computed(() => isMap(props.value))
const isTypeSet = computed(() => isSet(props.value))
</script>

<template>
  <JsonArray
    v-if="isTypeArray"
    v-bind="props"
    :value
  />
  <JsonObject
    v-else-if="isTypeObject"
    v-bind="props"
    :value
  />
  <JsonIterable
    v-else-if="isTypeMap"
    v-bind="props"
    :value
    type-name="Map"
  />
  <JsonIterable
    v-else-if="isTypeSet"
    v-bind="props"
    :value
    type-name="Set"
  />
  <JsonPrimitiveValue
    v-else
    v-bind="props"
    :value
  />
</template>
