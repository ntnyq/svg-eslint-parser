<script lang="ts" setup>
import './style.css'
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
        <PanelResizeHandle class="panel-resize-handle" />
        <Panel
          collapsible
          :min-size="12"
          :max-size="24"
          :default-size="18"
          class="panel-column"
        >
          <ActionContainer />
        </Panel>
      </PanelGroup>

      <DropZone />
    </ClientOnly>
  </div>
</template>
