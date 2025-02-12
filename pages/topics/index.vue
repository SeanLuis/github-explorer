<script setup lang="ts">
import { GitHubService } from '~/services/github';

const topics = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    topics.value = await GitHubService.getPopularTopics()
  } catch (error) {
    console.error('Error loading topics:', error)
  } finally {
    loading.value = false
  }
})

const featuredTopics = computed(() => topics.value.filter(t => t.featured))
const otherTopics = computed(() => topics.value.filter(t => !t.featured))

const gradients = {
  'ai': 'from-purple-500/90 to-pink-500/90',
  'web-development': 'from-blue-500/90 to-cyan-500/90',
  'cloud-native': 'from-cyan-500/90 to-blue-500/90',
  'devops': 'from-orange-500/90 to-red-500/90',
  'blockchain': 'from-green-500/90 to-emerald-500/90',
  'mobile': 'from-indigo-500/90 to-purple-500/90',
  'security': 'from-red-500/90 to-orange-500/90',
  'data-science': 'from-yellow-500/90 to-orange-500/90'
}

const getGradient = (topicName: string) => {
  return gradients[topicName] || 'from-gray-500/90 to-slate-500/90'
}

// Add Schema.org data for topics index
useSchemaOrg([
  defineWebPage({
    name: 'Topics - GitHub Open Source Explorer',
    description: 'Browse popular topics in the GitHub community',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: topics.value.map((topic, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'WebPage',
          name: topic.name,
          description: topic.description,
          url: `/topics/${topic.name}`
        }
      }))
    }
  })
])

// Agregar meta tags dinámicos
useSeoMeta({
  title: 'Topics - GitHub Open Source Explorer',
  description: 'Browse popular topics in the GitHub community. Discover repositories organized by technologies, languages, and concepts.',
  ogTitle: 'GitHub Topics Explorer',
  ogDescription: 'Explore open source projects by topic',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <section class="text-center py-16 mb-8 border rounded-xl bg-gradient-to-br from-primary/5 to-background relative overflow-hidden">
      <!-- Patrón de fondo -->
      <div class="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div class="relative">
        <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Topics
        </h1>
        <p class="text-lg text-muted-foreground mx-auto max-w-2xl">
          Browse popular topics in the GitHub community. Discover repositories organized
          by the technologies, languages, and concepts that interest you.
        </p>
      </div>
    </section>

    <div v-if="loading" class="py-12">
      <div class="flex flex-col items-center justify-center gap-4">
        <Icon name="octicon:sync-24" class="animate-spin h-8 w-8 text-muted-foreground" />
        <p class="text-muted-foreground">Loading topics...</p>
      </div>
    </div>

    <template v-else>
      <!-- Featured Topics -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold tracking-tight">Featured Topics</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="topic in featuredTopics"
            :key="topic.name"
            class="group hover: transition-all duration-300 overflow-hidden cursor-pointer"
            @click="navigateTo(`/topics/${topic.name}`)"
          >
            <div class="relative">
              <div 
                class="h-32 bg-gradient-to-r w-full transition-all duration-300 group-hover:scale-105"
                :class="topic.gradient"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <Icon 
                  :name="topic.icon" 
                  class="h-16 w-16 text-white transform transition-all duration-300 group-hover:scale-110" 
                />
              </div>
            </div>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                {{ topic.name }}
              </CardTitle>
              <CardDescription class="line-clamp-2">
                {{ topic.description }}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <!-- All Topics -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold tracking-tight">Explore Topics</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Button
            v-for="topic in otherTopics"
            :key="topic.name"
            variant="outline"
            class="justify-start group hover:border-primary"
            @click="navigateTo(`/topics/${topic.name}`)"
          >
            <Icon 
              name="octicon:hash-24" 
              class="mr-2 h-4 w-4 transition-colors group-hover:text-primary" 
            />
            {{ topic.name }}
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

.bg-grid-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0);
  background-size: 24px 24px;
}
</style>
