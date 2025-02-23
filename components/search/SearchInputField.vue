<script setup lang="ts">
import { ref, type ComputedRef } from 'vue'

// Actualizar los tipos de props
defineProps<{
  searchValue: string,
  highlightedHTML: ComputedRef<string> | string,
  handleInput: (e: Event) => void,
  handleFocus: () => void,
  handleBlur: (e: FocusEvent) => void,
  handleKeyDown: (e: KeyboardEvent) => void,
  handleInputScroll: (e: Event) => void,
  input: any
}>()
</script>

<template>
  <!-- Contenedor del input, se reutiliza tanto en inline como en modal -->
  <div class="relative w-full">
    <div 
      class="h-9 relative flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200"
      @click="handleFocus"
    >
      <Icon name="octicon:search-16" class="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <div class="relative flex-1">
        <div 
          aria-hidden="true"
          class="search-input-mirror absolute inset-0 pointer-events-none flex items-center overflow-hidden"
        >
          <span v-html="typeof highlightedHTML === 'string' ? highlightedHTML : highlightedHTML.value"></span>
          <!-- Cambiar la condición del cursor -->
          <span v-if="searchValue" class="typing-cursor"></span>
        </div>
        <input
          ref="input"
          :value="searchValue"
          type="text"
          class="search-input w-full relative"
          :class="{ 'has-content': searchValue, 'text-transparent': searchValue }"
          placeholder="Press / to search repositories..."
          @input="handleInput"
          @keydown="handleKeyDown"
          @focus="handleFocus"
          @blur="handleBlur"
          @scroll="handleInputScroll"
        />
      </div>
      <kbd 
        class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
      >
        <span class="text-xs">/</span>
      </kbd>
    </div>
  </div>
</template>

<style scoped>
/* Mantener estilos del input y mirror */
.search-input-mirror {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: pre;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.search-input {
  caret-color: transparent !important;
  width: 100%;
  background: transparent;
  outline: none;
  color: transparent;
  position: relative;
  white-space: pre;
  padding: inherit;
}
.search-input.has-content {
  -webkit-text-fill-color: transparent;
}
.search-input::placeholder {
  -webkit-text-fill-color: initial;
  color: hsl(var(--muted-foreground));
}
.search-input:focus {
  caret-color: currentColor;
}
.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: currentColor;
  margin-left: 1px;
  animation: blink 1s step-end infinite;
  position: relative;
  top: 1px;
}
@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
/* Token highlighting styles */
:deep(.search-token-qualifier) {
  color: #0969da;
  font-weight: 500;
  white-space: pre;
}
:deep(.search-token-value) {
  display: inline-flex;
  align-items: center;
  background-color: #ddf4ff;
  color: #0969da;
  border-radius: 3px;
  padding: 0 4px;
  margin: 0 1px;
  font-weight: 500;
  white-space: pre;
}
/* Dark mode styles */
:root[class~="dark"] :deep(.search-token-qualifier),
:root[class~="dark"] :deep(.search-token-value) {
  color: #2f81f7;
}
:root[class~="dark"] :deep(.search-token-value) {
  background-color: #1a384d;
}
</style>
