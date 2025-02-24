<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFilterSuggestions } from './composables/useFilterSuggestions'
import IconSearch from '@/components/icons/IconSearch.vue'
import KeyboardShortcut from './KeyboardShortcut.vue'
import FilterSuggestions from './FilterSuggestions.vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  placeholder?: string
  keywords?: string[]
}

const props = withDefaults(defineProps<Props & {
  class?: string
}>(), {
  modelValue: '',
  placeholder: 'Filter...',
  keywords: () => [],
  class: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const { suggestions, getMatchingSuggestions, isValidFilter, addUsedFilter } = useFilterSuggestions()
const showSuggestions = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const wrapperRef = ref<HTMLDivElement | null>(null)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
  if (wrapperRef.value) {
    wrapperRef.value.scrollLeft = target.scrollLeft
  }
}

const handleScroll = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (wrapperRef.value) {
    wrapperRef.value.scrollLeft = target.scrollLeft
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    emit('search', props.modelValue)
    showSuggestions.value = false
  }
}

const handleRemoveFilter = (filter: string) => {
  const filters = props.modelValue.split(' ')
  const newValue = filters.filter(f => f !== filter).join(' ')
  emit('update:modelValue', newValue)
}

const closeMenu = () => {
  showSuggestions.value = false
}

const keywordSet = computed(() => new Set(props.keywords.map((k: string) => k.toLowerCase())))

const highlightedText = computed(() => {
  const parts = props.modelValue.split(/(\s+)/)
  return parts.map(part => {
    const match = part.match(/^([^:]+):(.+)$/)
    if (match && isValidFilter(`${match[1]}:`)) {
      return {
        prefix: `${match[1]}:`,
        value: match[2],
        isFilter: true
      }
    }
    return {
      text: part,
      isFilter: false
    }
  })
})

// Add new keyboard shortcut handler
onMounted(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === '/' && document.activeElement !== inputRef.value) {
      e.preventDefault()
      inputRef.value?.focus()
    }
  }
  document.addEventListener('keydown', handleKeyDown)
  onUnmounted(() => document.removeEventListener('keydown', handleKeyDown))
})

const handleSuggestionSelect = (prefix: string) => {
  const newValue = `${props.modelValue}${prefix}`
  emit('update:modelValue', newValue)
  addUsedFilter(prefix)
  inputRef.value?.focus()
}
</script>

<template>
  <div :class="cn('relative', props.class)">
    <div class="relative flex items-center h-full"> <!-- Cambiado de h-8 a h-full -->
      <div :class="cn('absolute left-2 flex items-center pointer-events-none text-muted-foreground')">
        <IconSearch class="h-4 w-4" />
      </div>

      <div
        ref="wrapperRef"
        :class="cn('absolute inset-0 flex items-center overflow-x-auto whitespace-pre pl-8 pr-2.5 py-1 text-[13px] pointer-events-none scrollbar-hide')"
      >
        <template v-for="(part, i) in highlightedText" :key="i">
          <template v-if="part.isFilter">
            <span :class="cn('text-muted-foreground')">{{ part.prefix }}</span>
            <span :class="cn('bg-primary/10 text-primary rounded-sm')">{{ part.value }}</span>
          </template>
          <span v-else>{{ part.text }}</span>
        </template>
      </div>

      <input
        ref="inputRef"
        type="text"
        :value="modelValue"
        @input="handleInput"
        @keydown="handleKeyDown"
        @scroll="handleScroll"
        @focus="showSuggestions = true"
        :placeholder="placeholder"
        :class="cn(
          'h-full w-full rounded-md border border-input',
          'pl-8 pr-2.5 py-1 text-[13px]',
          'bg-transparent ring-offset-background',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          'text-transparent caret-foreground'
        )"
      />

      <div :class="cn('absolute right-2 flex items-center pointer-events-none')">
        <KeyboardShortcut shortcut="/" />
      </div>
    </div>

    <FilterSuggestions
      :show="showSuggestions"
      :suggestions="suggestions"
      :model-value="modelValue"
      @select="handleSuggestionSelect"
      @remove="handleRemoveFilter"
      @close="closeMenu"
    />
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
