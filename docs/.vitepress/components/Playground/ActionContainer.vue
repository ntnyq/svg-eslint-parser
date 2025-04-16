<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
import { VPButton } from 'vitepress/theme'
import { useSharedPlaygroundState } from '../../composables/playground'

const {
  open: openFileDialog,
  reset: resetSelectedFiles,
  onChange: handleFileDialogChange,
} = useFileDialog({
  multiple: false,
  accept: '.svg',
})

const { parseCost, setCode, resetPlayground } = useSharedPlaygroundState()

handleFileDialogChange(files => {
  if (!files?.length) {
    return
  }
  tryLoadFile(files[0])
})

function tryLoadFile(file: File) {
  const reader = new FileReader()

  reader.addEventListener('load', (event: ProgressEvent<FileReader>) => {
    const content = event.target?.result ?? ''

    if (typeof content !== 'string') {
      return
    }

    setCode(content)
    resetSelectedFiles()
  })

  reader.readAsText(file)
}
</script>

<template>
  <div class="relative h-full w-full flex flex-col justify-between py-4">
    <div class="relative w-full p-4">
      <p class="flex items-center justify-between text-lg font-medium">
        <span>ParseCostTime:</span>
        <span>{{ +parseCost.toFixed(2) }} ms</span>
      </p>
    </div>
    <div class="relative flex flex-wrap items-center justify-around gap-4 p-4">
      <VPButton
        @click="openFileDialog"
        theme="brand"
        text="Upload SVG"
      />
      <VPButton
        @click="resetPlayground"
        theme="alt"
        text="Reset Playground"
      />
    </div>
  </div>
</template>
