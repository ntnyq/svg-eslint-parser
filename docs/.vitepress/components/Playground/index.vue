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
          class="panel-column"
          collapsible
        >
          <InputContainer />
        </Panel>
        <PanelResizeHandle class="panel-resize-handle" />
        <Panel
          class="panel-column"
          collapsible
        >
          <OutputContainer />
        </Panel>
        <PanelResizeHandle class="panel-resize-handle" />
        <Panel
          :min-size="12"
          :max-size="24"
          :default-size="18"
          class="panel-column"
          collapsible
        >
          <ActionContainer />
        </Panel>
      </PanelGroup>

      <DropZone />
    </ClientOnly>
  </div>
</template>
