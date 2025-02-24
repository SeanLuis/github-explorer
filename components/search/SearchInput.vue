<script setup lang="ts">
import { watch, computed } from 'vue'
import { useQualifiers } from './composables/useQualifiers'
import { useSearchParser } from './composables/useSearchParser'
import { useScrollLock } from './composables/useScrollLock'
import { useSearchInput } from './composables/useSearchInput'
import { useSearchInteractions } from './composables/useSearchInteractions'
import { useSearchHighlighter } from './composables/useSearchHighlighter'

import SearchInputField from './SearchInputField.vue'
import SearchSuggestions from './SearchSuggestions.vue'

const props = defineProps<{
  modelValue: string
  mode?: 'inline' | 'modal'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

const { QUALIFIERS } = useQualifiers()
const { parseSearchTokens } = useSearchParser()
const { lockScroll, unlockScroll } = useScrollLock()

const handleFocusWrapper = () => {
  searchInteractions.handleFocus()
}
const searchInput = useSearchInput(handleFocusWrapper)
const searchInteractions = useSearchInteractions(
  props,
  emit,
  searchInput.input,
  searchInput.updateCursorPosition,
  lockScroll,
  unlockScroll
)

const {
  input,
  cursorPosition,
  searchContainer,
  isInputFocused,
  handleInputScroll
} = searchInput

const {
  searchInput: searchValue,
  showSuggestions,
  isInlineMode,
  searchTokens,
  isExpanded,
  handleInput,
  handleFocus,
  handleBlur,
  handleClose,
  handleKeyDown,
  handleSuggestionClick,
  removeQualifier
} = searchInteractions

const { highlightText } = useSearchHighlighter()
const highlightedHTML = computed(() => highlightText(searchValue.value))

const suggestions = computed(() => {
  const usedQualifiers = searchTokens.value
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

watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchValue.value) {
    searchValue.value = newValue
  }
})

const inputProps = computed(() => ({
  searchValue: searchValue.value || '',
  highlightedHTML: highlightText(searchValue.value || ''),
  handleInput,
  handleFocus,
  handleBlur,
  handleKeyDown,
  handleInputScroll,
  input
}))
</script>

<template>
  <div class="relative w-full">
    <SearchInputField v-bind="inputProps" />
    
    <!-- Inline suggestions -->
    <SearchSuggestions
      v-if="isInlineMode && showSuggestions && suggestions?.length > 0"
      :suggestions="suggestions"
      :QUALIFIERS="QUALIFIERS"
      mode="inline"
      :handleSuggestionClick="handleSuggestionClick"
      :removeQualifier="removeQualifier"
    />

    <!-- Modal overlay -->
    <Transition name="search-overlay">
      <div v-if="!isInlineMode && isExpanded" 
           class="search-overlay"
           @click.self="handleClose">
        <div class="search-dialog" @click.stop>
          <div class="search-dialog-content">
            <!-- Header -->
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold">Search repositories</h2>
              <button class="p-1 rounded-md hover:bg-accent" 
                      type="button" 
                      @click.stop="handleClose">
                <Icon name="octicon:x-16" class="h-4 w-4" />
              </button>
            </div>

            <SearchInputField v-bind="inputProps" />

            <!-- Modal suggestions -->
            <SearchSuggestions
              v-if="suggestions?.length > 0"
              :suggestions="suggestions"
              :QUALIFIERS="QUALIFIERS"
              mode="modal"
              :handleSuggestionClick="handleSuggestionClick"
              :removeQualifier="removeQualifier"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Modal and overlay styles */
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
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 
              0 8px 10px -6px rgb(0 0 0 / 0.1);
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

/* ...other modal transition styles... */

/* Search expanded mode styles */
.search-expanded {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5rem;
  z-index: var(--search-z-index);
  display: flex;
  align-items: center;
  background-color: hsl(var(--background)/95%);
  border-bottom: 1px solid hsl(var(--border));
  backdrop-filter: blur(8px);
}

:root {
  --search-z-index: 100;
}

/* ...other search expanded styles... */
</style>
