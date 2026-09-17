<script lang="ts" setup>
import 'splitpanes/dist/splitpanes.css'
import { useMediaQuery } from '@vueuse/core'
import { Pane, Splitpanes } from 'splitpanes'

const isCompact = useMediaQuery('(max-width: 1099px)')
</script>

<template>
  <div class="page-playground-core relative flex flex-col">
    <ClientOnly>
      <ActionContainer />
      <div class="playground-workspace min-h-0 flex-1">
        <Splitpanes
          :horizontal="isCompact"
          class="default-theme"
        >
          <Pane
            :size="37"
            :min-size="isCompact ? 20 : 25"
          >
            <InputContainer />
          </Pane>
          <Pane
            :size="39"
            :min-size="isCompact ? 20 : 28"
          >
            <OutputContainer />
          </Pane>
          <Pane
            :size="24"
            :min-size="isCompact ? 20 : 22"
          >
            <InspectorContainer />
          </Pane>
        </Splitpanes>
      </div>
      <DropZone />
    </ClientOnly>
  </div>
</template>
