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
}

// GitHub search qualifiers
const QUALIFIERS = {
  'repo:': 'Repository (user/repo)',  // Actualizado para clarificar el formato
  'user:': 'User',
  'org:': 'Organization',
  'in:': 'Search in',
  'size:': 'Size',
  'stars:': 'Stars',
  'language:': 'Language',
  'created:': 'Created date',
  'pushed:': 'Push date',
  'topic:': 'Topic',
  'is:': 'State',
  'fork:': 'Fork',
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
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emit('search')
  }
}

// Suggestions system
const suggestions = computed(() => {
  const pos = cursorPosition.value
  const textUpToCursor = searchInput.value.slice(0, pos)
  const lastQualifier = Object.keys(QUALIFIERS).find(q => textUpToCursor.endsWith(q))
  
  if (!lastQualifier) {
    return Object.keys(QUALIFIERS).filter(q => 
      !searchInput.value.includes(q) && q.startsWith(textUpToCursor.split(' ').pop() || '')
    )
  }
  
  return []
})

const updateCursorPosition = () => {
  if (input.value) {
    cursorPosition.value = input.value.selectionStart || 0
  }
}

// Función para manejar el cierre retardado de sugerencias
const handleBlur = () => {
  isInputFocused.value = false
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const handleFocus = () => {
  isInputFocused.value = true
  showSuggestions.value = true
}

const handleSuggestionClick = (suggestion: string) => {
  const currentValue = searchInput.value
  const needsSpace = currentValue && !currentValue.endsWith(' ')
  // Remove the extra space at the end
  searchInput.value = `${currentValue}${needsSpace ? ' ' : ''}${suggestion}`
  emit('update:modelValue', searchInput.value)
}

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

onMounted(() => {
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth)
})

watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchInput.value) {
    searchInput.value = newValue
  }
})
</script>

<template>
  <div 
    ref="searchContainer"
    class="relative w-full"
  >
    <div 
      class="relative flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
      :class="{ 'ring-2 ring-ring ring-offset-2': showSuggestions }"
    >
      <Icon 
        name="octicon:search-16"
        class="mr-2 h-4 w-4 shrink-0 opacity-50"
      />
      
      <div class="relative flex-1">
        <!-- Input con vista previa coloreada y cursor -->
        <div 
          aria-hidden="true"
          class="absolute inset-0 pointer-events-none flex items-center whitespace-pre overflow-hidden"
        >
          <template v-for="(part, index) in coloredParts" :key="index">
            <span v-if="part.type === 'value'" class="search-badge">{{ part.text }}</span>
            <span
              v-else
              :class="{
                'text-primary font-medium': part.type === 'qualifier',
              }"
            >{{ part.text }}</span>
          </template>
          <span v-if="isInputFocused" class="typing-cursor"></span>
        </div>

        <input
          ref="input"
          :value="searchInput"
          type="text"
          class="w-full bg-transparent outline-none"
          :class="{ 'text-transparent': searchInput }"
          placeholder="Search repositories..."
          @input="handleInput"
          @keydown="handleKeyDown"
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>

      <kbd 
        v-if="!showSuggestions"
        class="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
      >
        <span class="text-xs">⌘</span>K
      </kbd>
    </div>

    <!-- Suggestions dropdown with absolute positioning -->
    <div
      v-if="showSuggestions && suggestions?.length > 0"
      class="suggestions-dropdown"
      :style="{ width: `${containerWidth}px` }"
    >
      <div 
        v-for="suggestion in suggestions"
        :key="suggestion"
        class="suggestion-item"
        @mousedown.prevent="handleSuggestionClick(suggestion)"
      >
        <Icon name="octicon:search-16" class="h-4 w-4 opacity-50" />
        <span>{{ QUALIFIERS[suggestion as keyof typeof QUALIFIERS] }}</span>
        <span class="text-muted-foreground ml-auto">{{ suggestion }}</span>
      </div>
    </div>
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
  padding: 0.375rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.suggestion-item:hover {
  background-color: hsl(var(--muted));
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
</style>
