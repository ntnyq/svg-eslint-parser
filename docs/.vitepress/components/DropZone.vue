<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useSharedPlaygroundState } from '../composables/playground'

const { setCode } = useSharedPlaygroundState()

const isDragging = ref(false)

let dragCounter = 0

function isFileDrag(evt: DragEvent) {
  return evt.dataTransfer?.types && evt.dataTransfer.types.includes('Files')
}
function onDragEnter(evt: DragEvent) {
  evt.preventDefault()

  if (!isFileDrag(evt)) {
    return
  }

  dragCounter++
  isDragging.value = true
}
function onDragLeave(evt: DragEvent) {
  evt.preventDefault()
  if (!isFileDrag(evt)) {
    return
  }

  dragCounter--

  if (dragCounter <= 0) {
    isDragging.value = false
  }
}
function onDragOver(evt: DragEvent) {
  evt.preventDefault()
}
async function onImportFile(files?: FileList | null) {
  if (!files) return

  const file = files[0]
  const fileExt = file.name.split('.').pop()?.toLowerCase()
  const fileContent = await file.text()

  if (fileExt !== 'svg') {
    return console.log(`Expected SVG file, but got ${fileExt}`)
  }

  if (!fileContent.trim().length) {
    return console.log('Empty SVG file')
  }

  setCode(fileContent)
}
async function onDrop(evt: DragEvent) {
  evt.preventDefault()
  if (!isFileDrag(evt)) {
    return
  }

  isDragging.value = false
  dragCounter = 0

  await onImportFile(evt.dataTransfer?.files)
}

onMounted(() => {
  useEventListener('dragenter', onDragEnter)
  useEventListener('dragleave', onDragLeave)
  useEventListener('dragover', onDragOver)
  useEventListener('drop', onDrop)
})
</script>

<template>
  <div
    v-if="isDragging"
    class="z-dropzone pointer-events-auto fixed inset-0 p-10 backdrop-blur-5"
  >
    <div
      class="border-dashed- border-base h-full w-full flex flex-col items-center justify-center border-3 rounded-2xl bg-white/50 dark:bg-black:50"
    >
      <p class="text-xl">Drop SVG file here</p>
    </div>
  </div>
</template>
