<script lang="ts" setup>
import { useClipboard } from '@vueuse/core'
import { useSharedPlaygroundState } from '../../composables/playground'
import { OutputTab } from '../../constants'
import type { ITabItem } from '../ui/tabs'

const {
  activeOutputTab,
  parseError,
  astJson,
  ast,
  parseCost,
  errorRecovery,
  summary,
} = useSharedPlaygroundState()
const { copy, copied } = useClipboard({ legacy: true })
const outputTabOptions: ITabItem[] = [
  { name: OutputTab.Tree, title: 'Tree' },
  { name: OutputTab.Json, title: 'JSON' },
  { name: OutputTab.Tokens, title: 'Tokens' },
]
</script>

<template>
  <section
    aria-label="Parser output"
    class="relative h-full min-w-0 flex flex-col"
  >
    <div class="pg-panel-heading">
      <Tabs
        v-model="activeOutputTab"
        :options="outputTabOptions"
        aria-label="Output view"
      />
      <button
        @click="copy(astJson)"
        :disabled="!ast"
        :aria-label="copied ? 'Copied JSON' : 'Copy parser result as JSON'"
        :title="copied ? 'Copied JSON' : 'Copy parser result as JSON'"
        type="button"
        class="pg-button mr-2 !px-2"
      >
        <span
          :class="copied ? 'i-lucide:check' : 'i-lucide:copy'"
          aria-hidden="true"
        />
      </button>
    </div>
    <div
      v-if="parseError"
      class="min-h-0 flex-1 overflow-auto p-6"
    >
      <div
        class="mb-4 i-lucide:file-warning text-2xl text-$vp-c-danger-1"
        aria-hidden="true"
      />
      <h2 class="mb-2 text-sm font-semibold">Parsing stopped</h2>
      <p class="break-words text-sm text-$vp-c-text-2">{{ parseError }}</p>
      <button
        @click="errorRecovery = true"
        v-if="!errorRecovery"
        class="pg-button mt-4 bg-$vp-c-brand-soft text-$vp-c-brand-1"
        type="button"
      >
        Try error recovery
      </button>
    </div>
    <div
      v-else
      class="min-h-0 flex-1"
    >
      <JsonContainer v-if="activeOutputTab === OutputTab.Json" />
      <TreeContainer v-else-if="activeOutputTab === OutputTab.Tree" />
      <TokensContainer v-else-if="activeOutputTab === OutputTab.Tokens" />
    </div>
    <footer class="pg-panel-footer">
      <span>{{
        ast ? `${summary.nodes} document nodes` : 'No AST available'
      }}</span>
      <span>{{ parseCost.toFixed(2) }} ms</span>
    </footer>
  </section>
</template>
