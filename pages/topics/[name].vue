<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { useDebounceFn } from '@vueuse/core'
import { GitHubService } from '../../services/github';

const route = useRoute()
const store = useGithubStore()
const searchQuery = ref('')
const selectedLanguage = ref('all')
const languages = ref(GitHubService.getLanguages())

const topicName = computed(() => route.params.name as string)

const debouncedSearch = useDebounceFn(() => {
  store.searchRepositories({
    query: `${searchQuery.value} topic:${topicName.value}`,
    language: selectedLanguage.value === 'all' ? undefined : selectedLanguage.value,
    minStars: 100
  })
}, 500)

watch([searchQuery, selectedLanguage], () => {
  debouncedSearch()
})

onMounted(() => {
  // Búsqueda inicial para el tópico
  store.searchRepositories({
    query: `topic:${topicName.value}`,
    sort: 'stars',
    order: 'desc'
  })
})

const loadMore = () => {
  store.loadNextPage()
}
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center py-12 mb-8 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        {{ topicName }}
      </h1>
      <p class="text-lg text-muted-foreground mb-8">
        Explore repositories tagged with #{{ topicName }}
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
            placeholder="Search repositories in this topic..."
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
        v-if="!store.loading && store.hasMorePages" 
        class="flex justify-center py-8"
      >
        <Button @click="loadMore">
          Load More Results
        </Button>
      </div>
    </div>
  </div>
</template>
