<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'
import { OutputTab } from '../../constants'
import JsonContainer from './JsonContainer.vue'
import type { ITabItem } from '../ui/tabs'

const { activeOutputTab, setActiveOutputTab, parseError } =
  useSharedPlaygroundState()

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
    <div
      v-if="parseError"
      role="alert"
      class="overflow-auto rounded bg-red-500/10 p-4 text-red-600"
    >
      {{ parseError }}
    </div>
    <div
      v-else
      class="min-h-0 flex-1"
    >
      <JsonContainer v-if="activeOutputTab === OutputTab.Json" />
      <TreeContainer v-else-if="activeOutputTab === OutputTab.Tree" />
    </div>
  </div>
</template>
