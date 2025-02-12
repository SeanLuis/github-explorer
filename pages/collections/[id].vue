<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { useDebounceFn } from '@vueuse/core'
import { CollectionService } from '~/services/collections'
import { GitHubService } from '../../services/github';
import { useCollectionsStore } from '~/stores/collections'

const route = useRoute()
const store = useGithubStore()
const collectionsStore = useCollectionsStore()
const searchQuery = ref('')
const selectedLanguage = ref('all')
const languages = ref(GitHubService.getLanguages())
const collection = ref<ICollection | null>(null)

const debouncedSearch = useDebounceFn(() => {
  const query = CollectionService.getQueryForCollection(route.params.id as CollectionId)
  store.searchRepositories({
    query: `${searchQuery.value} ${query}`,
    language: selectedLanguage.value === 'all' ? undefined : selectedLanguage.value
  })
}, 500)

watch([searchQuery, selectedLanguage], () => {
  debouncedSearch()
})

onMounted(async () => {
  // Primero intentamos obtener la colección del store
  let currentCollection = collectionsStore.getCollectionById(route.params.id as string)
  
  // Si no existe en el store, cargamos todas las colecciones
  if (!currentCollection) {
    await collectionsStore.fetchCollections()
    currentCollection = collectionsStore.getCollectionById(route.params.id as string)
  }
  
  collection.value = currentCollection || null
  
  if (collection.value) {
    const query = CollectionService.getQueryForCollection(route.params.id as CollectionId)
    store.searchRepositories({ query })
  }
})

const loadMore = () => {
  store.loadNextPage()
}
</script>

<template>
  <div v-if="collection" class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center py-12 mb-8 border rounded-lg bg-card text-card-foreground">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        {{ collection.title }}
      </h1>
      <p class="text-lg text-muted-foreground mb-8">
        {{ collection.description }}
      </p>

      <div class="max-w-4xl mx-auto space-y-4">
        <!-- Search y Filters Container -->
        <div class="flex flex-col sm:flex-row gap-4">
          <!-- Search Bar - Ocupa más espacio -->
          <div class="relative flex-1">
            <Icon 
              name="octicon:search-16"
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10"
            />
            <Input
              v-model="searchQuery"
              type="search"
              placeholder="Search in this collection..."
              class="w-full pl-12"
            />
          </div>

          <div class="relative">
          <!-- Language Filter - Más compacto -->
          <Select v-model="selectedLanguage" class="w-[180px] shrink-0">
            <SelectTrigger>
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
        </div>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <div>
      <!-- No Results Message -->
      <div 
        v-if="!store.loading && store.repositories.length === 0" 
        class="text-center py-8"
      >
        <div class="flex flex-col items-center gap-2 text-muted-foreground">
          <Icon name="octicon:search-24" class="h-12 w-12" />
          <p class="text-lg">No repositories found matching your criteria</p>
          <p class="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>

      <!-- Results Grid -->
      <div 
        v-else 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <RepositoryCard
          v-for="repo in store.repositories"
          :key="repo.id"
          :repository="repo"
          @preview="navigateTo(`/repository/${repo.full_name}`)"
        />
      </div>

      <!-- Loading State -->
      <div 
        v-if="store.loading" 
        class="flex justify-center py-8"
      >
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading repositories...</span>
        </div>
      </div>

      <!-- Load More Button -->
      <div 
        v-if="!store.loading && store.hasMorePages && store.repositories.length > 0" 
        class="flex justify-center py-8"
      >
        <Button @click="loadMore">
          Load More Results
        </Button>
      </div>

      <!-- End of Results Message -->
      <div 
        v-if="!store.loading && !store.hasMorePages && store.repositories.length > 0" 
        class="text-center py-8 text-muted-foreground"
      >
        That's all we have for now! ✨
      </div>
    </div>
  </div>

  <!-- Loading Collection State -->
  <div 
    v-else 
    class="flex justify-center items-center min-h-[50vh]"
  >
    <div class="flex items-center gap-2">
      <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      <span>Loading collection...</span>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
