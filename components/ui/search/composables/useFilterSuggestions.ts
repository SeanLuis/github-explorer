import { ref } from 'vue'

export interface FilterSuggestion {
  prefix: string
  label: string
  icon: string
}

export const useFilterSuggestions = () => {
  const suggestions = ref<FilterSuggestion[]>([
    { prefix: 'repo:', label: 'Repository (user/repo)', icon: 'octicon:repo-16' },
    { prefix: 'user:', label: 'User', icon: 'octicon:person-16' },
    { prefix: 'org:', label: 'Organization', icon: 'octicon:organization-16' },
    { prefix: 'in:', label: 'Search in', icon: 'octicon:search-16' },
    { prefix: 'size:', label: 'Size', icon: 'octicon:file-16' },
    { prefix: 'stars:', label: 'Stars', icon: 'octicon:star-16' },
    { prefix: 'language:', label: 'Language', icon: 'octicon:code-16' },
    { prefix: 'created:', label: 'Created date', icon: 'octicon:calendar-16' },
    { prefix: 'pushed:', label: 'Push date', icon: 'octicon:git-commit-16' },
    { prefix: 'topic:', label: 'Topic', icon: 'octicon:hash-16' },
    { prefix: 'is:', label: 'State', icon: 'octicon:circle-16' },
    { prefix: 'fork:', label: 'Fork', icon: 'octicon:repo-forked-16' }
  ])

  const usedFilters = ref<string[]>([])

  const addUsedFilter = (filter: string) => {
    if (!usedFilters.value.includes(filter)) {
      usedFilters.value.unshift(filter)
      if (usedFilters.value.length > 5) usedFilters.value.pop()
    }
  }

  const getMatchingSuggestions = (query: string): FilterSuggestion[] => {
    const lastWord = query.split(' ').pop()?.toLowerCase() || ''
    if (!lastWord) return suggestions.value
    return suggestions.value.filter(s => 
      s.prefix.toLowerCase().includes(lastWord) || 
      s.label.toLowerCase().includes(lastWord)
    )
  }

  const isValidFilter = (text: string): boolean => {
    return suggestions.value.some(s => text.startsWith(s.prefix))
  }

  return {
    suggestions,
    usedFilters,
    addUsedFilter,
    getMatchingSuggestions,
    isValidFilter
  } as const
}
