export interface SearchToken {
  type: 'qualifier' | 'text' | 'space'
  value: string
  qualifier?: string
}

export interface Qualifier {
  label: string
  icon: string
}

export interface QualifierSuggestion {
  qualifier: string
  isUsed: boolean
  value?: string
}

export type SearchMode = 'inline' | 'modal'
