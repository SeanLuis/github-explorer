<script setup lang="ts">
import type { IGitHubRepository } from '~/types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '#components'

const props = defineProps<{
  repository: IGitHubRepository
}>()

const emit = defineEmits<{
  (e: 'click', repo: IGitHubRepository): void
}>()
</script>

<template>
  <Card 
    class="hover:border-github-link cursor-pointer transition-colors"
    @click="emit('click', repository)"
  >
    <CardHeader>
      <div class="flex items-center gap-3">
        <Avatar>
          <AvatarImage :src="repository.owner.avatar_url" :alt="repository.owner.login" />
          <AvatarFallback>{{ repository.owner.login.charAt(0) }}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle class="text-base">{{ repository.name }}</CardTitle>
          <CardDescription>{{ repository.owner.login }}</CardDescription>
        </div>
      </div>
    </CardHeader>
    
    <CardContent>
      <p class="text-sm text-github-text mb-4">{{ repository.description }}</p>
      
      <div class="flex gap-4 text-sm text-github-muted">
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
      </div>
    </CardContent>
  </Card>
</template>
