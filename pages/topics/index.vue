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
</script>

<template>
  <div class="space-y-8">
    <section class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">Topics</h1>
      <p class="text-lg text-muted-foreground">
        Browse popular topics in the GitHub community
      </p>
    </section>

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
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
