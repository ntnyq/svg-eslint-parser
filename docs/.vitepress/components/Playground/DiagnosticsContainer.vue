<script lang="ts" setup>
import { computed } from 'vue'
import { useSharedPlaygroundState } from '../../composables/playground'

const { parseError, errorRange, diagnostics, errorRecovery, selectRange } =
  useSharedPlaygroundState()
const hasDiagnostics = computed(() =>
  Boolean(parseError.value || diagnostics.value.length),
)
</script>

<template>
  <section
    aria-label="Parser diagnostics"
    class="border-b border-$vp-c-divider px-4 py-3"
  >
    <div
      class="flex items-center justify-between gap-2 text-xs"
      role="status"
    >
      <span
        :class="hasDiagnostics ? 'text-$vp-c-warning-1' : 'text-$vp-c-tip-1'"
        class="flex items-center gap-2 font-medium"
      >
        <span
          :class="
            hasDiagnostics ? 'i-lucide:circle-alert' : 'i-lucide:circle-check'
          "
          aria-hidden="true"
        />
        {{
          parseError
            ? 'Parse failed'
            : diagnostics.length
              ? `${diagnostics.length} diagnostics`
              : 'Parsed successfully'
        }}
      </span>
      <span class="text-$vp-c-text-3">{{
        errorRecovery ? 'Recovery' : 'Strict'
      }}</span>
    </div>
    <p
      v-if="!hasDiagnostics"
      class="mt-1.5 text-xs text-$vp-c-text-2"
    >
      No parser errors or warnings.
    </p>
    <div
      v-if="parseError"
      role="alert"
      class="mt-3 break-words text-xs text-$vp-c-danger-1"
    >
      {{ parseError }}
      <button
        @click="selectRange(errorRange)"
        v-if="errorRange"
        type="button"
        class="mt-2 block underline underline-offset-3"
      >
        Locate in source
      </button>
    </div>
    <ul
      v-else-if="diagnostics.length"
      class="mt-3 max-h-56 space-y-2 overflow-auto"
    >
      <li
        v-for="(diagnostic, index) in diagnostics"
        :key="index"
      >
        <button
          @click="selectRange(diagnostic.range)"
          type="button"
          class="w-full rounded bg-$vp-c-bg-soft p-2 text-left text-xs hover:bg-$vp-c-brand-soft"
        >
          <span
            :class="
              diagnostic.severity === 'Error'
                ? 'text-$vp-c-danger-1'
                : 'text-$vp-c-warning-1'
            "
            class="block font-medium"
            >{{ diagnostic.severity }} · {{ diagnostic.loc.start.line }}:{{
              diagnostic.loc.start.column
            }}</span
          >
          <span class="mt-1 block break-words">{{ diagnostic.message }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>
