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
    :class="{
      '!border-$vp-c-brand border-b-4 text-$vp-c-brand': isActive,
      'cursor-pointer': !item.disabled,
      'cursor-not-allow': item.disabled,
    }"
    :disabled="item.disabled"
    class="relative h-44px min-w-80px flex-center border-1 border-gray-200 rounded-sm border-solid px-4 hover:bg-$vp-c-gray-soft focus:outline-none"
    type="button"
  >
    <div
      v-if="item.icon"
      :class="item.icon"
      class="mr-2"
    />
    <span class="text-lg font-semibold">
      {{ item.title }}
    </span>
  </button>
</template>
