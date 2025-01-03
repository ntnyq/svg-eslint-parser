<script lang="ts" setup>
const props = defineProps<{
  className?: string
  value?: string
  onClick?: () => void
  onHover?: (isHover: boolean) => void
}>()

function handleClick(evt: MouseEvent) {
  evt.preventDefault()
  props.onClick?.()
}
function handleMouseEnter() {
  props.onHover?.(true)
}
function handleMouseLeave() {
  props.onHover?.(false)
}
function handleKeyDown(evt: KeyboardEvent) {
  if (evt.code !== 'Space') return
  evt.preventDefault?.()
  props.onClick?.()
}
</script>

<template>
  <PropertyLink
    @keydown="handleKeyDown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
    :class="[className]"
    :tabindex="onClick && 0"
    class="property-name"
  >
    {{ value }}
  </PropertyLink>
</template>
