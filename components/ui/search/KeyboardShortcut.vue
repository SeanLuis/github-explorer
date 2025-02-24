<script setup lang="ts">
defineProps<{
  shortcut: string
}>()
</script>

<template>
  <kbd class="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 inline-flex">
    {{ shortcut }}
  </kbd>
</template>
