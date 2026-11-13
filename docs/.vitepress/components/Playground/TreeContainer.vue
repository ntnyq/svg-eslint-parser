<script lang="ts" setup>
import { useSharedPlaygroundState } from '../../composables/usePlaygroundState'

const { program } = useSharedPlaygroundState()
</script>

<template>
  <div class="relative h-full w-full of-auto">
    <AstViewer :value="program" />
  </div>
</template>
