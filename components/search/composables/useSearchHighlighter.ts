import { useSearchParser } from './useSearchParser'

export function useSearchHighlighter() {
  const { parseSearchTokens } = useSearchParser()

  const highlightText = (text: string): string => {
    if (!text) return ''
    
    const tokens = parseSearchTokens(text)
    return tokens.map(token => {
      switch (token.type) {
        case 'qualifier':
          // Ahora el qualifier se muestra como texto normal
          return `<span class="search-token-text">${token.qualifier}:</span>` + 
                 (token.value ? `<span class="search-token-value">${token.value}</span>` : '')
        case 'text':
          return `<span class="search-token-text">${token.value}</span>`
        case 'space':
          return '<span class="search-token-space"> </span>'
        default:
          return token.value
      }
    }).join('')
  }

  return { highlightText }
}
