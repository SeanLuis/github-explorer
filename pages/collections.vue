<script setup lang="ts">
import { CollectionService } from '~/services/collections'

const collections = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    collections.value = await CollectionService.generateCollections()
  } catch (error) {
    console.error('Error loading collections:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <section class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">Collections</h1>
      <p class="text-lg text-muted-foreground">
        Curated lists of repositories for different purposes
      </p>
    </section>

    <div v-if="loading" class="flex justify-center py-8">
      <div class="flex items-center gap-2 text-github-muted">
        <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>Loading collections...</span>
      </div>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card
        v-for="collection in collections"
        :key="collection.id"
        class="hover:bg-muted/50 cursor-pointer transition-colors"
        @click="navigateTo(`/collections/${collection.id}`)"
      >
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            <Icon :name="collection.icon" class="h-5 w-5" />
            {{ collection.title }}
          </CardTitle>
          <CardDescription>
            {{ collection.description }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="repo in collection.repos"
              :key="repo.full_name"
              class="flex items-center gap-2 text-sm"
            >
              <Icon name="octicon:repo-16" class="h-4 w-4" />
              {{ repo.full_name }}
              <span class="text-xs text-muted-foreground">
                ({{ repo.stargazers_count }} ★)
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p class="text-sm text-muted-foreground">
            {{ collection.repos.length }} repositories
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
