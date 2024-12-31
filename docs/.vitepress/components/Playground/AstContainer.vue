<script lang="ts" setup>
import { useSharedPlaygroundState } from '../../composables/playground'

const { astJson } = useSharedPlaygroundState()
</script>

<template>
  <div class="relative w-full h-full">
    <Editor
      :model-value="astJson"
      language="json"
      disabled
    />
  </div>
</template>
