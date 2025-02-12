<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { useDebounceFn } from '@vueuse/core'
import { CollectionService } from '~/services/collections'
import { GitHubService } from '../../services/github';

const route = useRoute()
const store = useGithubStore()
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
  // Cargar datos de la colección
  const collections = await CollectionService.generateCollections()
  collection.value = collections.find(c => c.id === route.params.id)
  
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
    <section class="text-center py-12 mb-8 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        {{ collection.title }}
      </h1>
      <p class="text-lg text-muted-foreground mb-8">
        {{ collection.description }}
      </p>

      <div class="max-w-4xl mx-auto space-y-4">
        <!-- Search Bar -->
        <div class="relative">
          <Icon 
            name="octicon:search-16"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            v-model="searchQuery"
            type="search"
            placeholder="Search in this collection..."
            class="w-full pl-12"
          />
        </div>

        <!-- Language Filter -->
        <Select v-model:model-value="selectedLanguage">
          <SelectTrigger class="w-full">
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

      <!-- Estados de carga y botones similares a topics/[name].vue -->
      <!-- ...existing code... -->
    </div>
  </div>
</template>
