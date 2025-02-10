<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
import { Tooltip } from 'floating-vue'

const props = defineProps<{
  value?: unknown
}>()

const { copy, copied } = useClipboard({ legacy: true })

async function handleClick() {
  await copy(JSON.stringify(props.value))
}
</script>

<template>
  <div class="text-md absolute right-2 top-2 box-border text-center font-sans">
    <Tooltip
      :triggers="['click']"
      :hide-triggers="['hover']"
    >
      <button
        @click="handleClick"
        :aria-label="!copied ? 'Copy code to clipboard' : 'Copied'"
        :disabled="copied"
        type="button"
        role="button"
        class="flex-center select-none border border-$vp-c-border rounded-md border-solid p-2 hover:(border-$vp-c-border bg-$vp-c-gray-soft)"
      >
        <div
          :class="copied ? 'i-lucide:copy-check' : 'i-lucide:copy'"
          class="text-lg"
        />
      </button>
      <template #popper>
        <span>Copied</span>
      </template>
    </Tooltip>
  </div>
</template>
