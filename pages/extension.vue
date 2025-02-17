<script setup lang="ts">
import { useColorMode } from '@vueuse/core'

const colorMode = useColorMode()

const features = [
  {
    icon: 'octicon:search-16',
    title: 'Advanced Search',
    description: 'Find repositories with powerful filters and sorting options'
  },
  {
    icon: 'octicon:star-16',
    title: 'Quick Actions',
    description: 'Star, fork, and clone repositories with a single click'
  },
  {
    icon: 'octicon:file-directory-16',
    title: 'Collections',
    description: 'Organize repositories into custom collections for easy access'
  },
  {
    icon: 'octicon:markdown-16',
    title: 'README Preview',
    description: 'View repository documentation with full Markdown support'
  },
  {
    icon: 'octicon:sync-16',
    title: 'Auto Refresh',
    description: 'Keep your repository data up to date automatically'
  },
  {
    icon: 'octicon:command-palette-16',
    title: 'Command Palette',
    description: 'Access all features quickly through VS Code commands'
  }
]

const screenshots = [
  {
    src: '/screenshots/overview.png',
    alt: 'Extension Overview',
    title: 'Modern Interface',
    description: 'Clean and intuitive repository management'
  },
  {
    src: '/screenshots/repo-details.png',
    alt: 'Repository Details',
    title: 'Repository Details',
    description: 'Comprehensive repository information at a glance'
  },
  {
    src: '/screenshots/collections.png',
    alt: 'Collections View',
    title: 'Collections',
    description: 'Organize repositories your way'
  }
]
</script>

<template>
  <div class="space-y-24">
    <!-- Hero Section -->
    <section class="text-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div class="absolute inset-0 bg-grid-pattern opacity-10" />
      <div class="relative max-w-4xl mx-auto">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          GitHub Explorer for VS Code
        </h1>
        <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The most powerful GitHub integration for Visual Studio Code. Search, explore, and manage repositories directly from your editor.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            as="a"
            href="https://marketplace.visualstudio.com/items?itemName=SeanLuisGuadaRodriguez.opensource-explorer"
            target="_blank"
            class="gap-2"
          >
            <Icon name="vscode-icons:file-type-vscode" class="h-5 w-5" />
            Install Extension
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            as="a"
            href="https://github.com/SeanLuis/github-explorer"
            target="_blank"
            class="gap-2"
          >
            <Icon name="octicon:mark-github-16" class="h-5 w-5" />
            View on GitHub
          </Button>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-16">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Powerful Features</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to manage GitHub repositories efficiently
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="p-6 rounded-lg border bg-card"
        >
          <Icon 
            :name="feature.icon"
            class="h-10 w-10 mb-4 text-primary"
          />
          <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-muted-foreground">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Screenshot Showcase -->
    <section class="py-16 bg-accent/30">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">See It In Action</h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
          Modern interface designed for productivity
        </p>
      </div>
      <div class="space-y-24 max-w-6xl mx-auto px-4">
        <div 
          v-for="(screenshot, index) in screenshots" 
          :key="screenshot.title"
          class="flex flex-col md:flex-row items-center gap-8"
          :class="index % 2 === 1 ? 'md:flex-row-reverse' : ''"
        >
          <div class="flex-1">
            <img 
              :src="screenshot.src" 
              :alt="screenshot.alt"
              class="rounded-lg border shadow-lg"
            />
          </div>
          <div class="flex-1 space-y-4">
            <h3 class="text-2xl font-bold">{{ screenshot.title }}</h3>
            <p class="text-muted-foreground text-lg">{{ screenshot.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Installation Section -->
    <section class="py-16 text-center">
      <div class="max-w-3xl mx-auto px-4">
        <h2 class="text-3xl font-bold mb-4">Get Started in Seconds</h2>
        <p class="text-muted-foreground mb-8">
          Install directly from VS Code or using the command line
        </p>
        <div class="space-y-4">
          <div class="p-4 bg-accent rounded-lg text-left">
            <code class="text-sm">ext install SeanLuisGuadaRodriguez.opensource-explorer</code>
          </div>
          <Button 
            size="lg"
            as="a"
            href="https://marketplace.visualstudio.com/items?itemName=SeanLuisGuadaRodriguez.opensource-explorer"
            target="_blank"
            class="gap-2"
          >
            <Icon name="vscode-icons:file-type-vscode" class="h-5 w-5" />
            Install from Marketplace
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0);
  background-size: 24px 24px;
}
</style>
