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
    class="cursor-pointer underline-offset-3 hover:(text-$vp-c-brand underline underline-$vp-c-brand)"
  >
    <slot>
      {{ label }}
    </slot>
  </a>
</template>
