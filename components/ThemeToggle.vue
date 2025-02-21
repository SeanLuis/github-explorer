<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '#components'
import { Button } from '#components'

const colorMode = useColorMode()

// Función para cambiar el tema de manera inmediata
const changeTheme = (theme: 'light' | 'dark' | 'system') => {
  colorMode.preference = theme
  // Si es system, usar la preferencia del sistema
  if (theme === 'system') {
    colorMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } else {
    colorMode.value = theme
  }
  
  nextTick(() => {
    document.documentElement.setAttribute('data-theme', colorMode.value)
  })
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <transition name="theme-icon" mode="out-in">
          <Icon
            v-if="colorMode.value === 'light'"
            key="light"
            name="ph:sun-bold"
            class="h-5 w-5"
          />
          <Icon
            v-else
            key="dark"
            name="ph:moon-bold"
            class="h-5 w-5"
          />
        </transition>
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="changeTheme('light')">
        <Icon name="ph:sun-bold" class="mr-2 h-4 w-4" />
        <span>Light</span>
        <Icon
          v-if="colorMode.value === 'light'"
          name="ph:check-bold"
          class="ml-auto h-4 w-4"
        />
      </DropdownMenuItem>
      <DropdownMenuItem @click="changeTheme('dark')">
        <Icon name="ph:moon-bold" class="mr-2 h-4 w-4" />
        <span>Dark</span>
        <Icon
          v-if="colorMode.value === 'dark'"
          name="ph:check-bold"
          class="ml-auto h-4 w-4"
        />
      </DropdownMenuItem>
      <DropdownMenuItem @click="changeTheme('system')">
        <Icon name="ph:desktop-bold" class="mr-2 h-4 w-4" />
        <span>System</span>
        <Icon
          v-if="colorMode.preference === 'system'"
          name="ph:check-bold"
          class="ml-auto h-4 w-4"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped>
.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.theme-icon-enter-from,
.theme-icon-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
