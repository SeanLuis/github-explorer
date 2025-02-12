<script setup lang="ts">
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navigationItems = [
  { label: 'Explore', icon: 'octicon:telescope-24', path: '/' },
  { label: 'Topics', icon: 'octicon:hash-24', path: '/topics' },
  { label: 'Collections', icon: 'octicon:package-24', path: '/collections' },
]
</script>

<template>
  <div class="min-h-screen bg-[#f6f8fa] dark:bg-github-dark">
    <header class="bg-white dark:bg-github-dark-secondary border-b border-[#d0d7de] dark:border-github-border">
      <div class="h-16 px-4 flex items-center justify-between max-w-[1400px] mx-auto">
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Icon name="octicon:mark-github-16" class="w-8 h-8 text-black dark:text-white" />
          </NuxtLink>
          
          <nav class="flex gap-6">
            <NuxtLink 
              v-for="item in navigationItems" 
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <Icon :name="item.icon" class="w-4 h-4" />
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>
        
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" @click="toggleTheme">
            <Icon 
              :name="colorMode.value === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'" 
              class="w-5 h-5"
            />
          </Button>
          
          <a 
            href="https://github.com/yourusername/github-open-source" 
            target="_blank"
            class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-github-btn hover:bg-github-btn-hover rounded-md transition-colors"
          >
            <Icon name="octicon:star-16" class="w-4 h-4" />
            Star
          </a>
        </div>
      </div>
    </header>

    <main class="max-w-[1400px] mx-auto px-4 py-6">
      <slot />
    </main>

    <footer class="border-t border-[#d0d7de] dark:border-github-border mt-auto">
      <div class="max-w-[1400px] mx-auto px-4 py-6">
        <div class="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-2">
            <Icon name="octicon:mark-github-16" class="w-4 h-4" />
            <span>© {{ new Date().getFullYear() }} OpenSource Explorer</span>
          </div>
          <div class="flex gap-6">
            <NuxtLink to="/about" class="hover:text-github-link">About</NuxtLink>
            <NuxtLink to="/terms" class="hover:text-github-link">Terms</NuxtLink>
            <NuxtLink to="/privacy" class="hover:text-github-link">Privacy</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
