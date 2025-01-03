<script lang="ts" setup>
defineProps<{
  href?: string
  label?: string
}>()
</script>

<template>
  <a
    :href="href"
    :aria-label="label"
    role="button"
    class="hover:(underline text-$vp-c-brand underline-$vp-c-brand) underline-offset-3 cursor-pointer"
  >
    <slot>
      {{ label }}
    </slot>
  </a>
</template>
