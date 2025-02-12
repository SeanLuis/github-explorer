<script setup lang="ts">
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '#components'
import { Button } from '#components'

const colorMode = useColorMode()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <Icon
          name="ph:sun-bold"
          class="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
        />
        <Icon
          name="ph:moon-bold"
          class="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="colorMode.preference = 'light'">
        <Icon name="ph:sun-bold" class="mr-2 h-4 w-4" />
        Light
      </DropdownMenuItem>
      <DropdownMenuItem @click="colorMode.preference = 'dark'">
        <Icon name="ph:moon-bold" class="mr-2 h-4 w-4" />
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem @click="colorMode.preference = 'system'">
        <Icon name="ph:desktop-bold" class="mr-2 h-4 w-4" />
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
