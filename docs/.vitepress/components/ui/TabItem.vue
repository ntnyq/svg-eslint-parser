<script lang="ts" setup>
import type { ITabItem } from './tabs'

defineProps<{
  item: ITabItem
  isActive?: boolean
}>()
</script>

<template>
  <button
    :aria-selected="isActive"
    :tabindex="isActive ? 0 : -1"
    :class="{
      'bg-$vp-c-brand-soft text-$vp-c-brand-1': isActive,
      'cursor-pointer': !item.disabled,
      'cursor-not-allowed': item.disabled,
    }"
    :disabled="item.disabled"
    class="relative h-8 flex-center rounded-md px-3 hover:bg-$vp-c-default-soft"
    type="button"
  >
    <div
      v-if="item.icon"
      :class="item.icon"
      class="mr-2"
    />
    <span class="text-xs font-medium">
      {{ item.title }}
    </span>
  </button>
</template>
