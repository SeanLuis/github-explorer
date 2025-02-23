<script setup lang="ts">
import { defineProps } from 'vue'
defineProps<{
  suggestions: any,
  QUALIFIERS: Record<string, { label: string, icon: string }>,
  mode: 'inline' | 'modal',
  handleSuggestionClick: (suggestion: string) => void,
  removeQualifier: (qualifier: string, value: string) => void
}>()
</script>

<template>
  <div v-if="mode==='inline'" class="suggestions-dropdown-inline">
    <div class="px-2 py-1 text-xs text-muted-foreground font-medium">
      Available filters
    </div>
    <div
      v-for="suggestion in suggestions"
      :key="suggestion.qualifier"
      class="suggestion-item"
      :class="{ 'is-used': suggestion.isUsed }"
      @mousedown.prevent="suggestion.isUsed
        ? removeQualifier(suggestion.qualifier, suggestion.value)
        : handleSuggestionClick(suggestion.qualifier)"
    >
      <Icon
        :name="QUALIFIERS[suggestion.qualifier as keyof typeof QUALIFIERS].icon"
        class="h-3.5 w-3.5 opacity-50"
      />
      <span class="suggestion-label text-xs">
        {{ QUALIFIERS[suggestion.qualifier as keyof typeof QUALIFIERS].label }}
      </span>
      <div class="ml-auto flex items-center gap-2">
        <span v-if="suggestion.isUsed" class="text-xs text-muted-foreground">
          {{ suggestion.value }}
        </span>
        <span class="text-xs text-muted-foreground">
          {{ suggestion.qualifier }}
        </span>
        <Icon
          v-if="suggestion.isUsed"
          name="octicon:x-16"
          class="h-3.5 w-3.5 opacity-50"
        />
      </div>
    </div>
  </div>

  <div v-else class="mt-2">
    <div class="px-2 mb-2 text-xs text-muted-foreground font-medium">
      Available filters
    </div>
    <div
      v-for="suggestion in suggestions"
      :key="suggestion.qualifier"
      class="suggestion-item"
      :class="{ 'is-used': suggestion.isUsed }"
      @mousedown.prevent="suggestion.isUsed
        ? removeQualifier(suggestion.qualifier, suggestion.value)
        : handleSuggestionClick(suggestion.qualifier)"
    >
      <Icon
        :name="QUALIFIERS[suggestion.qualifier as keyof typeof QUALIFIERS].icon"
        class="h-3.5 w-3.5 opacity-50"
      />
      <span class="suggestion-label text-xs">
        {{ QUALIFIERS[suggestion.qualifier as keyof typeof QUALIFIERS].label }}
      </span>
      <div class="ml-auto flex items-center gap-2">
        <span v-if="suggestion.isUsed" class="text-xs text-muted-foreground">
          {{ suggestion.value }}
        </span>
        <span class="text-xs text-muted-foreground">
          {{ suggestion.qualifier }}
        </span>
        <Icon
          v-if="suggestion.isUsed"
          name="octicon:x-16"
          class="h-3.5 w-3.5 opacity-50"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.suggestions-dropdown-inline {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
              0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 50;
  padding: 0.5rem 0;
  max-height: 16rem;
  overflow-y: auto;
}

.suggestion-item {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
  font-size: 0.75rem;
  line-height: 1rem;
}

.suggestion-item:hover {
  background-color: hsl(var(--accent));
}

.suggestion-item.is-used {
  background-color: hsl(var(--muted)/0.1);
}

.suggestion-item.is-used:hover {
  background-color: hsl(var(--destructive)/0.1);
  color: hsl(var(--destructive));
}

.suggestion-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-badge-mini {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
  padding: 0 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
}
</style>
