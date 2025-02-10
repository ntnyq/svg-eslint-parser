<script lang="ts" setup>
import {
  getObjectType,
  isBigInt,
  isBoolean,
  isError,
  isNil,
  isNumber,
  isRegExp,
  isString,
} from '@ntnyq/utils'
import { useToggle } from '@vueuse/core'
import { computed } from 'vue'
import { isIterable } from '../../utils'

interface ValueModel {
  readonly className: string
  readonly shortValue?: string
  readonly value: string
}

const props = defineProps<{
  value: unknown
}>()

const [isExpanded, setIsExpanded] = useToggle(false)

const model = computed<ValueModel>(() => {
  if (isString(props.value)) {
    const value = JSON.stringify(props.value)
    return {
      className: 'ast-prop-string',
      shortValue: value.length > 250 ? value.slice(0, 200) : undefined,
      value,
    }
  }

  if (isNumber(props.value)) {
    return {
      className: 'ast-prop-number',
      value: String(props.value),
    }
  }

  if (isBigInt(props.value)) {
    return {
      className: 'ast-prop-number',
      value: `${props.value}n`,
    }
  }

  if (isRegExp(props.value)) {
    return {
      className: 'ast-prop-regexp',
      value: String(props.value),
    }
  }

  if (isNil(props.value)) {
    return {
      className: 'ast-prop-empty',
      value: String(props.value),
    }
  }

  if (isBoolean(props.value)) {
    return {
      className: 'ast-prop-boolean',
      value: props.value ? 'true' : 'false',
    }
  }

  if (isError(props.value)) {
    return {
      className: 'ast-prop-error',
      value: `Error: ${props.value.message}`,
    }
  }

  return {
    className: 'ast-prop-class',
    value: isIterable(props.value) ? 'Iterable' : getObjectType(props.value),
  }
})

function handleClick(evt: MouseEvent) {
  evt.preventDefault()
  setIsExpanded(!isExpanded.value)
}
</script>

<template>
  <span
    v-if="model.shortValue"
    :class="[model.className]"
    class="property-value"
  >
    <span class="mr-1">
      {{ isExpanded ? model.value : `${model.shortValue}...` }}
    </span>
    <PropertyLink
      @click="handleClick"
      href="#read-more"
      class="ast-prop-ellipsis"
    >
      {{ isExpanded ? '(read less)' : '(read more)' }}
    </PropertyLink>
  </span>
  <span
    v-else
    :class="model.className"
  >
    {{ model.value }}
  </span>
</template>
