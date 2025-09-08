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
const emits = defineEmits<{
  change: [name: string, item: ITabItem]
}>()

const activeItem = defineModel<string>({ default: '' })

function handleItemClick(item: ITabItem) {
  activeItem.value = item.name
  emits('change', item.name, item)
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
    class="relative h-50px flex flex-wrap items-center gap-1 px-1"
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
