<script setup lang="ts">
import { useCollectionsStore } from '~/stores/collections'

const collectionsStore = useCollectionsStore()
const featuredCollections = computed(() => 
  collectionsStore.collections.filter(c => 
    ['ai-frameworks', 'web-frameworks', 'developer-tools', 'data-science', 'devops-tools', 'mobile-frameworks']
    .includes(c.id)
  )
)
const otherCollections = computed(() => 
  collectionsStore.collections.filter(c => !featuredCollections.value.includes(c))
)

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

onMounted(async () => {
  await collectionsStore.fetchCollections()
})

// Agregar meta tags dinámicos
useSeoMeta({
  title: 'Collections - GitHub Open Source Explorer',
  description: 'Discover curated sets of repositories organized by purpose, technology, and domain.',
  ogTitle: 'GitHub Collections',
  ogDescription: 'Find the perfect tools for your next project with our curated collections',
  twitterCard: 'summary_large_image',
})

useSchemaOrg([
  defineWebPage({
    name: 'Collections - GitHub Open Source Explorer',
    description: 'Discover curated sets of repositories organized by purpose, technology, and domain.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: featuredCollections.value.map((collection, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.description,
          url: `/collections/${collection.id}`
        }
      }))
    }
  })
])
</script>

<template>
  <div class="space-y-8">
    <section class="text-center py-16 mb-8 border rounded-xl bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div class="relative">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Collections
        </h1>
        <p class="text-lg text-muted-foreground mx-auto max-w-2xl">
          Discover curated sets of repositories organized by purpose, 
          technology, and domain. Find the perfect tools for your next project.
        </p>
      </div>
    </section>

    <div v-if="collectionsStore.loading" class="flex justify-center py-8">
      <div class="flex items-center gap-2 text-muted-foreground">
        <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>Loading collections...</span>
      </div>
    </div>

    <template v-else>
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold tracking-tight">Featured Collections</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="collection in featuredCollections"
            :key="collection.id"
            class="group hover: transition-all duration-300 overflow-hidden cursor-pointer"
            @click="navigateTo(`/collections/${collection.id}`)"
          >
            <div class="relative">
              <div 
                class="h-32 bg-gradient-to-r w-full transition-all duration-300 group-hover:scale-105"
                :class="getGradient(collection.id)"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <Icon 
                  :name="collection.icon" 
                  class="h-16 w-16 text-white transform transition-all duration-300 group-hover:scale-110" 
                />
              </div>
            </div>

            <CardHeader>
              <CardTitle>{{ collection.title }}</CardTitle>
              <CardDescription class="line-clamp-2">
                {{ collection.description }}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div class="space-y-2">
                <div
                  v-for="repo in collection.repos.slice(0, 3)"
                  :key="repo.full_name"
                  class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Icon name="octicon:repo-16" class="h-4 w-4 shrink-0" />
                  <span class="truncate">{{ repo.full_name }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section class="space-y-4">
        <h2 class="text-2xl font-semibold tracking-tight">All Collections</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            v-for="collection in otherCollections"
            :key="collection.id"
            variant="outline"
            class="justify-start h-auto p-4 group hover:border-primary"
            @click="navigateTo(`/collections/${collection.id}`)"
          >
            <div class="flex flex-col items-start gap-2 w-full">
              <div class="flex items-center gap-2 font-medium">
                <Icon 
                  :name="collection.icon" 
                  class="h-5 w-5 transition-colors group-hover:text-primary" 
                />
                {{ collection.title }}
              </div>
              <p class="text-sm text-muted-foreground text-left line-clamp-2">
                {{ collection.description }}
              </p>
            </div>
          </Button>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.bg-grid-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0);
  background-size: 24px 24px;
}
</style>
