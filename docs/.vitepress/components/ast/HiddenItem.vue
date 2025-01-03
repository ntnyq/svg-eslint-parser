<script lang="ts" setup>
import { isNaN, isNumber } from '@ntnyq/utils'
import { computed } from 'vue'

const props = defineProps<{
  isArray?: boolean
  level: string
  value: [string, unknown][]
}>()

const model = computed<{ isComplex: boolean; length: number }>(() => {
  if (props.isArray) {
    const filtered = props.value.filter(([key]) => !isNaN(Number(key)))
    return {
      isComplex: filtered.some(([_, item]) => isNumber(item)),
      length: filtered.length,
    }
  } else {
    return {
      isComplex: true,
      length: 0,
    }
  }
})
</script>

<template>
  <span
    v-if="isArray && model.isComplex"
    class="ast-hidden-item ast-hidden-item-complex"
  >
    <span
      v-for="(item, idx) in value"
      :key="idx"
      class="ast-hidden-item-complex-item"
    >
      <span class="ast-hidden-item-complex-item-content">{{ idx > 0 ? ', ' : '' }}</span>
      <PropertyValue :value="item[1]" />
    </span>
  </span>
  <span
    v-else-if="isArray"
    class="ast-hidden-item ast-hidden-item-array"
  >
    {{ model.length }} {{ model.length === 1 ? 'element' : 'elements' }}
  </span>
  <span
    v-else
    class="ast-hidden-item ast-hidden-item-unknown"
  >
    <span
      v-for="(item, idx) in value"
      :key="`${level}_${idx}`"
    >
      {{ idx > 0 ? ', ' : '' }}
      {{ String(item[0]) }}
    </span>
  </span>
</template>
