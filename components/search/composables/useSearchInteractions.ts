import { ref, computed, nextTick } from 'vue'
import type { SearchToken } from '../search'
import { useSearchParser } from './useSearchParser'

export function useSearchInteractions(
  props: { modelValue: string, mode?: 'inline' | 'modal' },
  emit: { (e: 'update:modelValue', value: string): void, (e: 'search'): void },
  input: any,
  updateCursorPosition: () => void,
  lockScroll: () => void,
  unlockScroll: () => void
) {
  const { parseSearchTokens } = useSearchParser()
  const searchInput = ref(props.modelValue)
  const showSuggestions = ref(false)
  const isInputFocused = ref(false)
  const isExpanded = ref(false)

  const isInlineMode = computed(() => props.mode === 'inline')
  const searchTokens = computed(() => parseSearchTokens(searchInput.value))

  const handleInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).value
    searchInput.value = value
    emit('update:modelValue', value)
    updateCursorPosition()
    showSuggestions.value = true // Mantener sugerencias visibles al escribir
  }

  const handleFocus = () => {
    if (!isInlineMode.value && !isExpanded.value) {
      isExpanded.value = true
      isInputFocused.value = true
      showSuggestions.value = true
      lockScroll()
      nextTick(() => {
        input.value?.focus()
      })
    } else {
      isInputFocused.value = true
      showSuggestions.value = true
    }
  }

  const closeSearch = () => {
    if (!isInlineMode.value) {
      isExpanded.value = false
      isInputFocused.value = false
      showSuggestions.value = false
      unlockScroll()
    } else {
      isInputFocused.value = false
      showSuggestions.value = false
    }
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
      closeSearch()
    } else if (event.key === 'Escape' && isExpanded.value) {
      closeSearch()
    }
    updateCursorPosition()
  }

  const handleSuggestionClick = (suggestion: string) => {
    const currentValue = searchInput.value
    const space = currentValue && !currentValue.endsWith(' ') ? ' ' : ''
    searchInput.value = currentValue + space + suggestion
    emit('update:modelValue', searchInput.value)
    input.value?.focus()
    updateCursorPosition()
    showSuggestions.value = true
  }

  const removeQualifier = (qualifierToRemove: string, valueToRemove: string) => {
    const tokens = searchTokens.value
    let newSearchText = ''
    let skipNext = false
    let needsSpace = false
  
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      
      // Si este token debe ser saltado
      if (skipNext) {
        skipNext = false
        continue
      }
  
      // Si es el qualifier que queremos remover
      if (token.type === 'qualifier' && 
          token.qualifier + ':' === qualifierToRemove && 
          token.value === valueToRemove) {
        // Si hay un espacio después, marcarlo para saltar
        if (i + 1 < tokens.length && tokens[i + 1].type === 'space') {
          skipNext = true
        }
        // Si hay un espacio antes, no añadir espacio extra
        if (i > 0 && tokens[i - 1].type === 'space') {
          needsSpace = false
        }
        continue
      }
  
      // Añadir espacio si es necesario
      if (needsSpace && token.type !== 'space') {
        newSearchText += ' '
      }
  
      // Añadir el token actual
      if (token.type === 'qualifier') {
        newSearchText += token.qualifier + ':' + token.value
        needsSpace = true
      } else if (token.type === 'text') {
        newSearchText += token.value
        needsSpace = true
      } else if (token.type === 'space') {
        needsSpace = false
      }
    }
  
    searchInput.value = newSearchText.trim()
    emit('update:modelValue', searchInput.value)
    nextTick(() => {
      input.value?.focus()
      updateCursorPosition()
    })
  }

  return {
    searchInput,
    showSuggestions,
    isInputFocused,
    isExpanded,
    isInlineMode,
    searchTokens, // Exportar searchTokens
    handleInput,
    handleFocus,
    closeSearch,
    handleBlur,
    handleClose,
    handleKeyDown,
    handleSuggestionClick,
    removeQualifier
  }
}
