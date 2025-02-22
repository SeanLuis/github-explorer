import type { ColoredPart, SearchToken } from '~/types/search'
import { QUALIFIERS } from './useQualifiers'

export function useSearchParser() {
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
