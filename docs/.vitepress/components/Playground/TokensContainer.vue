<script lang="ts" setup>
import { computed, shallowRef, watch } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'

const { tokens, selectRange } = useSharedPlaygroundState()
const query = shallowRef('')
const page = shallowRef(0)
const pageSize = 100
const filteredTokens = computed(() => {
  const search = query.value.trim().toLowerCase()
  return tokens.value.filter(
    token =>
      !search ||
      token.type.toLowerCase().includes(search) ||
      token.value.toLowerCase().includes(search),
  )
})
const pageCount = computed(() =>
  Math.max(1, Math.ceil(filteredTokens.value.length / pageSize)),
)
const visibleTokens = computed(() =>
  filteredTokens.value.slice(
    page.value * pageSize,
    (page.value + 1) * pageSize,
  ),
)
watch([query, tokens], () => {
  page.value = 0
})
</script>

<template>
  <div class="h-full min-h-0 flex flex-col">
    <div class="flex items-center gap-2 border-b border-$vp-c-divider p-3">
      <span
        class="i-lucide:search flex-none text-$vp-c-text-3"
        aria-hidden="true"
      />
      <input
        v-model="query"
        aria-label="Filter tokens"
        placeholder="Filter by type or value…"
        class="min-w-0 w-full rounded bg-$vp-c-bg-soft px-2 py-1 text-xs"
      />
      <span class="text-xs text-$vp-c-text-3">{{ filteredTokens.length }}</span>
    </div>
    <div class="min-h-0 flex-1 overflow-auto">
      <table
        v-if="visibleTokens.length"
        class="w-full border-collapse text-left text-xs"
      >
        <thead class="sticky top-0 bg-$vp-c-bg-soft text-$vp-c-text-2">
          <tr>
            <th class="px-3 py-2 font-medium">Type / value</th>
            <th class="px-3 py-2 text-right font-medium">Line:col</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="token in visibleTokens"
            :key="`${token.range[0]}:${token.range[1]}:${token.type}`"
            class="border-b border-$vp-c-divider"
          >
            <td class="max-w-0">
              <button
                @click="selectRange(token.range)"
                :title="`Select source range [${token.range.join(', ')}]`"
                class="w-full px-3 py-2 text-left hover:bg-$vp-c-brand-soft"
                type="button"
              >
                <span class="block text-$vp-c-brand-1">{{ token.type }}</span>
                <span class="mt-1 block truncate font-mono">{{
                  JSON.stringify(token.value)
                }}</span>
              </button>
            </td>
            <td class="w-20 px-3 py-2 text-right font-mono text-$vp-c-text-2">
              {{ token.loc.start.line }}:{{ token.loc.start.column }}
            </td>
          </tr>
        </tbody>
      </table>
      <p
        v-else
        class="p-5 text-sm text-$vp-c-text-2"
      >
        {{
          query ? 'No tokens match this filter.' : 'No tokens in this document.'
        }}
      </p>
    </div>
    <div
      class="flex items-center justify-between gap-2 border-t border-$vp-c-divider px-3 py-2 text-xs text-$vp-c-text-2"
    >
      <span>Columns start at 0</span>
      <div
        v-if="pageCount > 1"
        class="flex items-center gap-2"
      >
        <button
          @click="page--"
          :disabled="page === 0"
          class="pg-button !px-2"
          type="button"
          aria-label="Previous token page"
        >
          ‹
        </button>
        <span>{{ page + 1 }} / {{ pageCount }}</span>
        <button
          @click="page++"
          :disabled="page + 1 >= pageCount"
          class="pg-button !px-2"
          type="button"
          aria-label="Next token page"
        >
          ›
        </button>
      </div>
    </div>
  </div>
</template>
