<script setup lang="ts">
const navigationItems = [
  { label: 'Explore', icon: 'octicon:telescope-24', path: '/' },
  { label: 'Topics', icon: 'octicon:hash-24', path: '/topics' },
  { label: 'Collections', icon: 'octicon:package-24', path: '/collections' },
]
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-14 items-center">
        <div class="flex items-center gap-6 md:gap-8">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <Icon name="octicon:mark-github-16" class="h-6 w-6" />
            <span class="font-semibold">OpenSource Explorer</span>
          </NuxtLink>
          
          <nav class="flex gap-6">
            <NuxtLink 
              v-for="item in navigationItems" 
              :key="item.path"
              :to="item.path"
              class="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Icon :name="item.icon" class="mr-2 h-4 w-4" />
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
        
        <div class="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          
          <Button
            variant="outline"
            as="a"
            href="https://github.com/yourusername/github-open-source"
            target="_blank"
            class="gap-2"
          >
            <Icon name="octicon:star-16" class="h-4 w-4" />
            Star
          </Button>
        </div>
      </div>
    </header>

    <main class="container py-6">
      <slot />
    </main>

    <footer class="border-t py-6 md:py-0">
      <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p class="text-center text-sm text-muted-foreground md:text-left">
          Built with ❤️ using Nuxt and shadcn-ui
        </p>
        <div class="flex gap-4">
          <NuxtLink 
            to="/about"
            class="text-sm text-muted-foreground hover:text-foreground"
          >
            About
          </NuxtLink>
          <a 
            href="https://github.com/yourusername"
            target="_blank"
            class="text-sm text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>
