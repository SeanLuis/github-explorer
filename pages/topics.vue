<script setup lang="ts">
import { GitHubService } from '../services/github';

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
</script>

<template>
  <div class="space-y-8">
    <section class="space-y-4">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight">Topics</h1>
      <p class="text-lg text-muted-foreground">
        Browse popular topics on GitHub
      </p>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold tracking-tight">Featured Topics</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          v-for="topic in featuredTopics"
          :key="topic.name"
          class="hover:bg-muted/50 cursor-pointer transition-colors"
          @click="navigateTo(`/topics/${topic.name}`)"
        >
          <CardHeader>
            <CardTitle>
              <div class="flex items-center gap-2">
                <Icon name="octicon:hash-24" class="h-5 w-5" />
                {{ topic.name }}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-sm text-muted-foreground">{{ topic.description }}</p>
            <p class="text-sm mt-2">{{ topic.count }} repositories</p>
          </CardContent>
        </Card>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-2xl font-semibold tracking-tight">All Topics</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Button
          v-for="topic in otherTopics"
          :key="topic.name"
          variant="outline"
          class="justify-start"
          @click="navigateTo(`/topics/${topic.name}`)"
        >
          <Icon name="octicon:hash-24" class="mr-2 h-4 w-4" />
          {{ topic.name }}
        </Button>
      </div>
    </section>
  </div>
</template>
