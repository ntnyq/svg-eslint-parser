<script lang="ts" setup>
import { useObjectUrl } from '@vueuse/core'
import { computed } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'

const { code } = useSharedPlaygroundState()
const previewSource = useObjectUrl(
  computed(() => new Blob([code.value], { type: 'image/svg+xml' })),
)
</script>

<template>
  <div class="relative h-full w-full">
    <img
      :src="previewSource"
      alt="SVG preview"
      class="absolute left-1/2 top-1/2 max-h-full max-w-full -translate-1/2"
    />
  </div>
</template>
