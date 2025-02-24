<script setup lang="ts">
import { useFilterSuggestions } from '~/components/ui/search/composables/useFilterSuggestions'
import type { FilterSuggestion } from '~/components/ui/search/composables/useFilterSuggestions'

interface ActiveFilter extends FilterSuggestion {
  value: string
  full: string
}

interface Props {
  show: boolean
  suggestions: FilterSuggestion[]
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'select', value: string): void
  (e: 'remove', filter: string): void
  (e: 'close'): void
}>()

const { suggestions: allSuggestions } = useFilterSuggestions()

const activeFilters = computed<ActiveFilter[]>(() => {
  if (!props.modelValue) return []
  
  const parts = props.modelValue.split(' ')
  return parts
    .map(part => {
      const match = part.match(/^([^:]+):(.+)$/)
      if (match) {
        const [_, prefix, value] = match
        const filterPrefix = `${prefix}:`
        const filter = allSuggestions.value.find(s => s.prefix === filterPrefix)
        if (filter) {
          return {
            ...filter,
            value,
            full: part
          }
        }
      }
      return null
    })
    .filter((f): f is ActiveFilter => f !== null)
})

const availableFilters = computed(() => {
  const usedPrefixes = new Set(activeFilters.value.map(f => f.prefix))
  return props.suggestions.filter(s => !usedPrefixes.has(s.prefix))
})

const menuRef = ref<HTMLDivElement | null>(null)

onClickOutside(menuRef, () => {
  emit('close')
})
</script>

<template>
  <div
    v-if="show"
    ref="menuRef"
    class="absolute left-0 top-full mt-1 w-full rounded-md border bg-popover shadow-md z-50"
  >
    <!-- Filtros activos -->
    <div v-if="activeFilters.length" class="p-1.5 border-b">
      <div class="text-[10px] font-medium text-muted-foreground mb-1">Active filters</div>
      <div class="space-y-0.5">
        <div
          v-for="filter in activeFilters"
          :key="filter.prefix"
          class="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm bg-accent/20 group"
        >
          <Icon :name="filter.icon" class="h-3 w-3 text-muted-foreground" />
          <div class="flex items-center gap-1 min-w-0">
            <span class="font-medium text-xs whitespace-nowrap">{{ filter.prefix }}</span>
            <span class="text-xs text-accent-foreground truncate">{{ filter.value }}</span>
          </div>
          <button 
            @click="emit('remove', filter.full)"
            class="ml-auto opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity shrink-0"
          >
            <Icon name="octicon:x-16" class="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de filtros disponibles -->
    <div class="p-1.5 space-y-0.5">
      <div class="text-[10px] font-medium text-muted-foreground mb-1">Available filters</div>
      <button
        v-for="item in availableFilters"
        :key="item.prefix"
        @click="emit('select', item.prefix)"
        class="w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm group"
      >
        <Icon :name="item.icon" class="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground/70" />
        <div class="flex items-baseline justify-between w-full">
          <span class="font-medium">{{ item.prefix }}</span>
          <span class="text-xs text-muted-foreground group-hover:text-accent-foreground/70">
            {{ item.label }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>
