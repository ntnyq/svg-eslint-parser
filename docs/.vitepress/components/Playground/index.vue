<script lang="ts" setup>
import './style.css'
import 'splitpanes/dist/splitpanes.css'
import { Pane, Splitpanes } from 'splitpanes'
</script>

<template>
  <div class="page-playground-core relative px-4">
    <ClientOnly>
      <Splitpanes class="default-theme">
        <Pane :min-size="30">
          <InputContainer />
        </Pane>
        <Pane :min-size="30">
          <OutputContainer />
        </Pane>
        <Pane
          :min-size="12"
          :max-size="24"
          :size="18"
        >
          <ActionContainer />
        </Pane>
      </Splitpanes>
      <DropZone />
    </ClientOnly>
  </div>
</template>
