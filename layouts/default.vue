<script setup lang="ts">
useSeoMeta({
  themeColor: '#ffffff',
  mobileWebAppCapable: 'yes',
  formatDetection: {
    telephone: false
  }
})

// Agregar breadcrumbs si no estamos en la página principal
const route = useRoute()
if (route.path !== '/') {
  useSchemaOrg([
    defineBreadcrumb({
      itemListElement: route.path.split('/').filter(Boolean).map((part, index, arr) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: part.charAt(0).toUpperCase() + part.slice(1),
        item: arr.slice(0, index + 1).join('/')
      }))
    })
  ])
}

const navigationItems = [
  { label: 'Explore', icon: 'octicon:telescope-24', path: '/' },
  { label: 'Trending', icon: 'octicon:flame-24', path: '/trending' },
  { label: 'Topics', icon: 'octicon:hash-24', path: '/topics' },
  { label: 'Collections', icon: 'octicon:package-24', path: '/collections' },
]

const showMobileMenu = ref(false)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container px-4 sm:px-6">
        <div class="flex h-14 items-center justify-between">
          <!-- Logo y navegación principal -->
          <div class="flex items-center gap-2 md:gap-6">
            <NuxtLink to="/" class="flex items-center gap-2 mr-4">
              <Icon name="octicon:mark-github-16" class="h-6 w-6" />
              <span class="font-semibold hidden sm:inline-block">OpenSource Explorer</span>
            </NuxtLink>
            
            <nav class="hidden md:flex md:gap-4">
              <NuxtLink 
                v-for="item in navigationItems" 
                :key="item.path"
                :to="item.path"
                :class="[
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  route.path === item.path
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                ]"
              >
                <Icon :name="item.icon" class="mr-2 h-4 w-4" />
                {{ item.label }}
              </NuxtLink>
            </nav>
          </div>

          <div class="flex items-center gap-2">
            <ThemeToggle class="hidden sm:flex" />
            
            <Button
              variant="outline"
              size="sm"
              as="a"
              href="https://github.com/SeanLuis/github-open-source"
              target="_blank"
              class="hidden sm:flex gap-2"
            >
              <Icon name="octicon:star-16" class="h-4 w-4" />
              Star
            </Button>

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

        <div
          v-show="showMobileMenu"
          class="md:hidden py-4 border-t"
        >
          <nav class="flex flex-col gap-2">
            <NuxtLink 
              v-for="item in navigationItems" 
              :key="item.path"
              :to="item.path"
              :class="[
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                route.path === item.path
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              ]"
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
              href="https://github.com/SeanLuis/github-open-source"
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

    <main class="container flex-1 py-6 px-4 sm:px-6">
      <slot />
    </main>

    <footer class="mt-auto border-t py-6">
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
            href="https://github.com/SeanLuis"
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
