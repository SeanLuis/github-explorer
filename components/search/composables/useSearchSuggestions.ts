import { ref, computed } from 'vue'
import type { SearchToken, QualifierSuggestion } from '../types'
import { QUALIFIERS } from '../constants'

export function useSearchSuggestions(
  searchTokens: () => SearchToken[],
  getCurrentInput: () => string
) {
  const showSuggestions = ref(false)

  const suggestions = computed<QualifierSuggestion[]>(() => {
    const usedQualifiers = searchTokens()
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

  const handleSuggestionSelect = (qualifier: string) => {
    return qualifier.endsWith(':') ? qualifier : `${qualifier}:`
  }

  const handleSuggestionRemove = (qualifier: string, value: string) => {
    const currentInput = getCurrentInput()
    const fullQualifier = qualifier.endsWith(':') ? qualifier : `${qualifier}:`
    const pattern = new RegExp(`${fullQualifier}\\s*${value}\\s*`, 'i')
    return currentInput.replace(pattern, '').trim()
  }

  return {
    showSuggestions,
    suggestions,
    handleSuggestionSelect,
    handleSuggestionRemove
  }
}
