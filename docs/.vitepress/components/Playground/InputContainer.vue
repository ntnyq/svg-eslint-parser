<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'
import { InputTab } from '../../constants'
import type { ITabItem } from '../ui/tabs'

const { activeInputTab, lineCount, sourceSize } = useSharedPlaygroundState()
const wrap = shallowRef(true)
const inputTabOptions: ITabItem[] = [
  { name: InputTab.Code, title: 'Source' },
  { name: InputTab.Preview, title: 'Preview' },
]
</script>

<template>
  <section
    aria-label="SVG source"
    class="relative h-full min-w-0 flex flex-col"
  >
    <div class="pg-panel-heading">
      <Tabs
        v-model="activeInputTab"
        :options="inputTabOptions"
        aria-label="Input view"
      />
      <button
        @click="wrap = !wrap"
        v-if="activeInputTab === InputTab.Code"
        :aria-pressed="wrap"
        :class="{ 'text-$vp-c-brand-1': wrap }"
        aria-label="Wrap source lines"
        title="Wrap source lines"
        type="button"
        class="pg-button mr-2 !px-2"
      >
        <span
          class="i-lucide:wrap-text"
          aria-hidden="true"
        />
      </button>
    </div>
    <div class="min-h-0 flex-1">
      <CodeContainer
        v-if="activeInputTab === InputTab.Code"
        :wrap
      />
      <PreviewContainer v-else-if="activeInputTab === InputTab.Preview" />
    </div>
    <footer class="pg-panel-footer">
      <span
        >{{ lineCount }} lines <span class="mx-2 text-$vp-c-divider">/</span>
        {{ sourceSize.toLocaleString() }} bytes</span
      >
      <span>UTF-8</span>
    </footer>
  </section>
</template>
