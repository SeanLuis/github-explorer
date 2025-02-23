<script setup lang="ts">
import { watch, computed } from 'vue'
import { useQualifiers } from './composables/useQualifiers'
import { useSearchParser } from './composables/useSearchParser'
import { useScrollLock } from './composables/useScrollLock'
import { useSearchInput } from './composables/useSearchInput'
import { useSearchInteractions } from './composables/useSearchInteractions'
import { useSearchHighlighter } from './composables/useSearchHighlighter'  // Nuevo: importar highlighter

const props = defineProps<{
  modelValue: string
  mode?: 'inline' | 'modal'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

// 1. Primero inicializamos los composables base
const { QUALIFIERS } = useQualifiers()
const { parseSearchTokens, colorText } = useSearchParser()
const { lockScroll, unlockScroll } = useScrollLock()

// 1. Crear una función handleFocus que usaremos más tarde
const handleFocusWrapper = () => {
  searchInteractions.handleFocus()
}

// 2. Inicializar useSearchInput primero, pasando la función wrapper
const searchInput = useSearchInput(handleFocusWrapper)

// 3. Inicializar useSearchInteractions después
const searchInteractions = useSearchInteractions(
  props,
  emit,
  searchInput.input,
  searchInput.updateCursorPosition,
  lockScroll,
  unlockScroll
)

// 4. Desestructurar los valores que necesitamos de ambos composables
const {
  input,
  cursorPosition,
  searchContainer,
  isInputFocused,
  handleInputScroll
} = searchInput

const {
  searchInput: searchValue,
  showSuggestions,
  isInlineMode,
  searchTokens,
  isExpanded,
  handleInput,
  handleFocus,
  handleBlur,
  handleClose,
  handleKeyDown,
  handleSuggestionClick,
  removeQualifier
} = searchInteractions

// Nuevo: usar el highlighter que devuelve un string HTML
const { highlightText } = useSearchHighlighter()
const highlightedHTML = computed(() => highlightText(searchValue.value))

// Nuevo: agregar computed property 'suggestions'
const suggestions = computed(() => {
  const usedQualifiers = searchTokens.value
    .filter(token => token.type === 'qualifier')
    .map(token => ({
      qualifier: token.qualifier + ':',
      value: token.value
    }))
  return Object.keys(QUALIFIERS).map(qualifier => ({
    qualifier,
    isUsed: usedQualifiers.some(used => used.qualifier === qualifier),
    value: usedQualifiers.find(used => used.qualifier === qualifier)?.value
  }))
})

// Eliminar o comentar el uso anterior de coloredParts
// const coloredParts = computed(() => colorText(searchValue.value))

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchValue.value) {
    searchValue.value = newValue
  }
})
</script>

<template>
  <div class="relative w-full">
    <!-- Normal search input -->
    <div 
      ref="searchContainer"
      class="relative w-full cursor-pointer"
      :class="{ 'search-active': isExpanded }"
      @click="handleFocus" 
    >
      <div 
        class="h-9 relative flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200"
        :class="{ 
          'ring-2 ring-ring ring-offset-2': showSuggestions,
          'search-input-expanded': isExpanded 
        }"
      >
        <Icon 
          name="octicon:search-16"
          class="mr-2 h-4 w-4 shrink-0 opacity-50"
        />
        
        <!-- Simplificar el contenedor del input -->
        <div class="relative flex-1">
          <!-- Nuevo: colored preview usando v-html -->
          <div 
            aria-hidden="true"
            class="search-input-mirror absolute inset-0 pointer-events-none flex items-center overflow-hidden"
          >
            <span v-html="highlightedHTML"></span>
            <span 
              v-if="isInputFocused && searchValue" 
              class="typing-cursor"
            ></span>
          </div>

          <input
            ref="input"
            :value="searchValue"
            type="text"
            class="search-input w-full relative"
            :class="{ 
              'has-content': searchValue,
              'text-transparent': searchValue
            }"
            placeholder="Press / to search repositories..."
            @input="handleInput"
            @keydown="handleKeyDown"
            @focus="handleFocus"
            @blur="handleBlur"
            @scroll="handleInputScroll"
          />
        </div>

        <kbd 
          v-if="!showSuggestions"
          class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
        >
          <span class="text-xs">/</span>
        </kbd>
      </div>

      <!-- Inline suggestions dropdown -->
      <div
        v-if="isInlineMode && showSuggestions && suggestions?.length > 0"
        class="suggestions-dropdown-inline"
      >
        <div class="px-2 py-1 text-xs text-muted-foreground font-medium">
          Available filters
        </div>
        <div 
          v-for="suggestion in suggestions"
          :key="suggestion.qualifier"
          class="suggestion-item"
          :class="{ 'is-used': suggestion.isUsed }"
          @mousedown.prevent="suggestion.isUsed ? 
            removeQualifier(suggestion.qualifier, suggestion.value!) : 
            handleSuggestionClick(suggestion.qualifier)"
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
    </div>

    <!-- Modal overlay (solo se muestra en modo modal) -->
    <Transition name="search-overlay">
      <div 
        v-if="!isInlineMode && isExpanded" 
        class="search-overlay"
        @click.self="handleClose"
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
                type="button"
                @click.stop="handleClose"
              >
                <Icon name="octicon:x-16" class="h-4 w-4" />
              </button>
            </div>
            
            <!-- Search input when expanded -->
            <div class="relative flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <Icon 
                name="octicon:search-16"
                class="mr-2 h-4 w-4 shrink-0 opacity-50"
              />
              
              <div class="relative flex-1">
                <!-- Nuevo: Use v-html for highlighted HTML instead of coloredParts -->
                <div 
                  aria-hidden="true"
                  class="search-input-mirror absolute inset-0 pointer-events-none flex items-center whitespace-pre overflow-x-auto"
                >
                  <span v-html="highlightedHTML"></span>
                  <span v-if="isInputFocused" class="typing-cursor"></span>
                </div>

                <input
                  ref="input"
                  :value="searchValue"
                  type="text"
                  class="search-input w-full bg-transparent outline-none relative"
                  :class="{ 'text-transparent': searchValue }"
                  placeholder="Press / to search repositories..."
                  @input="handleInput"
                  @keydown="handleKeyDown"
                  @scroll="handleInputScroll"
                />
              </div>
            </div>

            <!-- Suggestions in dialog -->
            <div v-if="suggestions?.length > 0" class="mt-2">
              <div class="px-2 mb-2 text-xs text-muted-foreground font-medium">
                Available filters
              </div>
              <div 
                v-for="suggestion in suggestions"
                :key="suggestion.qualifier"
                class="suggestion-item"
                :class="{ 'is-used': suggestion.isUsed }"
                @mousedown.prevent="suggestion.isUsed ? 
                  removeQualifier(suggestion.qualifier, suggestion.value!) : 
                  handleSuggestionClick(suggestion.qualifier)"
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
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.suggestions-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 50;
  padding: 0.5rem 0;
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
  background-color: hsl(var(--muted)/0.2);
}

.suggestion-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ...rest of existing styles... */
.text-transparent {
  -webkit-text-fill-color: currentColor;
}

.typing-cursor {
  display: inline-block;
  width: 1px; /* Más fino */
  height: 1.25em;
  background-color: currentColor;
  margin-left: 1px;
  animation: blink 1s step-end infinite;
  position: relative;
  opacity: 0.8; /* Más sutil */
  top: 1px;
}

/* Ajustar la animación para que sea más suave */
@keyframes blink {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0;
  }
}

/* Asegurar que el caret del input nativo esté oculto */
.search-input {
  caret-color: transparent !important;
}

/* Solo mostrar el caret personalizado cuando el input está enfocado */
.search-input:focus + .typing-cursor {
  display: block;
}

.search-input:not(:focus) + .typing-cursor {
  display: none;
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

.search-badge {
  display: inline-flex;
  align-items: center;
  background-color: #ddf4ff;
  color: #0969da;
  border-radius: .2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  margin: 0 1px;
}

:root[class~="dark"] .search-badge {
  background-color: #1a384d;
  color: #2f81f7;
}

.search-expanded {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5rem; /* Match header height */
  z-index: 50;
  display: flex;
  align-items: center;
  background-color: hsl(var(--background));
  border-bottom: 1px solid hsl(var(--border));
  backdrop-filter: blur(8px);
}

.search-input-expanded {
  max-width: 60rem;
  margin: 0 auto;
  width: 100%;
  position: relative;
}

.suggestions-dropdown {
  position: fixed;
  top: 3.5rem; /* Position right below the header */
  left: 50%;
  transform: translateX(-50%);
  width: 60rem !important;
  max-width: calc(100vw - 2rem);
  margin-top: 0;
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

/* Ensure proper stacking */
:root {
  --search-z-index: 100; /* Increased to appear above header */
}

.search-expanded {
  z-index: var(--search-z-index);
}

.suggestions-dropdown {
  z-index: calc(var(--search-z-index) + 1);
}

/* Add backdrop blur for better visibility */
.search-expanded {
  background-color: hsl(var(--background)/95%);
  backdrop-filter: blur(8px);
}

/* Add smooth transitions */
.search-expanded,
.search-input-expanded,
.suggestions-dropdown {
  transition: all 0.2s ease-out;
}

.search-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4rem;
}

.search-dialog {
  width: 100%;
  max-width: 80rem;
  margin: 0 1rem;
}

.search-dialog-content {
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* Transition animations */
.search-overlay-enter-active,
.search-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.search-overlay-enter-from,
.search-overlay-leave-to {
  opacity: 0;
}

.search-overlay-enter-active .search-dialog,
.search-overlay-leave-active .search-dialog {
  transition: transform 0.15s ease-out;
}

.search-overlay-enter-from .search-dialog,
.search-overlay-leave-to .search-dialog {
  transform: translateY(-1rem);
}

/* Asegurar que el diálogo permanezca visible */
.search-dialog {
  transform: translateY(0);
}

.search-active {
  @apply invisible;
}

.suggestions-dropdown-inline {
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  z-index: 50;
  padding: 0.5rem 0;
  max-height: 16rem;
  overflow-y: auto;
}

/* Asegurar que el input mantenga el texto visible */
.text-transparent {
  -webkit-text-fill-color: transparent;
  color: transparent;
  caret-color: currentColor; /* Mantener el cursor visible */
}

.search-input-mirror {
  overflow-x: auto;
  white-space: pre;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.search-input-mirror::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.search-input {
  white-space: pre;
  overflow-x: auto;
}

/* Ajustar el estilo del texto transparente para mejor visibilidad */
.text-transparent {
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Asegurar que los badges mantengan su espacio */
.search-badge {
  flex-shrink: 0;
  display: inline-flex;
  white-space: pre;
}

/* Asegurar que el contenedor mantenga el scroll sincronizado */
.relative.flex-1 {
  overflow: hidden;
}

.search-wrapper {
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.search-wrapper::-webkit-scrollbar {
  display: none;
}

.search-mirror {
  position: absolute;
  top: 0;
  left: 0;
  padding: inherit;
  pointer-events: none;
  visibility: visible;
  white-space: pre;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  background: transparent;
  outline: none;
  color: transparent;
  caret-color: currentColor;
  position: relative;
  white-space: pre;
  padding: inherit;
}

.search-input.has-content {
  -webkit-text-fill-color: transparent;
}

.search-input::placeholder {
  -webkit-text-fill-color: initial;
  color: initial;
}

.search-badge {
  display: inline-flex;
  align-items: center;
  background-color: #ddf4ff;
  color: #0969da;
  border-radius: .2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  margin: 0 1px;
  white-space: pre;
}

:root[class~="dark"] .search-badge {
  background-color: #1a384d;
  color: #2f81f7;
}

.search-container {
  position: relative;
  min-width: 0;
  width: 100%;
}

.search-content-wrapper {
  position: relative;
  width: 100%;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.search-content-wrapper::-webkit-scrollbar {
  display: none;
}

.search-mirror {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  white-space: pre;
  padding: 2px 0;
  min-width: min-content;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  background: transparent;
  outline: none;
  position: relative;
  white-space: pre;
  padding: 2px 0;
  min-width: 100%;
  color: transparent;
  caret-color: currentColor;
}

.search-input::placeholder {
  color: hsl(var(--muted-foreground));
  -webkit-text-fill-color: initial;
}

.search-badge {
  display: inline-flex;
  align-items: center;
  background-color: #ddf4ff;
  color: #0969da;
  border-radius: .2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
}

.search-input-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-highlight-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  white-space: pre;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 0.25rem; /* Nuevo: separación consistente entre elementos */
}

.search-input-field {
  width: 100%;
  background: transparent;
  outline: none;
  color: transparent;
  caret-color: currentColor;
  white-space: pre;
}

.search-input-field::placeholder {
  color: hsl(var(--muted-foreground));
  -webkit-text-fill-color: initial;
}

.search-badge {
  display: inline-flex;
  align-items: center;
  padding: 0 0.25rem;
  border-radius: 0.2rem;
  background: #ddf4ff;
  color: #0969da;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: pre;
  /* Se puede eliminar o reducir "margin" ya que el gap se encarga */
}

:root[class~="dark"] .search-badge {
  background: #1a384d;
  color: #2f81f7;
}

.extra-space {
  /* Forzar al menos 2 caracteres de espacio extra */
  min-width: 2ch;
  flex-shrink: 0;
}

/* Remove duplicate styles and keep only these essential ones */
.search-scroll-container {
  display: flex;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin-right: -8px; /* Compensar el padding del contenedor */
  padding-right: 8px;
}

.search-scroll-container::-webkit-scrollbar {
  display: none;
}

/* Ajustar el input */
.search-input-field {
  background: transparent;
  outline: none;
  color: transparent;
  caret-color: currentColor;
  min-width: 100%;
  position: relative;
  white-space: pre;
  padding: 2px 0;
}

.search-input-field.has-content {
  -webkit-text-fill-color: transparent;
}

.search-input-field::placeholder {
  -webkit-text-fill-color: initial;
  color: hsl(var(--muted-foreground));
}

/* Ajustar la capa de resaltado */
.search-highlight {
  display: flex;
  align-items: center;
  white-space: pre;
  padding: 2px 0;
}

/* Asegurar que los badges mantengan su forma */
.search-badge {
  display: inline-flex;
  align-items: center;
  white-space: pre;
  flex-shrink: 0;
}

/* Ajustar el cursor */
.typing-cursor {
  width: 2px;
  height: 1.2em;
  background-color: currentColor;
  pointer-events: none;
}

.suggestions-group + .suggestions-group {
  margin-top: 0.5rem;
}

.search-badge-mini {
  background-color: hsl(var(--accent));
  color: hsl(var(--accent-foreground));
  padding: 0 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  line-height: 1.25rem;
}

.suggestion-item.is-used {
  background-color: hsl(var(--muted)/0.1);
}

.suggestion-item.is-used:hover {
  background-color: hsl(var(--destructive)/0.1);
}

.suggestions-container {
  background-color: hsl(var(--background));
  border: 1px solid hsl(var(--border));
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  max-height: 24rem;
  overflow-y: auto;
}

.suggestion-item.is-used:hover {
  background-color: hsl(var(--destructive)/0.1);
  color: hsl(var(--destructive));
}

.suggestion-item.is-used:hover .search-badge-mini {
  background-color: hsl(var(--destructive)/0.2);
  color: hsl(var(--destructive));
}

.search-input-field {
  background: transparent;
  outline: none;
  position: relative;
  white-space: pre;
  padding: 2px 0;
  caret-color: currentColor; /* Asegura que el cursor sea visible */
  color: currentColor; /* Color del texto igual al tema actual */
}

/* Solo hacer el texto transparente cuando tiene contenido y no está en modo inline */
.search-input-field.has-content:not(.inline-mode) {
  color: transparent;
  -webkit-text-fill-color: transparent;
}

/* Asegurar que el cursor sea visible en modo inline */
.search-input-field.inline-mode {
  color: currentColor;
  -webkit-text-fill-color: currentColor;
}

/* Mantener el placeholder visible */
.search-input-field::placeholder {
  -webkit-text-fill-color: initial;
  color: hsl(var(--muted-foreground));
}

/* Nuevos estilos para el resaltado */
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

:deep(.search-token-text) {
  color: currentColor;
  white-space: pre;
}

/* Dark mode */
:root[class~="dark"] :deep(.search-token-qualifier),
:root[class~="dark"] :deep(.search-token-value) {
  color: #2f81f7;
}

:root[class~="dark"] :deep(.search-token-value) {
  background-color: #1a384d;
}

/* Asegurar que el texto del input sea transparente cuando tiene contenido */
.search-input.has-content {
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Asegurar que el input mantenga el texto transparente */
.search-input {
  -webkit-text-fill-color: transparent;
  color: transparent;
  caret-color: currentColor;
}

.search-input::placeholder {
  -webkit-text-fill-color: var(--tw-text-opacity, 1);
  color: hsl(var(--muted-foreground));
}

/* Ajustar el contenedor del mirror */
.search-input-mirror {
  white-space: pre;
  overflow-x: hidden;
}

/* Actualizar los estilos del input para controlar la visibilidad del caret */
.search-input {
  -webkit-text-fill-color: transparent;
  color: transparent;
  caret-color: transparent; /* Ocultar caret por defecto */
}

.search-input:focus {
  caret-color: currentColor; /* Mostrar caret solo cuando está enfocado */
}
</style>
