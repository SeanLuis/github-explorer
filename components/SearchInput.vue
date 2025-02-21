<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
// Si quieres usar useTimeout de VueUse, necesitas importarlo:
// import { useTimeout } from '@vueuse/core'

interface SearchToken {
  type: 'qualifier' | 'text' | 'space';
  value: string;
  qualifier?: string;
}

const props = defineProps<{
  modelValue: string;
  mode?: 'inline' | 'modal'; // Nuevo prop para el modo de visualización
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
}>()

const input = ref<HTMLInputElement | null>(null)
const searchInput = ref(props.modelValue)
const showSuggestions = ref(false)
const cursorPosition = ref(0)
const containerWidth = ref(0)
const searchContainer = ref<HTMLDivElement | null>(null)
const dropdownPosition = ref({ left: 0, top: 0 })
const isInputFocused = ref(false)
const isExpanded = ref(false)
const originalPosition = ref(0)

const isInlineMode = computed(() => props.mode === 'inline')

// Función simplificada para colorear el texto
const colorText = (text: string) => {
  const parts: { text: string; type: 'qualifier' | 'value' | 'normal' }[] = []
  let currentPosition = 0

  while (currentPosition < text.length) {
    let matched = false

    // Buscar qualifiers
    for (const qualifier of Object.keys(QUALIFIERS)) {
      if (text.slice(currentPosition).toLowerCase().startsWith(qualifier.toLowerCase())) {
        // Agregar qualifier
        parts.push({
          text: qualifier,
          type: 'qualifier'
        })
        
        currentPosition += qualifier.length
        
        // Buscar valor hasta el espacio
        let valueStart = currentPosition
        while (currentPosition < text.length && text[currentPosition] !== ' ') {
          currentPosition++
        }
        
        if (currentPosition > valueStart) {
          parts.push({
            text: text.slice(valueStart, currentPosition),
            type: 'value'
          })
        }
        
        matched = true
        break
      }
    }

    if (!matched) {
      // Agregar texto normal hasta el siguiente qualifier o final
      let normalText = ''
      while (currentPosition < text.length) {
        let isQualifier = false
        for (const qualifier of Object.keys(QUALIFIERS)) {
          if (text.slice(currentPosition).toLowerCase().startsWith(qualifier.toLowerCase())) {
            isQualifier = true
            break
          }
        }
        if (isQualifier) break
        normalText += text[currentPosition]
        currentPosition++
      }
      if (normalText) {
        parts.push({
          text: normalText,
          type: 'normal'
        })
      }
    }
  }

  return parts
}

const coloredParts = computed(() => colorText(searchInput.value))

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchInput.value = value
  emit('update:modelValue', value)
  nextTick(() => {
    updateCursorPosition() // Actualizar la posición del cursor después del render
  })
}

// GitHub search qualifiers
const QUALIFIERS = {
  'repo:': { label: 'Repository (user/repo)', icon: 'octicon:repo-16' },
  'user:': { label: 'User', icon: 'octicon:person-16' },
  'org:': { label: 'Organization', icon: 'octicon:organization-16' },
  'in:': { label: 'Search in', icon: 'octicon:search-16' },
  'size:': { label: 'Size', icon: 'octicon:file-16' },
  'stars:': { label: 'Stars', icon: 'octicon:star-16' },
  'language:': { label: 'Language', icon: 'octicon:code-16' },
  'created:': { label: 'Created date', icon: 'octicon:calendar-16' },
  'pushed:': { label: 'Push date', icon: 'octicon:git-commit-16' },
  'topic:': { label: 'Topic', icon: 'octicon:hash-16' },
  'is:': { label: 'State', icon: 'octicon:circle-16' },
  'fork:': { label: 'Fork', icon: 'octicon:repo-forked-16' },
} as const

// Parse search input into tokens
const parseSearchTokens = (value: string): SearchToken[] => {
  const tokens: SearchToken[] = []
  let i = 0

  while (i < value.length) {
    let matchedQualifier = false
    
    // Buscar cualquier qualifier al inicio de la posición actual
    for (const qualifier of Object.keys(QUALIFIERS)) {
      if (value.slice(i).toLowerCase().startsWith(qualifier.toLowerCase())) {
        let j = i + qualifier.length
        let qualifierValue = ''
        
        // Capturar todo hasta el próximo espacio o el final
        while (j < value.length && value[j] !== ' ') {
          qualifierValue += value[j]
          j++
        }

        if (qualifierValue) {
          tokens.push({
            type: 'qualifier',
            qualifier: qualifier.slice(0, -1),
            value: qualifierValue
          })
        }

        i = j
        matchedQualifier = true
        break
      }
    }

    if (!matchedQualifier) {
      if (value[i] === ' ') {
        tokens.push({ type: 'space', value: ' ' })
      } else {
        let textValue = ''
        while (i < value.length && !Object.keys(QUALIFIERS).some(q => 
          value.slice(i).toLowerCase().startsWith(q.toLowerCase())
        ) && value[i] !== ' ') {
          textValue += value[i]
          i++
        }
        if (textValue) {
          tokens.push({ type: 'text', value: textValue })
        }
        continue
      }
    }
    i++
  }

  return tokens
}

const searchTokens = computed(() => parseSearchTokens(searchInput.value))

// Función para obtener las partes coloreadas del texto
const getColoredParts = computed(() => {
  const parts: { text: string; isQualifier: boolean; isValue: boolean }[] = []
  let text = searchInput.value
  let position = 0

  while (position < text.length) {
    let matched = false
    
    // Buscar qualifiers
    for (const qualifier of Object.keys(QUALIFIERS)) {
      if (text.slice(position).toLowerCase().startsWith(qualifier.toLowerCase())) {
        // Agregar el qualifier
        parts.push({
          text: text.slice(position, position + qualifier.length),
          isQualifier: true,
          isValue: false
        })
        
        position += qualifier.length
        
        // Buscar el valor hasta el siguiente espacio
        let valueStart = position
        while (position < text.length && text[position] !== ' ') {
          position++
        }
        
        if (position > valueStart) {
          parts.push({
            text: text.slice(valueStart, position),
            isQualifier: false,
            isValue: true
          })
        }
        
        matched = true
        break
      }
    }
    
    if (!matched) {
      // Agregar texto normal hasta el siguiente qualifier o espacio
      let normalText = ''
      while (position < text.length) {
        let foundQualifier = false
        for (const qualifier of Object.keys(QUALIFIERS)) {
          if (text.slice(position).toLowerCase().startsWith(qualifier.toLowerCase())) {
            foundQualifier = true
            break
          }
        }
        if (foundQualifier) break
        normalText += text[position]
        position++
      }
      if (normalText) {
        parts.push({
          text: normalText,
          isQualifier: false,
          isValue: false
        })
      }
    }
  }
  
  return parts
})

// Manejadores de eventos actualizados
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

// Modificar el handleBlur para que solo se ejecute cuando realmente queremos cerrar
const handleBlur = (event: FocusEvent) => {
  // Si el elemento relacionado está dentro del diálogo, no hacer nada
  const dialogContent = document.querySelector('.search-dialog-content')
  if (dialogContent?.contains(event.relatedTarget as Node)) {
    return
  }
  
  // Si no hay elemento relacionado (clic fuera) o está fuera del diálogo, cerrar
  if (!event.relatedTarget || !dialogContent?.contains(event.relatedTarget as Node)) {
    closeSearch()
  }
}

// Agregar método para cerrar con el botón X
const handleClose = () => {
  closeSearch()
}

// Add escape key handler
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('search')
    if (!isInlineMode.value) {
      closeSearch()
    }
  } else if (event.key === 'Escape' && isExpanded.value) {
    closeSearch()
  }
  // Permitir navegación normal con teclas de flecha
  updateCursorPosition()
}

// Suggestions system
const suggestions = computed(() => {
  // Obtener los qualifiers usados con sus valores
  const usedQualifiers = searchTokens.value
    .filter(token => token.type === 'qualifier')
    .map(token => ({
      qualifier: token.qualifier + ':',
      value: token.value
    }))

  // Devolver todos los qualifiers con su estado de uso
  return Object.keys(QUALIFIERS).map(qualifier => ({
    qualifier,
    isUsed: usedQualifiers.some(used => used.qualifier === qualifier),
    value: usedQualifiers.find(used => used.qualifier === qualifier)?.value
  }))
})

// Modificar la función removeQualifier para que solo elimine el qualifier específico con su valor exacto
const removeQualifier = (qualifierToRemove: string, valueToRemove: string) => {
  const tokens = searchTokens.value
  let newSearchText = ''

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    
    // Solo eliminar si coincide tanto el qualifier como el valor
    if (token.type === 'qualifier' && 
        token.qualifier + ':' === qualifierToRemove && 
        token.value === valueToRemove) {
      // Saltar este token y el siguiente espacio si existe
      if (i + 1 < tokens.length && tokens[i + 1].type === 'space') {
        i++
      }
      continue
    }
    
    newSearchText += token.value
  }

  searchInput.value = newSearchText.trim()
  emit('update:modelValue', searchInput.value)
  nextTick(() => {
    input.value?.focus()
    updateCursorPosition()
  })
}

const updateCursorPosition = () => {
  if (input.value) {
    const inputElement = input.value
    cursorPosition.value = inputElement.selectionStart || 0
    const container = inputElement.parentElement

    if (container) {
      const measureElement = document.createElement('span')
      measureElement.style.font = window.getComputedStyle(inputElement).font
      measureElement.style.visibility = 'hidden'
      measureElement.style.position = 'absolute'
      measureElement.style.whiteSpace = 'pre'
      measureElement.textContent = inputElement.value.substring(0, inputElement.selectionStart || 0)
      document.body.appendChild(measureElement)
      
      const cursorOffset = measureElement.offsetWidth
      const containerWidth = container.offsetWidth
      const scrollLeft = container.scrollLeft
      
      document.body.removeChild(measureElement)

      // Si el cursor está cerca del final visible, scroll automático
      if (cursorOffset > scrollLeft + containerWidth - 80) {
        container.scrollLeft = cursorOffset - containerWidth + 80
      }
      // Si el cursor está cerca del inicio visible
      else if (cursorOffset < scrollLeft + 80) {
        container.scrollLeft = Math.max(0, cursorOffset - 80)
      }
    }
  }
}

// Función para manejar el cierre retardado de sugerencias
const updateContainerWidth = () => {
  if (searchContainer.value) {
    containerWidth.value = searchContainer.value.offsetWidth
  }
}

// Actualizar la posición del dropdown cuando se hace scroll
const updateDropdownPosition = () => {
  if (searchContainer.value) {
    containerWidth.value = searchContainer.value.offsetWidth
  }
}

const handleSuggestionClick = (suggestion: string) => {
  const currentValue = searchInput.value
  // Añadir espacio si el valor actual no termina en espacio
  const space = currentValue && !currentValue.endsWith(' ') ? ' ' : ''
  searchInput.value = currentValue + space + suggestion
  emit('update:modelValue', searchInput.value)
  
  // Solo actualizar el cursor y mantener el foco
  nextTick(() => {
    input.value?.focus()
    updateCursorPosition()
    showSuggestions.value = true // Mantener las sugerencias visibles
  })
}

// Añadir manejo de scroll sincronizado
const handleInputScroll = (event: Event) => {
  const input = event.target as HTMLElement
  const mirror = input.previousElementSibling as HTMLElement
  if (mirror) {
    mirror.scrollLeft = input.scrollLeft
  }
}

onMounted(() => {
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)

  // 1. Global slash shortcut
  window.addEventListener('keydown', handleGlobalShortcut)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth)
  window.removeEventListener('keydown', handleGlobalShortcut)
})

// Simplify global shortcut handler to only use "/"
const handleGlobalShortcut = (event: KeyboardEvent) => {
  // Only trigger if it's exactly the "/" key and not inside an input/textarea
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
    event.preventDefault()
    handleFocus()
    nextTick(() => {
      // Remove the "/" character that was typed
      if (input.value) {
        input.value.value = input.value.value.replace('/', '')
      }
    })
  }
}

watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchInput.value) {
    searchInput.value = newValue
  }
})

// Modificar el computed de sugerencias para separar en usados y no usados
const suggestionGroups = computed(() => {
  const usedQualifiers = searchTokens.value
    .filter(token => token.type === 'qualifier')
    .map(token => ({
      qualifier: token.qualifier + ':',
      value: token.value
    }))

  const allQualifiers = Object.keys(QUALIFIERS).map(qualifier => ({
    qualifier,
    isUsed: usedQualifiers.some(used => used.qualifier === qualifier),
    value: usedQualifiers.find(used => used.qualifier === qualifier)?.value
  }))

  return {
    used: allQualifiers.filter(q => q.isUsed),
    available: allQualifiers.filter(q => !q.isUsed)
  }
})
</script>

<template>
  <div class="relative w-full">
    <!-- Normal search input -->
    <div 
      ref="searchContainer"
      class="relative w-full"
      :class="{ 'search-active': isExpanded }"
    >
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
        
        <!-- Modificar el contenedor del input -->
        <div class="relative flex-1 overflow-hidden">
          <div class="relative w-full overflow-x-auto search-scroll-container">
            <!-- Capa de resaltado con contenido -->
            <div 
              class="search-highlight absolute inset-0 whitespace-pre pointer-events-none flex items-center"
              :style="{ minWidth: '100%' }"
            >
              <template v-for="(part, index) in coloredParts" :key="index">
                <span 
                  v-if="part.type === 'value'" 
                  class="search-badge"
                >{{ part.text }}</span>
                <span
                  v-else
                  :class="{ 'text-primary font-medium': part.type === 'qualifier' }"
                >{{ part.text }}</span>
              </template>
              <!-- Espacio para el cursor -->
              <span class="pl-px"></span>
            </div>

            <!-- Input real -->
            <input
              ref="input"
              :value="searchInput"
              type="text"
              class="search-input-field relative w-full"
              :class="{ 'has-content': searchInput }"
              placeholder="Search repositories..."
              @input="handleInput"
              @keydown="handleKeyDown"
              @focus="handleFocus"
              @blur="handleBlur"
              @scroll="handleInputScroll"
            />
          </div>
          <!-- Cursor que se mueve con el input -->
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
        @click="handleClose"
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
                @click="handleClose"
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
                <!-- Colored preview and cursor -->
                <div 
                  aria-hidden="true"
                  class="search-input-mirror absolute inset-0 pointer-events-none flex items-center whitespace-pre overflow-x-auto"
                >
                  <template v-for="(part, index) in coloredParts" :key="index">
                    <span v-if="part.type === 'value'" class="search-badge whitespace-pre">{{ part.text }}</span>
                    <span
                      v-else
                      :class="{
                        'text-primary font-medium whitespace-pre': part.type === 'qualifier',
                      }"
                    >{{ part.text }}</span>
                  </template>
                  <span v-if="isInputFocused" class="typing-cursor"></span>
                </div>

                <input
                  ref="input"
                  :value="searchInput"
                  type="text"
                  class="search-input w-full bg-transparent outline-none relative"
                  :class="{ 'text-transparent': searchInput }"
                  placeholder="Search repositories..."
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
  width: 2px;
  height: 1.2em;
  background-color: currentColor;
  margin-left: 1px;
  animation: blink 1s step-end infinite;
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
  width: 90%;
  background: transparent;
  outline: none;
  position: relative;
  white-space: pre;
  padding: 2px 0;
  min-width: 90%;
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
</style>
