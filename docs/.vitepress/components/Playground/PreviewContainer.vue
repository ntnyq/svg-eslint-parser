<script lang="ts" setup>
import { useObjectUrl } from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'

const { code } = useSharedPlaygroundState()
const hasPreviewError = shallowRef(false)
const previewSource = useObjectUrl(
  computed(() => new Blob([code.value], { type: 'image/svg+xml' })),
)
watch(previewSource, () => {
  hasPreviewError.value = false
})
</script>

<template>
  <div
    class="pg-preview relative h-full w-full flex-center overflow-hidden p-5"
  >
    <p
      v-if="!code.trim()"
      class="text-center text-xs text-$vp-c-text-2"
    >
      Enter SVG source to see a preview.
    </p>
    <p
      v-else-if="hasPreviewError"
      class="max-w-60 text-center text-xs text-$vp-c-text-2"
    >
      Preview unavailable. Check that the source is valid SVG with an SVG
      namespace.
    </p>
    <img
      @error="hasPreviewError = true"
      v-else
      :src="previewSource"
      alt="SVG preview"
      class="max-h-full max-w-full object-contain"
    />
  </div>
</template>
