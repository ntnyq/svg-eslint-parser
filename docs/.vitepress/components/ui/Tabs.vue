<script lang="ts" setup>
import { onMounted } from 'vue'
import { ITabItem } from './tabs'

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
  if (props.options.length) {
    activeItem.value = props.options[0].name
  }
})
</script>

<template>
  <div
    class="relative flex h-50px flex-wrap gap-1 px-1 items-center"
    role="tablist"
  >
    <TabItem
      @click="handleItemClick(item)"
      v-for="item in options"
      :key="item.name"
      :item="item"
      role="tab"
      :is-active="activeItem === item.name"
    />
  </div>
</template>
