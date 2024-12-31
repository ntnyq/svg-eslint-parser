<script lang="ts" setup>
import { useSharedPlaygroundState } from '../../composables/playground'

const { code } = useSharedPlaygroundState()
</script>

<template>
  <div class="relative w-full h-full">
    <Editor
      v-model="code"
      language="xml"
    />
  </div>
</template>
