<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'
import { InputTab } from '../../constants'
import type { ITabItem } from '../ui/tabs'

const { activeInputTab, setActiveInputTab } = useSharedPlaygroundState()

const inputTabOptions = shallowRef<ITabItem[]>([
  {
    name: InputTab.Code,
    title: 'Code',
  },
  {
    name: InputTab.Preview,
    title: 'Preview',
  },
])

function handleTabsChanage(tabName: string) {
  setActiveInputTab(tabName as InputTab)
}
</script>

<template>
  <div class="relative h-full w-full flex flex-col gap-2">
    <Tabs
      @change="handleTabsChanage"
      v-model="activeInputTab"
      :options="inputTabOptions"
      class="flex-none"
    />
    <div class="h-[calc(100%-60px)]">
      <CodeContainer v-if="activeInputTab === InputTab.Code" />
      <PreviewContainer v-else-if="activeInputTab === InputTab.Preview" />
    </div>
  </div>
</template>
