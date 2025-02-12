<script setup lang="ts">
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-github-dark">
    <!-- Header -->
    <header class="border-b border-github-border sticky top-0 z-50 bg-white dark:bg-github-dark-secondary">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="flex items-center gap-2">
            <Icon name="octicon:mark-github-16" class="w-8 h-8 text-github-text" />
            <span class="font-semibold text-github-text">OpenSource Explorer</span>
          </NuxtLink>
        </div>
        
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" @click="toggleTheme">
            <Icon 
              :name="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" 
              class="w-5 h-5"
            />
          </Button>
          
          <a 
            href="https://github.com/yourusername/github-open-source" 
            target="_blank"
            class="github-btn flex items-center gap-2"
          >
            <Icon name="octicon:mark-github-16" class="w-4 h-4" />
            Star on GitHub
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-6">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-github-border mt-auto">
      <div class="container mx-auto px-4 py-6 text-sm text-github-muted">
        <div class="flex justify-between items-center">
          <p>© {{ new Date().getFullYear() }} OpenSource Explorer</p>
          <div class="flex gap-4">
            <NuxtLink to="/about" class="hover:text-github-link">About</NuxtLink>
            <a href="https://github.com/yourusername" target="_blank" class="hover:text-github-link">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
