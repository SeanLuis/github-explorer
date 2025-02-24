<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { ref, watch, onMounted, computed } from 'vue'
import { GitHubService } from '~/services/github'
import { useSchemaOrg, defineWebPage } from '#imports'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components'
import { OrderOptions, SortOptions } from '~/types'
import FilterInput from '~/components/ui/search/FilterInput.vue'

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
      target: 'https://github-explorer.nuxt.dev/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  })
])

const store = useGithubStore()
const searchQuery = ref('')
interface Filters {
  language: string;
  topics: string[];
  minStars: number;
  hasTests: boolean;
  isTemplate: boolean;
  createdAfter: Date | null;
}

const filters = ref<Filters>({
  language: 'all',
  topics: [],
  minStars: 1000,
  hasTests: false,
  isTemplate: false,
  createdAfter: null
})
const selectedLanguage = ref<string>('all')
const languages = ref(GitHubService.getLanguages())

const onSearch = (query: string) => {
  store.searchRepositories({
    query: query,
    language: selectedLanguage.value === 'all' ? undefined : selectedLanguage.value,
    minStars: filters.value.minStars
  })
}

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
    sort: SortOptions.STARS,
    order: OrderOptions.DESC
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
    if (key === 'minStars') return typeof value === 'number' && value > 1000
    return value
  })
})

const clearFilter = (key: keyof Filters) => {
  switch(key) {
    case 'language':
      filters.value.language = 'all'
      break;
    case 'topics':
      filters.value.topics = []
      break;
    case 'minStars':
      filters.value.minStars = 1000
      break;
    case 'hasTests':
    case 'isTemplate':
      filters.value[key] = false
      break;
    case 'createdAfter':
      filters.value.createdAfter = null
      break;
  }
  onFiltersApply()
}


const filter = ref('')
const keywords = ['is:issue', 'is:open', 'label:bug', 'author:octocat']
</script>

<template>
  <div>
    <section class="text-center py-16 mb-8 border rounded-xl bg-gradient-to-br from-primary/5 to-background relative">
      <!-- Removido overflow-hidden de la section y movido solo al div del patrón -->
      <div class="absolute inset-0 bg-grid-pattern opacity-10 overflow-hidden" />
      
      <div class="relative px-4 sm:px-6">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Discover Amazing Open Source Projects
        </h1>
        <p class="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore thousands of open source projects, find new tools, libraries and frameworks.
        </p>
        
        <div class="max-w-4xl mx-auto space-y-4">
          <div class="flex flex-col sm:flex-row gap-4 px-2 sm:px-0">
            <div class="relative flex-1">
              <FilterInput
                v-model="filter"
                :keywords="keywords"
                placeholder="Search repositories..."
                class="h-9"
                @search="onSearch"
              />
            </div>

            <div class="flex gap-2 shrink-0">
              <Select v-model:model-value="selectedLanguage">
                <SelectTrigger class="w-[180px]">
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
            class="flex flex-wrap gap-2 mt-4 px-2 sm:px-0"
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
                @click="clearFilter(key as keyof Filters)"
              >
                <Icon name="octicon:x-16" class="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        </div>
      </div>
    </section>

    <div class="px-4 sm:px-6">
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
