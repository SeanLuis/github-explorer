import type { ComputedRef, Ref } from 'vue'

export interface SearchInputFieldProps {
  searchValue: string
  highlightedHTML: string | ComputedRef<string>
  handleInput: (e: Event) => void
  handleFocus: () => void
  handleBlur: (e: FocusEvent) => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleInputScroll: (e: Event) => void
  input: any
}

export interface SearchInputProps {
  modelValue: string
  mode?: 'inline' | 'modal'
}
