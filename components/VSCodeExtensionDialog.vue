<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#components'
import { useColorMode } from '@vueuse/core'

const isOpen = ref(false)
const showFullImage = ref(false)
const colorMode = useColorMode()

const vscodeLogo = computed(() => {
  return colorMode.value === 'dark' 
    ? 'i-vscode-icons:file-type-vscode' 
    : 'i-vscode-icons:file-type-vscode2'
})

const openFullImage = () => {
  showFullImage.value = true
}

const closeFullImage = () => {
  showFullImage.value = false
}
</script>

<template>
  <div>
    <Button
      @click="isOpen = true"
      class="fixed bottom-6 right-6 shadow-lg hover:shadow-xl transition-all duration-300"
      size="default"
      variant="outline"
    >
      <Icon 
        :name="vscodeLogo"
        class="mr-2 h-4 w-4"
      />
      VS Code Extension
    </Button>

    <Dialog :open="isOpen" @update:open="isOpen = $event">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Icon 
              :name="vscodeLogo"
              class="w-6 h-6"
            />
            GitHub Explorer for VS Code
          </DialogTitle>
          <DialogDescription>
            Explore GitHub repositories directly from your VS Code editor.
          </DialogDescription>
        </DialogHeader>

        <div class="relative group cursor-pointer" @click="openFullImage">
          <img 
            src="/overview.jpeg" 
            alt="VS Code Extension Preview"
            class="w-full rounded-lg border shadow-sm transition-all duration-300 group-hover:brightness-90"
          />
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon 
              name="octicon:zoom-in-16"
              class="w-8 h-8 text-white drop-shadow-lg"
            />
          </div>
        </div>

        <div class="grid gap-4 py-4">
          <div class="space-y-4">
            <div class="flex items-center gap-4 p-3 bg-accent rounded-lg">
              <Icon name="octicon:search-16" class="w-5 h-5 shrink-0" />
              <div>
                <h4 class="font-medium">Search & Filter</h4>
                <p class="text-sm text-muted-foreground">Search repositories and filter by language, stars, and more.</p>
              </div>
            </div>

            <div class="flex items-center gap-4 p-3 bg-accent rounded-lg">
              <Icon name="octicon:repo-16" class="w-5 h-5 shrink-0" />
              <div>
                <h4 class="font-medium">Quick Actions</h4>
                <p class="text-sm text-muted-foreground">Star, fork, and clone repositories with a single click.</p>
              </div>
            </div>

            <div class="flex items-center gap-4 p-3 bg-accent rounded-lg">
              <Icon name="octicon:file-directory-16" class="w-5 h-5 shrink-0" />
              <div>
                <h4 class="font-medium">Collections</h4>
                <p class="text-sm text-muted-foreground">Organize repositories into custom collections.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter class="flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            @click="isOpen = false"
          >
            Maybe Later
          </Button>
          <Button
            as="a"
            href="https://marketplace.visualstudio.com/items?itemName=SeanLuisGuadaRodriguez.opensource-explorer"
            target="_blank"
            class="gap-2"
          >
            <Icon name="octicon:download-16" class="w-4 h-4" />
            Install Extension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="showFullImage" @update:open="showFullImage = $event">
      <DialogContent class="max-w-[90vw] h-[90vh] p-0">
        <div class="relative h-full">
          <Button
            variant="ghost"
            size="icon"
            class="absolute top-2 right-2 z-10"
            @click="closeFullImage"
          >
            <Icon name="octicon:x-16" class="h-4 w-4" />
          </Button>
          <img 
            src="/overview.jpeg" 
            alt="VS Code Extension Preview"
            class="w-full h-full object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.i-vscode-icons\:file-type-vscode,
.i-vscode-icons\:file-type-vscode2 {
  color: #0066b8;
}

.group:hover img {
  transform: scale(1.01);
}
</style>
