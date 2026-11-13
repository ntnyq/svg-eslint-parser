<script setup lang="ts">
import { shallowRef } from 'vue'
import PropertyLink from '../components/ast/PropertyLink.vue'
import Editor from '../components/Editor/index.vue'
import TabItem from '../components/ui/TabItem.vue'
import Tabs from '../components/ui/Tabs.vue'
import { InputTab, OutputTab } from '../constants'
import type { TabOption } from '../components/ui/tabOption'

const activeTab = shallowRef(InputTab.Code)
const invalidTab = shallowRef(123)
const options: TabOption<InputTab>[] = [
  { name: InputTab.Code, title: 'Source' },
  { name: InputTab.Preview, title: 'Preview' },
]
const outputOptions: TabOption<OutputTab>[] = [
  { name: OutputTab.Json, title: 'JSON' },
]

function handleTabChange(name: InputTab) {
  activeTab.value = name
}

function handleMouse(event: MouseEvent) {
  event.preventDefault()
}

function handleKeyboard(event: KeyboardEvent) {
  event.preventDefault()
}
</script>

<template>
  <Tabs
    @change="handleTabChange"
    v-model="activeTab"
    :options
    label="Input view"
  />
  <TabItem
    @click="handleMouse"
    :item="options[0]"
  />
  <PropertyLink
    @click="handleMouse"
    @keydown="handleKeyboard"
    :tabindex="0"
  >
    Inspect
  </PropertyLink>
  <Editor
    model-value="<svg />"
    language="xml"
  />

  <!-- @vue-expect-error Tabs require a model so they cannot emit undefined. -->
  <Tabs :options />
  <!-- @vue-expect-error Tab models must use the string option names. -->
  <Tabs
    v-model="invalidTab"
    :options
  />
  <!-- @vue-expect-error Input and output tab enums must not be mixed. -->
  <Tabs
    v-model="activeTab"
    :options="outputOptions"
  />
  <!-- @vue-expect-error Click listeners receive mouse events. -->
  <PropertyLink @click="handleKeyboard" />
  <!-- @vue-expect-error Tab buttons also forward mouse events. -->
  <TabItem
    @click="handleKeyboard"
    :item="options[0]"
  />
  <!-- @vue-expect-error Editor language names are a closed union. -->
  <Editor language="unsupported" />
</template>
