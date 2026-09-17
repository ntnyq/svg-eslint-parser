<script lang="ts" setup>
import { computed } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'

const { ast, summary, tokens, selectRange } = useSharedPlaygroundState()
const metrics = computed(() => [
  { label: 'Elements', value: summary.value.elements.length },
  { label: 'Attributes', value: summary.value.attributes },
  { label: 'Tokens', value: tokens.value.length },
  { label: 'Comments', value: summary.value.comments },
  { label: 'Max depth', value: summary.value.maxDepth },
  { label: 'AST nodes', value: summary.value.nodes },
])
const visibleElements = computed(() => summary.value.elements.slice(0, 100))
</script>

<template>
  <aside
    aria-label="Document inspector"
    class="h-full min-w-0 flex flex-col"
  >
    <div class="pg-panel-heading px-4">
      <h2 class="text-sm font-semibold">Inspector</h2>
      <span
        class="i-lucide:sliders-horizontal text-$vp-c-text-3"
        aria-hidden="true"
      />
    </div>
    <div class="min-h-0 flex-1 overflow-auto">
      <div class="h-36 border-b border-$vp-c-divider"><PreviewContainer /></div>
      <DiagnosticsContainer />
      <section
        class="border-b border-$vp-c-divider px-4 py-3"
        aria-label="Document statistics"
      >
        <dl class="grid grid-cols-3 gap-x-3 gap-y-3">
          <div
            v-for="metric in metrics"
            :key="metric.label"
          >
            <dd class="text-lg font-semibold leading-tight tabular-nums">
              {{ ast ? metric.value.toLocaleString() : '—' }}
            </dd>
            <dt class="mt-1 text-xs text-$vp-c-text-2">{{ metric.label }}</dt>
          </div>
        </dl>
      </section>
      <section class="border-b border-$vp-c-divider px-4 py-3">
        <h3 class="mb-2 text-xs font-semibold">Root attributes</h3>
        <dl
          v-if="summary.rootAttributes.length"
          class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-xs"
        >
          <template
            v-for="(attribute, index) in summary.rootAttributes"
            :key="index"
          >
            <dt class="text-$vp-c-text-2">{{ attribute.name }}</dt>
            <dd class="break-words font-mono">
              {{ attribute.value || '(empty)' }}
            </dd>
          </template>
        </dl>
        <p
          v-else
          class="text-xs text-$vp-c-text-3"
        >
          {{
            ast
              ? 'The root has no attributes.'
              : 'Parse the source to inspect attributes.'
          }}
        </p>
      </section>
      <section class="py-3">
        <div class="mb-2 flex items-center justify-between px-4">
          <h3 class="text-xs font-semibold">Elements</h3>
          <span class="text-xs text-$vp-c-text-3">Click to locate</span>
        </div>
        <button
          @click="selectRange(node.range)"
          v-for="{ node, depth } in visibleElements"
          :key="node.range[0]"
          :title="`Select <${node.name}> at line ${node.loc.start.line}`"
          type="button"
          class="w-full flex items-center gap-2 px-4 py-1.5 text-left text-xs hover:bg-$vp-c-brand-soft"
        >
          <span
            :style="{ paddingLeft: `${Math.min(depth, 8) * 12}px` }"
            class="min-w-0 flex-1 truncate font-mono text-$vp-c-brand-1"
            >&lt;{{ node.name }}&gt;</span
          >
          <span class="flex-none text-$vp-c-text-3"
            >L{{ node.loc.start.line }}</span
          >
        </button>
        <p
          v-if="!visibleElements.length"
          class="px-4 text-xs text-$vp-c-text-3"
        >
          No elements to inspect.
        </p>
        <p
          v-if="summary.elements.length > visibleElements.length"
          class="mt-2 px-4 text-xs text-$vp-c-text-3"
        >
          Showing the first 100 elements. Use the AST for the full document.
        </p>
      </section>
    </div>
  </aside>
</template>
