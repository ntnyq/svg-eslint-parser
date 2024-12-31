<script lang="ts" setup>
import './style.css'
import OutputContainer from './OutputContainer.vue'
import { Panel, PanelGroup, PanelResizeHandle } from 'vue-resizable-panels'
</script>

<template>
  <div class="page-playground-core relative px-4">
    <ClientOnly>
      <PanelGroup
        direction="horizontal"
        class="panel-group"
      >
        <Panel
          collapsible
          class="panel-column"
        >
          <InputContainer />
        </Panel>
        <PanelResizeHandle class="panel-resize-handle" />
        <Panel
          collapsible
          class="panel-column"
        >
          <OutputContainer />
        </Panel>
      </PanelGroup>
    </ClientOnly>
  </div>
</template>
