<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import { GitHubService } from '~/services/github'
import { getGradientFromString } from '~/utils/gradients'
import RepositoryCard from '~/components/RepositoryCard.vue'

const githubStore = useGithubStore()
const loading = ref(true)
const selectedTimeRange = ref('daily')
const selectedLanguage = ref('all')

const languages = GitHubService.getLanguages()

const timeRanges = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This week' },
  { value: 'monthly', label: 'This month' },
]

// Cargar repositorios trending
onMounted(async () => {
  try {
    await githubStore.loadTrendingRepositories()
  } catch (error) {
    console.error('Error loading trending repositories:', error)
  } finally {
    loading.value = false
  }
})

// Filtrar por lenguaje
watch(selectedLanguage, async (newLanguage) => {
  loading.value = true
  try {
    await githubStore.searchRepositories({
      language: newLanguage === 'all' ? undefined : newLanguage
    })
  } finally {
    loading.value = false
  }
})

// SEO
useHead({
  title: 'Trending Repositories - GitHub Explorer',
  meta: [
    {
      name: 'description',
      content: 'Discover trending repositories on GitHub. See what the community is excited about today.'
    }
  ]
})

// Schema.org
useSchemaOrg([
  defineWebPage({
    name: 'Trending Repositories - GitHub Explorer',
    description: 'Discover trending repositories on GitHub',
  })
])
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center py-16 mb-8 border rounded-xl bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div class="relative">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Trending Repositories
        </h1>
        <p class="text-lg text-muted-foreground mx-auto max-w-2xl">
          See what the GitHub community is most excited about today.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div class="flex gap-4 w-full sm:w-auto">
        <Select
          v-model="selectedTimeRange"
          class="w-full sm:w-[180px]"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Timeframe</SelectLabel>
              <SelectItem
                v-for="range in timeRanges"
                :key="range.value"
                :value="range.value"
              >
                {{ range.label }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          v-model="selectedLanguage"
          class="w-full sm:w-[180px]"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Language</SelectLabel>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem
                v-for="lang in languages"
                :key="lang"
                :value="lang"
              >
                {{ lang }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </section>

    <!-- Repository List -->
    <section class="space-y-4">
      <LoadingRepositories v-if="loading" />

      <div v-else-if="githubStore.repositories.length === 0" class="text-center py-8">
        <p class="text-muted-foreground">No repositories found</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RepositoryCard
          v-for="repo in githubStore.repositories"
          :key="repo.id"
          :repository="repo"
          @preview="navigateTo(`/repository/${repo.full_name}`)"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0);
  background-size: 24px 24px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
