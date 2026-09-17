<script lang="ts" setup>
import { onMounted } from 'vue'
import type { ITabItem } from './tabs'

const props = withDefaults(
  defineProps<{
    options?: ITabItem[]
  }>(),
  {
    options: () => [],
  },
)
const emit = defineEmits<{
  change: [name: string, item: ITabItem]
}>()

const activeItem = defineModel<string>({ default: '' })

function handleItemClick(item: ITabItem) {
  activeItem.value = item.name
  emit('change', item.name, item)
}

function handleKeydown(event: KeyboardEvent) {
  const items = props.options.filter(item => !item.disabled)
  const index = items.findIndex(item => item.name === activeItem.value)
  let nextIndex: number
  switch (event.key) {
    case 'ArrowRight':
      nextIndex = (index + 1) % items.length
      break
    case 'ArrowLeft':
      nextIndex = (index - 1 + items.length) % items.length
      break
    case 'Home':
      nextIndex = 0
      break
    case 'End':
      nextIndex = items.length - 1
      break
    default:
      return
  }
  const item = items[nextIndex]
  if (!item) {
    return
  }
  event.preventDefault()
  handleItemClick(item)
  if (event.currentTarget instanceof HTMLElement) {
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>(
      'button:not(:disabled)',
    )
    buttons[nextIndex]?.focus()
  }
}

onMounted(() => {
  if (activeItem.value) {
    return
  }
  if (props.options.length) {
    activeItem.value = props.options[0].name
  }
})
</script>

<template>
  <div
    @keydown="handleKeydown"
    class="relative h-full min-w-0 flex items-center gap-1 px-2"
    role="tablist"
  >
    <TabItem
      @click="handleItemClick(item)"
      v-for="item in options"
      :key="item.name"
      :item
      :is-active="activeItem === item.name"
      role="tab"
    />
  </div>
</template>
