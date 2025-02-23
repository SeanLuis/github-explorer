import type { ColoredPart, SearchToken } from '~/components/search/search'
import { QUALIFIERS } from './useQualifiers'

export function useSearchParser() {
  const parseSearchTokens = (value: string): SearchToken[] => {
    const tokens: SearchToken[] = []
    let i = 0
    
    while (i < value.length) {
      // Check for qualifiers
      const qualifierMatch = Object.keys(QUALIFIERS).find(q => 
        value.slice(i).toLowerCase().startsWith(q.toLowerCase())
      )
      
      if (qualifierMatch) {
        // Move past the qualifier
        i += qualifierMatch.length
        
        // Collect the value after the qualifier
        let qualifierValue = ''
        while (i < value.length && value[i] !== ' ') {
          qualifierValue += value[i]
          i++
        }
        
        tokens.push({
          type: 'qualifier',
          qualifier: qualifierMatch.slice(0, -1), // Remove trailing colon
          value: qualifierValue
        })
        
        // Add space if there is one
        if (i < value.length && value[i] === ' ') {
          tokens.push({ type: 'space', value: ' ' })
          i++
        }
      } else {
        // Handle regular text
        if (value[i] === ' ') {
          tokens.push({ type: 'space', value: ' ' })
          i++
        } else {
          let text = ''
          while (i < value.length && 
                 !Object.keys(QUALIFIERS).some(q => value.slice(i).toLowerCase().startsWith(q.toLowerCase())) && 
                 value[i] !== ' ') {
            text += value[i]
            i++
          }
          if (text) {
            tokens.push({ type: 'text', value: text })
          }
        }
      }
    }
    
    return tokens
  }

  const colorText = (text: string): ColoredPart[] => {
    const parts: ColoredPart[] = []
    let currentPosition = 0

    while (currentPosition < text.length) {
      let matched = false

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

  return {
    parseSearchTokens,
    colorText
  }
}
