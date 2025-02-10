<script lang="ts" setup>
import { useSharedPlaygroundState } from '../../composables/playground'

const { code } = useSharedPlaygroundState()
</script>

<template>
  <div class="relative h-full w-full">
    <div
      v-html="code"
      class="absolute left-1/2 top-1/2 max-h-full max-w-full -translate-1/2"
    />
  </div>
</template>
