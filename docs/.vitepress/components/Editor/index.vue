<script lang="ts" setup>
import { useData } from 'vitepress/client'
import { computed, shallowRef, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { languages } from './language'
import { githubDark, githubLight } from './theme'
import type { Extension } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import type { SupportedLanguage } from './language'

interface Props {
  language?: SupportedLanguage
  extensions?: Extension[]
  placeholder?: string
  disabled?: boolean
  tabSize?: number
  indentWithTab?: boolean
  selection?: [number, number]
}

const props = withDefaults(defineProps<Props>(), {
  extensions: () => [],
  placeholder: '',
  disabled: false,
  tabSize: 2,
  indentWithTab: true,
})
const code = defineModel<string>()

const { isDark } = useData()
const editorView = shallowRef<EditorView>()

function selectSource() {
  const view = editorView.value
  if (!view || !props.selection) {
    return
  }
  const [start, end] = props.selection
  view.dispatch({
    selection: {
      anchor: Math.max(0, Math.min(start, view.state.doc.length)),
      head: Math.max(0, Math.min(end, view.state.doc.length)),
    },
    scrollIntoView: true,
  })
  view.focus()
}

function handleReady({ view }: { view: EditorView }) {
  editorView.value = view
  selectSource()
}

watch(() => props.selection, selectSource, { flush: 'post' })

const resolvedExtensions = computed(() => {
  const extentions: Extension[] = [
    // External extension
    ...props.extensions,
    // Theme extension
    isDark.value ? githubDark : githubLight,
  ]
  const matchedLanguage = languages.find(lang => lang.id === props.language)

  // Language extension
  if (props.language && matchedLanguage) {
    extentions.push(matchedLanguage.extension())
  }

  return extentions
})
</script>

<template>
  <div class="relative h-full min-w-0 flex-1">
    <Codemirror
      @ready="handleReady"
      v-model="code"
      :extensions="resolvedExtensions"
      :tab-size
      :placeholder
      :autofocus="!disabled"
      :disabled
      :indent-with-tab
    />
  </div>
</template>
