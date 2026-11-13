<script lang="ts" setup>
import type { HTMLAttributes, VNode } from 'vue'

defineProps<{
  href?: string
  label?: string
  tabindex?: HTMLAttributes['tabindex']
}>()
const emit = defineEmits<{
  click: [event: MouseEvent]
  keydown: [event: KeyboardEvent]
  mouseenter: [event: MouseEvent]
  mouseleave: [event: MouseEvent]
}>()
defineSlots<{
  default?: () => VNode[]
}>()
</script>

<template>
  <a
    @click="emit('click', $event)"
    @keydown="emit('keydown', $event)"
    @mouseenter="emit('mouseenter', $event)"
    @mouseleave="emit('mouseleave', $event)"
    :href
    :tabindex
    :aria-label="label"
    role="button"
    class="cursor-pointer underline-offset-3 hover:(text-$vp-c-brand underline underline-$vp-c-brand)"
  >
    <slot>
      {{ label }}
    </slot>
  </a>
</template>
