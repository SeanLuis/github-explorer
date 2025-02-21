import { ref, computed } from 'vue'
import type { SearchToken } from '../types'
import { QUALIFIERS } from '../constants'

export function useSearchInput() {
  const searchInput = ref('')
  const input = ref<HTMLInputElement | null>(null)
  const cursorPosition = ref(0)
  const isInputFocused = ref(false)
  const containerWidth = ref(0)
  const searchContainer = ref<HTMLDivElement | null>(null)

  const colorText = (text: string) => {
    const parts: { text: string; type: 'qualifier' | 'value' | 'normal' }[] = []
    let currentPosition = 0

    while (currentPosition < text.length) {
      let matched = false

      // Buscar qualifiers
      for (const qualifier of Object.keys(QUALIFIERS)) {
        if (text.slice(currentPosition).toLowerCase().startsWith(qualifier.toLowerCase())) {
          parts.push({
            text: qualifier,
            type: 'qualifier'
          })
          
          currentPosition += qualifier.length
          
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

  const parseSearchTokens = (value: string): SearchToken[] => {
    const tokens: SearchToken[] = []
    let i = 0

    while (i < value.length) {
      let matchedQualifier = false
      
      for (const qualifier of Object.keys(QUALIFIERS)) {
        if (value.slice(i).toLowerCase().startsWith(qualifier.toLowerCase())) {
          let j = i + qualifier.length
          let qualifierValue = ''
          
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
          i++
        } else {
          let textValue = ''
          let start = i
          
          while (i < value.length) {
            let isQualifier = false
            for (const qualifier of Object.keys(QUALIFIERS)) {
              if (value.slice(i).toLowerCase().startsWith(qualifier.toLowerCase())) {
                isQualifier = true
                break
              }
            }
            if (isQualifier || value[i] === ' ') break
            textValue += value[i]
            i++
          }
          
          if (textValue) {
            tokens.push({ type: 'text', value: textValue })
          }
        }
      }
    }

    return tokens
  }

  const updateCursorPosition = () => {
    if (input.value) {
      const inputElement = input.value
      cursorPosition.value = inputElement.selectionStart || 0
      
      // Usar el mismo contenedor que el input para medir
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.top = '0'
      container.style.left = '0'
      container.style.visibility = 'hidden'
      container.style.whiteSpace = 'pre'
      container.style.font = window.getComputedStyle(inputElement).font
      
      // Medir solo hasta la posición del cursor
      container.textContent = inputElement.value.substring(0, inputElement.selectionStart || 0)
      
      document.body.appendChild(container)
      cursorPosition.value = container.offsetWidth
      document.body.removeChild(container)
    }
  }

  return {
    searchInput,
    input,
    cursorPosition,
    isInputFocused,
    searchContainer,
    containerWidth,
    coloredParts,
    parseSearchTokens,
    updateCursorPosition
  }
}
