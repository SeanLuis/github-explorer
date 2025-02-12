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
const loading = ref(true)

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
  try {
    let currentCollection = collectionsStore.getCollectionById(route.params.id as string)
    
    if (!currentCollection) {
      await collectionsStore.fetchCollections()
      currentCollection = collectionsStore.getCollectionById(route.params.id as string)
    }
    
    collection.value = currentCollection || null
    
    if (collection.value) {
      const query = CollectionService.getQueryForCollection(route.params.id as CollectionId)
      await store.searchRepositories({ query })
    }
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loading.value = false
  }
})

const loadMore = () => {
  store.loadNextPage()
}

const gradients = {
  'ai-frameworks': 'from-purple-500/90 to-pink-500/90',
  'web-frameworks': 'from-blue-500/90 to-cyan-500/90',
  'developer-tools': 'from-cyan-500/90 to-blue-500/90',
  'data-science': 'from-yellow-500/90 to-orange-500/90',
  'devops-tools': 'from-orange-500/90 to-red-500/90',
  'mobile-frameworks': 'from-indigo-500/90 to-purple-500/90'
}

const getGradient = (id: string) => {
  return gradients[id] || 'from-gray-500/90 to-slate-500/90'
}

// Add Schema.org data for collection
watch(collection, (col) => {
  if (col) {
    useSchemaOrg([
      defineWebPage({
        '@type': 'CollectionPage',
        name: col.title,
        description: col.description,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: col.repos.map((repo, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'SoftwareApplication',
              name: repo.name,
              url: `/repository/${repo.full_name}`
            }
          }))
        }
      })
    ])

    // Meta tags dinámicos
    useSeoMeta({
      title: `${col.title} - Collections | GitHub Open Source Explorer`,
      description: col.description,
      ogTitle: `${col.title} - Open Source Collection`,
      ogDescription: col.description,
      twitterCard: 'summary_large_image',
    })
  }
})
</script>

<template>
  <div v-if="loading" class="py-12">
    <div class="flex flex-col items-center justify-center gap-4">
      <Icon name="octicon:sync-24" class="animate-spin h-8 w-8 text-muted-foreground" />
      <p class="text-muted-foreground">Loading collection details...</p>
    </div>
  </div>

  <div v-else-if="collection" class="space-y-8">
    <section class="relative overflow-hidden rounded-xl bg-card">
      <div 
        class="absolute inset-0 bg-gradient-to-r w-full transition-all duration-300"
        :class="getGradient(collection.id)"
      />
      
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-grid-pattern" />
      </div>

      <div class="relative px-6 py-24 sm:px-12 sm:py-32">
        <div class="mx-auto max-w-4xl text-center">
          <div class="mb-8 flex justify-center">
            <div class="rounded-full bg-white/10 p-4 backdrop-blur-sm">
              <Icon 
                :name="collection.icon || 'carbon:collection'"
                class="h-16 w-16 text-white"
              />
            </div>
          </div>

          <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {{ collection.title }}
          </h1>
          <p class="mt-6 text-xl text-white/90">
            {{ collection.description }}
          </p>

          <div class="mt-10 flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto">
            <div class="relative flex-1">
              <div class="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg" />
              <Input
                v-model="searchQuery"
                type="search"
                placeholder="Search in this collection..."
                class="w-full pl-12 bg-white/5 border-white/20 text-white placeholder:text-white/60 relative z-10"
              />
              <Icon 
                name="octicon:search-16"
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 z-20"
              />
            </div>

            <div class="relative">
              <Select v-model="selectedLanguage" class="w-[180px] shrink-0">
                <SelectTrigger class="bg-white/5 border-white/20 text-white backdrop-blur-md relative z-10">
                  <SelectValue placeholder="Language" />
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
      </div>
    </section>

    <div>
      <!-- No Result Message -->
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

      <LoadingRepositories v-if="store.loading" />

      <div 
        v-if="!store.loading && store.hasMorePages && store.repositories.length > 0" 
        class="flex justify-center py-8"
      >
        <Button @click="loadMore">
          Load More Results
        </Button>
      </div>

      <div 
        v-if="!store.loading && !store.hasMorePages && store.repositories.length > 0" 
        class="text-center py-8 text-muted-foreground"
      >
        That's all we have for now! ✨
      </div>
    </div>
  </div>

  <LoadingRepositories v-else />
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

.backdrop-blur-md {
  backdrop-filter: blur(12px);
}

.bg-grid-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0);
  background-size: 24px 24px;
}

@media (max-width: 640px) {
  .flex-col > * {
    width: 100%;
  }
}

.z-10 {
  isolation: isolate;
}
</style>
