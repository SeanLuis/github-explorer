<script setup lang="ts">
import { ref, watch } from 'vue'
import { GitHubService } from '../services/github';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#components'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#components'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const dialog = ref(false)
const languages = ref<string[]>([])
const topics = ref<string[]>([])

const filters = ref({
  language: 'all',
  topics: [] as string[],
  minStars: 1000,
  hasTests: false,
  isTemplate: false,
  createdAfter: null as Date | null
})

const props = defineProps<{
  modelValue: any
}>()

const emit = defineEmits(['update:modelValue', 'apply'])

onMounted(() => {
  languages.value = GitHubService.getLanguages()
  topics.value = GitHubService.getTopics()
  filters.value = { ...props.modelValue }
})

const applyFilters = () => {
  emit('update:modelValue', { ...filters.value })
  emit('apply')
  dialog.value = false
}

const resetFilters = () => {
  filters.value = {
    language: 'all',
    topics: [],
    minStars: 1000,
    hasTests: false,
    isTemplate: false,
    createdAfter: null
  }
}
</script>

<template>
  <Dialog v-model:open="dialog">
    <DialogTrigger>
      <Button variant="outline" class="gap-2">
        <Icon name="octicon:filter-16" />
        Filters
      </Button>
    </DialogTrigger>
    
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Advanced Filters</DialogTitle>
        <DialogDescription>
          Customize your search with advanced filters
        </DialogDescription>
      </DialogHeader>
      
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Language</Label>
            <Select v-model="filters.language">
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
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
          
          <div class="space-y-2">
            <Label>Minimum Stars</Label>
            <Input 
              type="number" 
              v-model="filters.minStars"
              min="0"
            />
          </div>
        </div>
        
        <div class="space-y-2">
          <Label>Topics</Label>
          <div class="flex flex-wrap gap-2">
            <Button
              v-for="topic in topics"
              :key="topic"
              :variant="filters.topics.includes(topic) ? 'default' : 'outline'"
              size="sm"
              @click="filters.topics = filters.topics.includes(topic) 
                ? filters.topics.filter(t => t !== topic)
                : [...filters.topics, topic]"
            >
              {{ topic }}
            </Button>
          </div>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center space-x-2">
            <Switch v-model="filters.hasTests" />
            <Label>Has Tests</Label>
          </div>
          
          <div class="flex items-center space-x-2">
            <Switch v-model="filters.isTemplate" />
            <Label>Is Template</Label>
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" @click="resetFilters">
          Reset Filters
        </Button>
        <Button @click="applyFilters">
          Apply Filters
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
