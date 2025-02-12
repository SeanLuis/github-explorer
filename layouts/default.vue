<script setup lang="ts">
const navigationItems = [
  { label: 'Explore', icon: 'octicon:telescope-24', path: '/' },
  { label: 'Topics', icon: 'octicon:hash-24', path: '/topics' },
  { label: 'Collections', icon: 'octicon:package-24', path: '/collections' },
]

const showMobileMenu = ref(false)
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container px-4 sm:px-6">
        <div class="flex h-14 items-center justify-between">
          <!-- Logo y navegación principal -->
          <div class="flex items-center gap-2 md:gap-6">
            <NuxtLink to="/" class="flex items-center gap-2 mr-4">
              <Icon name="octicon:mark-github-16" class="h-6 w-6" />
              <span class="font-semibold hidden sm:inline-block">OpenSource Explorer</span>
            </NuxtLink>
            
            <!-- Navegación desktop -->
            <nav class="hidden md:flex md:gap-4">
              <NuxtLink 
                v-for="item in navigationItems" 
                :key="item.path"
                :to="item.path"
                class="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <Icon :name="item.icon" class="mr-2 h-4 w-4" />
                {{ item.label }}
              </NuxtLink>
            </nav>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-2">
            <ThemeToggle class="hidden sm:flex" />
            
            <Button
              variant="outline"
              size="sm"
              as="a"
              href="https://github.com/yourusername/github-open-source"
              target="_blank"
              class="hidden sm:flex gap-2"
            >
              <Icon name="octicon:star-16" class="h-4 w-4" />
              Star
            </Button>

            <!-- Botón menú móvil -->
            <Button
              variant="ghost"
              size="icon"
              class="md:hidden"
              @click="showMobileMenu = !showMobileMenu"
            >
              <Icon 
                :name="showMobileMenu ? 'octicon:x-16' : 'octicon:three-bars-16'" 
                class="h-5 w-5"
              />
            </Button>
          </div>
        </div>

        <!-- Menú móvil -->
        <div
          v-show="showMobileMenu"
          class="md:hidden py-4 border-t"
        >
          <nav class="flex flex-col gap-2">
            <NuxtLink 
              v-for="item in navigationItems" 
              :key="item.path"
              :to="item.path"
              class="flex items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground"
              @click="showMobileMenu = false"
            >
              <Icon :name="item.icon" class="mr-2 h-4 w-4" />
              {{ item.label }}
            </NuxtLink>
          </nav>
          <div class="mt-4 flex items-center gap-4 px-3">
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
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
      </div>
    </header>

    <main class="container py-6 px-4 sm:px-6">
      <slot />
    </main>

    <footer class="border-t py-6">
      <div class="container px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-center text-sm text-muted-foreground">
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
