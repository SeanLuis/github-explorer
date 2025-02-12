<script setup lang="ts">
import type { IGitHubRepository } from '~/types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '#components'

defineProps<{
  repository: IGitHubRepository
}>()

const emit = defineEmits<{
  (e: 'preview', repo: IGitHubRepository): void
}>()
</script>

<template>
  <Card 
    class="group relative cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/50"
    @click="emit('preview', repository)"
  >
    <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        class="h-8 w-8 hover:bg-accent"
        @click.stop="emit('preview', repository)"
      >
        <Icon name="octicon:project-16" class="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        as="a"
        :href="repository.html_url"
        target="_blank"
        class="h-8 w-8 hover:bg-accent"
        @click.stop
      >
        <Icon name="octicon:link-external-16" class="h-4 w-4" />
      </Button>
    </div>

    <CardHeader>
      <div class="flex items-center gap-3">
        <Avatar>
          <AvatarImage 
            :src="repository.owner.avatar_url" 
            :alt="repository.owner.login"
            loading="lazy"
            onerror="this.src='/default-avatar.png'"
          />
          <AvatarFallback>{{ repository.owner.login.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle class="text-base">{{ repository.name }}</CardTitle>
          <CardDescription>{{ repository.owner.login }}</CardDescription>
        </div>
      </div>
    </CardHeader>
    
    <CardContent>
      <p class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ repository.description }}</p>
      
      <div class="flex flex-wrap gap-2">
        <Badge variant="secondary" class="flex items-center gap-1">
          <Icon name="octicon:star-16" class="w-4 h-4" />
          {{ repository.stargazers_count }}
        </Badge>
        
        <Badge variant="secondary" class="flex items-center gap-1">
          <Icon name="octicon:repo-forked-16" class="w-4 h-4" />
          {{ repository.forks_count }}
        </Badge>
        
        <Badge 
          v-if="repository.language"
          variant="outline" 
          class="flex items-center gap-1"
        >
          <Icon name="octicon:code-16" class="w-4 h-4" />
          {{ repository.language }}
        </Badge>

        <Badge 
          v-for="topic in repository.topics.slice(0, 2)" 
          :key="topic"
          variant="outline"
          class="flex items-center gap-1"
        >
          <Icon name="octicon:hash-16" class="w-4 h-4" />
          {{ topic }}
        </Badge>
        
        <Badge 
          v-if="repository.topics.length > 2"
          variant="outline"
        >
          +{{ repository.topics.length - 2 }}
        </Badge>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
