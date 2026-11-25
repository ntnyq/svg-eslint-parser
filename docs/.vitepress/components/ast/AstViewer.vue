<script lang="ts" setup>
import './style.css'

interface Props {
  /**
   * Hide the button that copies the displayed value as JSON.
   */
  hideCopyButton?: boolean
  /**
   * Include parser tokens in the object tree.
   */
  showTokens?: boolean
  /**
   * Parsed value displayed by the tree renderer.
   */
  value: unknown
}

withDefaults(defineProps<Props>(), {
  showTokens: true,
})
</script>

<template>
  <div class="ast-list">
    <DataRender
      :value
      :show-tokens
      level="ast"
      last-element
    />

    <CopyButton
      v-if="!hideCopyButton"
      :value
    />
  </div>
</template>
