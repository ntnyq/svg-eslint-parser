<script lang="ts" setup>
import { shallowRef } from 'vue'
import { useSharedPlaygroundState } from '../../composables/usePlaygroundState'
import { InputTab } from '../../constants'
import type { TabOption } from '../ui/tabOption'

const { activeInputTab, lineCount, sourceSizeBytes } =
  useSharedPlaygroundState()
const wrap = shallowRef(true)
const inputTabOptions: TabOption<InputTab>[] = [
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
        label="Input view"
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
        {{ sourceSizeBytes.toLocaleString() }} bytes</span
      >
      <span>UTF-8</span>
    </footer>
  </section>
</template>
