<script lang="ts" setup>
import { useSharedPlaygroundState } from '../../composables/usePlaygroundState'

const { parseResultJson } = useSharedPlaygroundState()
</script>

<template>
  <div class="relative h-full w-full">
    <Editor
      :model-value="parseResultJson"
      language="json"
      disabled
    />
  </div>
</template>
