<script lang="ts" setup>
import { useSharedPlaygroundState } from '../../composables/playground'

const { astTree } = useSharedPlaygroundState()
</script>

<template>
  <div class="relative w-full h-full flex-center">
    <h1 class="text-3xl op-70 font-semibold">Todo</h1>
    <p v-if="astTree">{{ astTree }}</p>
  </div>
</template>
