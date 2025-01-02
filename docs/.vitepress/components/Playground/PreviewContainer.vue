<script lang="ts" setup>
import { useSharedPlaygroundState } from '../../composables/playground'

const { code } = useSharedPlaygroundState()
</script>

<template>
  <div class="relative w-full h-full">
    <div
      class="max-w-full max-h-full absolute left-1/2 top-1/2 -translate-1/2"
      v-html="code"
    />
  </div>
</template>
