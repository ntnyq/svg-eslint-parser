<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'
import { OutputTab } from '../../constants'
import { ITabItem } from '../ui/tabs'
import JsonContainer from './JsonContainer.vue'

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
  <div class="w-full h-full flex gap-2 flex-col relative">
    <Tabs
      @change="handleTabsChanage"
      class="flex-none"
      :options="outputTabOptions"
    />
    <div class="h-[calc(100%-60px)]">
      <JsonContainer v-if="activeOutputTab === OutputTab.Json" />
      <TreeContainer v-else-if="activeOutputTab === OutputTab.Tree" />
    </div>
  </div>
</template>
