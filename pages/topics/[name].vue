<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { useDebounceFn } from '@vueuse/core'
import { GitHubService } from '../../services/github'

const route = useRoute()
const store = useGithubStore()
const searchQuery = ref('')
const selectedLanguage = ref('all')
const languages = ref(GitHubService.getLanguages())
const topic = ref({
  name: '',
  description: '',
  icon: 'carbon:hashtag',
  gradient: 'from-gray-500/90 to-slate-500/90'
})

const topicName = computed(() => route.params.name as string)

onMounted(async () => {
  const topics = await GitHubService.getPopularTopics()
  const foundTopic = topics.find(t => t.name === topicName.value)
  
  if (foundTopic) {
    topic.value = foundTopic
  } else {
    topic.value = {
      name: topicName.value,
      description: `Explore repositories tagged with #${topicName.value}`,
      icon: 'carbon:hashtag',
      gradient: 'from-gray-500/90 to-slate-500/90'
    }
  }
  
  store.searchRepositories({
    query: `topic:${topicName.value}`,
    sort: 'stars',
    order: 'desc'
  })
})

const debouncedSearch = useDebounceFn(() => {
  if (!searchQuery.value && selectedLanguage.value === 'all') {
    store.searchRepositories({
      query: `topic:${topicName.value}`,
      sort: 'stars',
      order: 'desc'
    })
    return
  }

  let query = `topic:${topicName.value}`
  if (searchQuery.value) {
    query += ` ${searchQuery.value}`
  }

  store.searchRepositories({
    query,
    language: selectedLanguage.value === 'all' ? undefined : selectedLanguage.value
  })
}, 500)

watch([searchQuery, selectedLanguage], debouncedSearch)

const loadMore = () => {
  store.loadNextPage()
}

// Add Schema.org data for topic page
watch(topic, (currentTopic) => {
  if (currentTopic) {
    useSchemaOrg([
      defineWebPage({
        name: `${currentTopic.name} Projects - GitHub Open Source Explorer`,
        description: currentTopic.description,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: store.repositories.map((repo, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'SoftwareSourceCode',
              name: repo.name,
              description: repo.description,
              url: `/repository/${repo.full_name}`
            }
          }))
        }
      })
    ])

    // Meta tags dinámicos
    useSeoMeta({
      title: `${currentTopic.name} Projects - GitHub Topics`,
      description: currentTopic.description,
      ogTitle: `${currentTopic.name} - GitHub Topic Explorer`,
      ogDescription: currentTopic.description,
      twitterCard: 'summary_large_image',
    })
  }
})
</script>

<template>
  <div class="space-y-8">
    <section class="relative overflow-hidden rounded-xl bg-card">
      <div 
        class="absolute inset-0 bg-gradient-to-r opacity-90 transition-opacity duration-300"
        :class="topic?.gradient"
      />
      
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,...');" />
      </div>

      <div class="relative px-6 py-24 sm:px-12 sm:py-32">
        <div class="mx-auto max-w-4xl text-center">
          <div class="mb-8 flex justify-center">
            <div class="rounded-full bg-white/10 p-4 backdrop-blur-sm">
              <Icon 
                :name="topic.icon || 'carbon:hashtag'"
                class="h-16 w-16 text-white"
              />
            </div>
          </div>

          <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            #{{ topicName }}
          </h1>
          <p class="mt-6 text-xl text-white/90">
            {{ topic?.description || `Explore repositories tagged with #${topicName}` }}
          </p>

          <div class="mt-10 flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto">
            <div class="relative flex-1">
              <div class="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg" />
              <Input
                v-model="searchQuery"
                type="search"
                placeholder="Search repositories in this topic..."
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RepositoryCard
          v-for="repo in store.repositories"
          :key="repo.id"
          :repository="repo"
          @click="navigateTo(`/repository/${repo.full_name}`)"
        />
      </div>

      <div 
        v-if="store.loading" 
        class="flex justify-center py-8"
      >
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading repositories...</span>
        </div>
      </div>

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

<style scoped>
.backdrop-blur-md {
  backdrop-filter: blur(12px);
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
