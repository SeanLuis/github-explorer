<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useSearchInput } from './composables/useSearchInput'
import { useSearchSuggestions } from './composables/useSearchSuggestions'
import { useSearchShortcuts } from './composables/useSearchShortcuts'
import SearchDialog from './SearchDialog.vue'
import SearchHighlight from './SearchHighlight.vue'
import SearchSuggestions from './SearchSuggestions.vue'
import type { SearchMode } from './types'

const props = defineProps<{
  modelValue: string
  mode?: SearchMode
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

const {
  searchInput,
  input,
  cursorPosition,
  isInputFocused,
  coloredParts,
  parseSearchTokens,
  updateCursorPosition
} = useSearchInput()

const tokens = computed(() => parseSearchTokens(searchInput.value))
const {
  showSuggestions,
  suggestions,
  handleSuggestionSelect,
  handleSuggestionRemove
} = useSearchSuggestions(
  () => tokens.value,
  () => searchInput.value
)

// Estado local
const isExpanded = ref(false)
const originalPosition = ref(0)
const isInlineMode = computed(() => props.mode === 'inline')

// Funciones de manejo de scroll
const lockScroll = () => {
  originalPosition.value = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${originalPosition.value}px`
  document.body.style.width = '100%'
}

const unlockScroll = () => {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, originalPosition.value)
}

// Manejadores de eventos
const handleFocus = () => {
  isInputFocused.value = true
  showSuggestions.value = true
  
  if (!isInlineMode.value) {
    isExpanded.value = true
    lockScroll()
    nextTick(() => {
      input.value?.focus()
    })
  }
}

const closeSearch = () => {
  isInputFocused.value = false
  showSuggestions.value = false
  isExpanded.value = false
  unlockScroll()
}

const handleBlur = (event: FocusEvent) => {
  const dialogContent = document.querySelector('.search-dialog-content')
  if (dialogContent?.contains(event.relatedTarget as Node)) {
    return
  }
  
  if (!event.relatedTarget || !dialogContent?.contains(event.relatedTarget as Node)) {
    closeSearch()
  }
}

const handleClose = () => {
  closeSearch()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('search')
    if (!isInlineMode.value) {
      closeSearch()
    }
  } else if (event.key === 'Escape' && isExpanded.value) {
    closeSearch()
  }
  updateCursorPosition()
}

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchInput.value = value
  emit('update:modelValue', value)
  nextTick(() => {
    updateCursorPosition()
  })
}

// Modificar handleSuggestionClick para agregar el qualifier correctamente
const handleSuggestionClick = (qualifier: string) => {
  const currentValue = searchInput.value
  // Añadir espacio si el valor actual no termina en espacio
  const space = currentValue && !currentValue.endsWith(' ') ? ' ' : ''
  searchInput.value = currentValue + space + qualifier
  emit('update:modelValue', searchInput.value)
  
  nextTick(() => {
    input.value?.focus()
    updateCursorPosition()
    showSuggestions.value = true // Mantener las sugerencias visibles
  })
}

// Modificar la función handleSuggestionRemoveClick para coincidir con la firma esperada
const handleSuggestionRemoveClick = (qualifier: string, value: string) => {
  const fullQualifier = qualifier.endsWith(':') ? qualifier : `${qualifier}:`
  const pattern = new RegExp(`${fullQualifier}\\s*${value}\\s*`, 'i')
  searchInput.value = searchInput.value.replace(pattern, '').trim()
  emit('update:modelValue', searchInput.value)
  nextTick(() => {
    input.value?.focus()
    updateCursorPosition()
  })
}

// Agregar el método handleSearch faltante
const handleSearch = () => {
  emit('search')
  if (!isInlineMode.value) {
    closeSearch()
  }
}

// Keyboard shortcuts
useSearchShortcuts(handleFocus, () => input.value)

// Sincronización con v-model
watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchInput.value) {
    searchInput.value = newValue
  }
})

watch(searchInput, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <div class="relative w-full">
    <div 
      class="relative flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all duration-200"
      :class="{ 
        'ring-2 ring-ring ring-offset-2': showSuggestions,
        'search-input-expanded': isExpanded 
      }"
    >
      <Icon 
        name="octicon:search-16"
        class="mr-2 h-4 w-4 shrink-0 opacity-50"
      />

      <!-- Input container -->
      <div class="relative flex-1 overflow-hidden">
        <div class="relative w-full overflow-x-auto search-scroll-container">
          <!-- Capa de resaltado con contenido -->
          <div class="search-highlight absolute inset-0 whitespace-pre pointer-events-none flex items-center">
            <template v-for="(part, index) in coloredParts" :key="index">
              <template v-if="part.type === 'qualifier'">
                <span class="text-primary font-medium">{{ part.text }}</span>
              </template>
              <template v-else-if="part.type === 'value'">
                <span class="search-badge">{{ part.text }}</span>
              </template>
              <template v-else>
                <span>{{ part.text }}</span>
              </template>
            </template>
            <!-- Espacio para el cursor -->
            <span class="pl-px"></span>
          </div>

          <!-- Input real -->
          <input
            ref="input"
            v-model="searchInput"
            type="text"
            class="search-input-field relative w-full"
            :class="{ 'has-content': searchInput }"
            placeholder="Search repositories..."
            @input="handleInput"
            @keydown="updateCursorPosition"
            @keyup="updateCursorPosition"
            @click="updateCursorPosition"
            @focus="handleFocus"
            @blur="handleBlur"
          />

          <!-- Cursor animado -->
          <span 
            v-if="isInputFocused" 
            class="typing-cursor absolute"
            :style="{ 
              left: `${cursorPosition}px`,
              top: '50%',
              transform: 'translateY(-50%)'
            }"
          ></span>
        </div>
      </div>

      <kbd 
        v-if="!showSuggestions"
        class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
      >
        <span class="text-xs">/</span>
      </kbd>
    </div>

    <!-- Suggestions (inline mode) -->
    <SearchSuggestions
      v-if="isInlineMode && showSuggestions"
      :suggestions="suggestions"
      mode="inline"
      @select="handleSuggestionClick"
      @remove="handleSuggestionRemoveClick"
    />

    <!-- Search Dialog (modal mode) -->
    <SearchDialog
      v-if="!isInlineMode && isExpanded"
      v-model="searchInput"
      :suggestions="suggestions"
      @close="handleClose"
      @search="handleSearch"
    >
      <template #search-input>
        <div class="relative flex-1 overflow-hidden">
          <div class="relative w-full overflow-x-auto search-scroll-container">
            <SearchHighlight :tokens="tokens" />
            <input
              ref="input"
              v-model="searchInput"
              type="text"
              class="search-input-field relative w-full"
              :class="{ 'has-content': searchInput }"
              placeholder="Search repositories..."
              @input="updateCursorPosition"
              @keydown="handleKeyDown"
            />
          </div>
        </div>
      </template>
    </SearchDialog>
  </div>
</template>

<style scoped>
.search-scroll-container {
  position: relative; /* Asegura que el contenedor sea relativo */
  display: flex;
  align-items: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin-right: -8px;
  padding-right: 8px;
}

.search-scroll-container::-webkit-scrollbar {
  display: none;
}

.search-input-field {
  position: relative;
  background: transparent;
  outline: none;
  color: transparent;
  caret-color: transparent; /* Ocultar el cursor nativo */
  min-width: 100%;
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

.typing-cursor {
  position: absolute;
  width: 2px;
  height: 1.2em;
  background-color: currentColor;
  pointer-events: none;
  animation: blink 1s step-end infinite;
  z-index: 10; /* Asegura que el cursor esté siempre visible */
  margin-left: -1px; /* Ajuste fino de la posición */
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
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
</style>
