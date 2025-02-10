<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'
import { OutputTab } from '../../constants'
import JsonContainer from './JsonContainer.vue'
import type { ITabItem } from '../ui/tabs'

const { activeOutputTab, setActiveOutputTab } = useSharedPlaygroundState()

const outputTabOptions = shallowRef<ITabItem[]>([
  {
    name: OutputTab.Json,
    title: 'JSON',
  },
  {
    name: OutputTab.Tree,
    title: 'Tree',
  },
])

function handleTabsChanage(tabName: string) {
  setActiveOutputTab(tabName as OutputTab)
}
</script>

<template>
  <div class="relative h-full w-full flex flex-col gap-2">
    <Tabs
      @change="handleTabsChanage"
      v-model="activeOutputTab"
      :options="outputTabOptions"
      class="flex-none"
    />
    <div class="h-[calc(100%-60px)]">
      <JsonContainer v-if="activeOutputTab === OutputTab.Json" />
      <TreeContainer v-else-if="activeOutputTab === OutputTab.Tree" />
    </div>
  </div>
</template>
