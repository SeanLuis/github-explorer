<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { useDebounceFn } from '@vueuse/core'
import { ref, watch, onMounted } from 'vue'
import { GitHubService } from '~/services/github'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components'

const store = useGithubStore()
const searchQuery = ref('')
const filters = ref({
  language: 'all', // Cambiado de '' a 'all'
  topics: [],
  minStars: 1000,
  hasTests: false,
  isTemplate: false,
  createdAfter: null
})
const selectedLanguage = ref<string>('all') // Cambiado de '' a 'all'
const languages = ref(GitHubService.getLanguages())

// Debounce mejorado para la búsqueda
const debouncedSearch = useDebounceFn(() => {
  if (!searchQuery.value && !selectedLanguage.value) return
  
  store.searchRepositories({
    query: searchQuery.value,
    language: selectedLanguage.value,
    minStars: 100
  })
}, 500)

// Observar cambios en búsqueda y lenguaje
watch([searchQuery, selectedLanguage], () => {
  debouncedSearch()
})

// Aplicar filtros
const onFiltersApply = () => {
  store.searchRepositories({
    query: searchQuery.value,
    ...filters.value
  })
}

// Cargar más resultados
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
  store.searchRepositories({
    query: searchQuery.value,
    language: newValue === 'all' ? undefined : newValue,
    minStars: 100
  })
})

onMounted(() => {
  // Cargar repositorios iniciales
  store.searchRepositories({ 
    minStars: 1000,
    sort: 'stars',
    order: 'desc'
  })
})

const clearFilter = (key: string) => {
  if (Array.isArray(filters.value[key])) {
    filters.value[key] = []
  } else if (key === 'minStars') {
    filters.value[key] = 1000
  } else {
    filters.value[key] = null
  }
  onFiltersApply()
}
</script>

<template>
  <div>
    <!-- Hero Section con búsqueda y filtros -->
    <section class="text-center py-12 mb-8 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Discover Amazing Open Source Projects
      </h1>
      
      <p class="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Explore thousands of open source projects, find new tools, libraries and frameworks.
      </p>
      
      <div class="max-w-4xl mx-auto space-y-4">
        <!-- Search y Filters Container -->
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search Bar - Ahora ocupa el espacio restante -->
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

          <!-- Language Filter y Advanced Filters - Ahora se ajustan a su contenido -->
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

        <!-- Active Filters -->
         <template v-if="filters.length > 0 && Object.values(filters).some(v => v)">
          <div class="flex flex-wrap gap-2">
            <Badge 
              v-for="(v, key) in filters" 
              v-if="v && key !== 'minStars'"
              :key="key"
              variant="secondary"
              class="flex items-center gap-1"
            >
              {{ key }}: {{ Array.isArray(v) ? v.join(', ') : v }}
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
        </template>
      </div>
    </section>

    <!-- Results Section -->
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RepositoryCard
          v-for="repo in store.repositories"
          :key="repo.id"
          :repository="repo"
          @click="navigateTo(`/repository/${repo.full_name}`)"
        />
      </div>

      <!-- Loading State -->
      <div 
        v-if="store.loading" 
        class="flex justify-center py-8"
      >
        <div class="flex items-center gap-2 text-github-muted">
          <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading repositories...</span>
        </div>
      </div>

      <!-- Load More Button -->
      <div 
        v-if="!store.loading && store.hasMorePages" 
        class="flex justify-center py-8"
      >
        <Button @click="loadMore">
          Load More Results
        </Button>
      </div>

      <!-- End Message -->
      <div 
        v-if="!store.loading && !store.hasMorePages && store.repositories.length > 0" 
        class="text-center py-8 text-github-muted"
      >
        That's all we have for now! ✨
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
</style>
