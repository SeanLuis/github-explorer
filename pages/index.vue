<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { useDebounceFn } from '@vueuse/core'
import { ref, watch, onMounted } from 'vue'
import { GitHubService } from '~/services/github'

const store = useGithubStore()
const searchQuery = ref('')
const filters = ref({
  language: '',
  topics: [],
  minStars: 1000,
  hasTests: false,
  isTemplate: false,
  createdAfter: null
})
const selectedLanguage = ref('')

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

onMounted(() => {
  // Cargar repositorios iniciales
  store.searchRepositories({ 
    minStars: 1000,
    sort: 'stars',
    order: 'desc'
  })
})
</script>

<template>
  <div>
    <!-- Hero Section con búsqueda y filtros -->
    <section class="text-center py-12 mb-8 bg-white dark:bg-github-dark-secondary rounded-lg border border-[#d0d7de] dark:border-github-border">
      <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        Discover Amazing Open Source Projects
      </h1>
      
      <div class="max-w-4xl mx-auto space-y-4">
        <div class="flex gap-2">
          <div class="relative flex-1">
            <Icon 
              name="octicon:search-16"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              v-model="searchQuery"
              type="search"
              placeholder="Search repositories..."
              class="w-full pl-12"
            />
          </div>
          <FiltersDialog
            v-model="filters"
            @apply="onFiltersApply"
          />
        </div>
        
        <!-- Language Filter -->
        <select
          v-model="selectedLanguage"
          class="w-full p-2 border rounded-md"
        >
          <option value="">All Languages</option>
          <option 
            v-for="lang in GitHubService.getLanguages()"
            :key="lang" 
            :value="lang"
          >
            {{ lang }}
          </option>
        </select>

        <!-- Active Filters -->
        <div v-if="Object.values(filters).some(v => v)" class="flex flex-wrap gap-2">
          <Badge 
            v-if="filters.language"
            variant="secondary"
            class="flex items-center gap-1"
          >
            Language: {{ filters.language }}
            <Button
              variant="ghost"
              size="icon"
              class="h-4 w-4"
              @click="filters.language = ''"
            >
              <Icon name="octicon:x-16" />
            </Button>
          </Badge>
          
          <Badge 
            v-for="topic in filters.topics"
            :key="topic"
            variant="secondary"
            class="flex items-center gap-1"
          >
            {{ topic }}
            <Button
              variant="ghost"
              size="icon"
              class="h-4 w-4"
              @click="filters.topics = filters.topics.filter(t => t !== topic)"
            >
              <Icon name="octicon:x-16" />
            </Button>
          </Badge>
          
          <!-- Add more active filters badges -->
        </div>
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
