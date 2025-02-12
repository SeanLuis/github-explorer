<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { useDebounceFn } from '@vueuse/core'
import { ref, watch, onMounted, computed } from 'vue'
import { GitHubService } from '~/services/github'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components'

// Agregar meta tags dinámicos
useSeoMeta({
  title: 'GitHub Open Source Explorer - Discover Amazing Projects',
  description: 'Explore thousands of open source projects, find new tools, libraries and frameworks on GitHub.',
  ogTitle: 'GitHub Open Source Explorer',
  ogDescription: 'Discover amazing open source projects on GitHub',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'SearchResultsPage',
    name: 'GitHub Open Source Explorer',
    description: 'Discover amazing open source projects on GitHub',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://github-explorer.nuxt.dev'}/search?q={search_term_string}`,
        actionPlatform: 'http://schema.org/WebSite'
      },
      'query-input': {
        '@type': 'PropertyValueSpecification',
        valueRequired: true,
        valueName: 'search_term_string'
      }
    }
  })
])

const store = useGithubStore()
const searchQuery = ref('')
const filters = ref({
  language: 'all',
  topics: [] as string[],
  minStars: 1000,
  hasTests: false,
  isTemplate: false,
  createdAfter: null as Date | null
})
const selectedLanguage = ref<string>('all')
const languages = ref(GitHubService.getLanguages())

const debouncedSearch = useDebounceFn(() => {
  if (!searchQuery.value && !selectedLanguage.value) return
  
  store.searchRepositories({
    query: searchQuery.value,
    language: selectedLanguage.value,
    minStars: 100
  })
}, 500)

watch([searchQuery, selectedLanguage], () => {
  debouncedSearch()
})

const onFiltersApply = () => {
  const searchParams = {
    query: searchQuery.value,
    language: filters.value.language === 'all' ? undefined : filters.value.language,
    topics: filters.value.topics,
    minStars: filters.value.minStars,
    hasTests: filters.value.hasTests,
    isTemplate: filters.value.isTemplate
  }
  
  console.log('Applying filters:', searchParams)
  store.searchRepositories(searchParams)
}

const loadMore = () => {
  store.loadNextPage()
}

const onLanguageChange = (value: string) => {
  store.searchRepositories({
    query: searchQuery.value,
    language: value === 'all' ? undefined : value,
    minStars: 100
  })
}

watch(selectedLanguage, (newValue) => {
  filters.value.language = newValue
  onFiltersApply()
})

onMounted(() => {
  store.searchRepositories({ 
    minStars: 1000,
    sort: 'stars',
    order: 'desc'
  })
})

const formatFilterValue = (key: string, value: any): string => {
  if (key === 'minStars') return `${value}+ stars`
  if (key === 'language') return value
  if (key === 'hasTests') return 'Has tests'
  if (key === 'isTemplate') return 'Is template'
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

const activeFilters = computed(() => {
  return Object.entries(filters.value).filter(([key, value]) => {
    if (key === 'language') return value !== 'all'
    if (Array.isArray(value)) return value.length > 0
    if (key === 'minStars') return value > 1000
    return value
  })
})

const clearFilter = (key: string) => {
  if (key === 'language') {
    filters.value[key] = 'all'
  } else if (Array.isArray(filters.value[key])) {
    filters.value[key] = []
  } else if (key === 'minStars') {
    filters.value[key] = 1000
  } else if (typeof filters.value[key] === 'boolean') {
    filters.value[key] = false
  } else {
    filters.value[key] = null
  }
  onFiltersApply()
}
</script>

<template>
  <div>
    <section class="text-center py-16 mb-8 border rounded-xl bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div class="relative">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Discover Amazing Open Source Projects
        </h1>
        <p class="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore thousands of open source projects, find new tools, libraries and frameworks.
        </p>
        
        <div class="max-w-4xl mx-auto space-y-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative flex-1">
              <Icon 
                name="octicon:search-16"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                v-model="searchQuery"
                type="search"
                placeholder="Search repositories..."
                class="w-full pl-12"
              />
            </div>

            <div class="flex gap-2 shrink-0">
              <Select v-model:model-value="selectedLanguage">
                <SelectTrigger class="w-[180px]"> <!-- Ancho fijo para el trigger -->
                  <SelectValue :placeholder="selectedLanguage || 'Select Language'" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Language</SelectItem>
                  <SelectItem 
                    v-for="lang in languages" 
                    :key="lang" 
                    :value="lang"
                  >
                    {{ lang }}
                  </SelectItem>
                </SelectContent>
              </Select>

              <FiltersDialog
                v-model="filters"
                @apply="onFiltersApply"
              />
            </div>
          </div>

          <div 
            v-if="activeFilters.length > 0"
            class="flex flex-wrap gap-2 mt-4"
          >
            <Badge 
              v-for="[key, value] in activeFilters" 
              :key="key"
              variant="secondary"
              class="flex items-center gap-1"
            >
              {{ formatFilterValue(key, value) }}
              <Button
                variant="ghost"
                size="icon"
                class="h-4 w-4 hover:bg-destructive/20"
                @click="clearFilter(key)"
              >
                <Icon name="octicon:x-16" class="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        </div>
      </div>
    </section>

    <div>
      <LoadingRepositories v-if="store.loading" />

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RepositoryCard
            v-for="repo in store.repositories"
            :key="repo.id"
            :repository="repo"
            @preview="navigateTo(`/repository/${repo.full_name}`)"
          />
        </div>

        <div 
          v-if="store.hasMorePages" 
          class="flex justify-center py-8"
        >
          <Button @click="loadMore">
            Load More Results
          </Button>
        </div>

        <div 
          v-if="!store.loading && !store.hasMorePages && store.repositories.length > 0" 
          class="text-center py-8 text-github-muted"
        >
          That's all we have for now! ✨
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.bg-grid-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0);
  background-size: 24px 24px;
}
</style>
