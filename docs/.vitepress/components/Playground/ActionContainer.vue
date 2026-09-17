<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
import { shallowRef } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'

const {
  open: openFileDialog,
  reset: resetSelectedFiles,
  onChange: handleFileDialogChange,
} = useFileDialog({ multiple: false, accept: '.svg' })
const { setCode, resetPlayground, errorRecovery } = useSharedPlaygroundState()
const importError = shallowRef('')

async function tryLoadFile(file: File) {
  importError.value = ''
  try {
    setCode(await file.text())
  } catch {
    importError.value = 'Could not read this SVG. Try opening the file again.'
  } finally {
    resetSelectedFiles()
  }
}

handleFileDialogChange(files => {
  if (files?.length) {
    tryLoadFile(files[0])
  }
})
</script>

<template>
  <header
    class="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-$vp-c-divider px-5 py-3"
  >
    <div class="flex items-center gap-3">
      <span
        class="i-lucide:scan-code text-xl text-$vp-c-brand-1"
        aria-hidden="true"
      />
      <h1 class="text-base font-semibold">Parser playground</h1>
      <span class="hidden text-xs text-$vp-c-text-2 xl:block"
        >Explore SVG, inspect the AST.</span
      >
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <label
        class="flex cursor-pointer items-center gap-2 text-xs"
        title="Return an AST with diagnostics when the source contains errors"
      >
        <input
          v-model="errorRecovery"
          type="checkbox"
          class="accent-$vp-c-brand-1"
        />
        Error recovery
      </label>
      <span
        class="h-5 border-l border-$vp-c-divider"
        aria-hidden="true"
      />
      <button
        @click="resetPlayground"
        type="button"
        class="pg-button"
      >
        <span
          class="i-lucide:rotate-ccw"
          aria-hidden="true"
        />
        Reset
      </button>
      <button
        @click="openFileDialog"
        type="button"
        class="pg-button bg-$vp-c-brand-soft text-$vp-c-brand-1"
      >
        <span
          class="i-lucide:upload"
          aria-hidden="true"
        />
        Upload SVG
      </button>
    </div>
    <p
      v-if="importError"
      role="alert"
      class="w-full text-sm text-$vp-c-danger-1"
    >
      {{ importError }}
    </p>
  </header>
</template>
