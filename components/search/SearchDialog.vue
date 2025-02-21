<script setup lang="ts">
import type { QualifierSuggestion } from './types'

defineProps<{
  modelValue: string
  suggestions: QualifierSuggestion[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'close'): void
  (e: 'search'): void
}>()
</script>

<template>
  <div 
    class="search-overlay"
    @click="emit('close')"
  >
    <div 
      class="search-dialog"
      @click.stop
    >
      <div class="search-dialog-content">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Search repositories</h2>
          <button 
            class="p-1 rounded-md hover:bg-accent"
            @click="emit('close')"
          >
            <Icon name="octicon:x-16" class="h-4 w-4" />
          </button>
        </div>

        <!-- Search input -->
        <div class="relative mb-4">
          <slot name="search-input"></slot>
        </div>

        <!-- Suggestions -->
        <div class="suggestions-container">
          <SearchSuggestions
            :suggestions="suggestions"
            mode="modal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6rem;
}

.search-dialog {
  width: 100%;
  max-width: 640px;
  margin: 0 1rem;
  animation: dialog-enter 0.2s ease-out;
}

.search-dialog-content {
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.suggestions-container {
  max-height: calc(100vh - 20rem);
  overflow-y: auto;
  margin: 0 -1.25rem;
  padding: 0 1.25rem;
  border-top: 1px solid hsl(var(--border));
  padding-top: 1rem;
}

@keyframes dialog-enter {
  from {
    opacity: 0;
    transform: translateY(-1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
