<script setup lang="ts">
import { useGithubStore } from '~/stores/github'
import type { IAdvancedFilters } from '~/types'

const store = useGithubStore()

const filters = ref<IAdvancedFilters>({
  language: undefined,
  minStars: undefined,
  hasTopics: [],
  hasLicense: true
})

onMounted(() => {
  store.searchRepositories(filters.value)
})
</script>

<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight mb-2">
        Explore Open Source Projects
      </h1>
      <p class="text-github-muted">
        Discover and explore amazing open source projects from the GitHub community
      </p>
    </div>

    <!-- Filters Section -->
    <Card class="mb-6">
      <CardContent class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Language</Label>
            <Select v-model="filters.language">
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <!-- Add more languages -->
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Minimum Stars</Label>
            <Input 
              type="number" 
              v-model="filters.minStars" 
              placeholder="Min stars"
            />
          </div>

          <!-- Add more filters -->
        </div>
      </CardContent>
    </Card>

    <!-- Results Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RepositoryCard
        v-for="repo in store.repositories"
        :key="repo.id"
        :repository="repo"
        @click="navigateTo(`/repository/${repo.full_name}`)"
      />
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="flex justify-center py-8">
      <div class="relative w-10 h-10">
        <div class="absolute w-10 h-10 border-4 border-github-muted rounded-full"></div>
        <div class="absolute w-10 h-10 border-4 border-github-link rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>

    <!-- Error State -->
    <Alert v-if="store.error" variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{{ store.error }}</AlertDescription>
    </Alert>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
