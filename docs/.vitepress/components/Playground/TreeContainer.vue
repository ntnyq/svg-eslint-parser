<script lang="ts" setup>
import { useSharedPlaygroundState } from '../../composables/playground'

const { astTree } = useSharedPlaygroundState()
</script>

<template>
  <div class="relative w-full h-full of-auto">
    <AstViewer :value="astTree" />
  </div>
</template>
