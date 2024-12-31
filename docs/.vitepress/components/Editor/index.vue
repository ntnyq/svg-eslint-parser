<script lang="ts" setup>
import { computed } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { useData } from 'vitepress/client'
import { githubDark, githubLight } from './theme'
import { languages, type SupportLanguage } from './language'
import type { Extension } from '@codemirror/state'

const props = withDefaults(
  defineProps<{
    language?: SupportLanguage
    extensions?: Extension[]
    placeholder?: string
    disabled?: boolean
    tabSize?: number
    indentWithTab?: boolean
  }>(),
  {
    extensions: () => [],
    placeholder: '',
    disabled: false,
    tabSize: 2,
    indentWithTab: true,
  },
)
const code = defineModel<string>()

const { isDark } = useData()

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
      v-model="code"
      :extensions="resolvedExtensions"
      :tab-size="tabSize"
      :placeholder="placeholder"
      :autofocus="!disabled"
      :disabled="disabled"
      :indent-with-tab="indentWithTab"
    />
  </div>
</template>
