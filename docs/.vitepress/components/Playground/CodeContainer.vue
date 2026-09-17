<script lang="ts" setup>
import { EditorView } from '@codemirror/view'
import { computed } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'

const props = defineProps<{ wrap: boolean }>()
const { code, selectedRange } = useSharedPlaygroundState()
const extensions = computed(() => (props.wrap ? [EditorView.lineWrapping] : []))
</script>

<template>
  <div class="relative h-full w-full">
    <Editor
      v-model="code"
      :selection="selectedRange"
      :extensions
      language="xml"
    />
  </div>
</template>
