<script setup lang="ts">
import type { SearchToken } from './types'

defineProps<{
  tokens: SearchToken[]
}>()
</script>

<template>
  <div class="search-highlight absolute inset-0 whitespace-pre pointer-events-none flex items-center">
    <template v-for="(token, index) in tokens" :key="index">
      <template v-if="token.type === 'qualifier'">
        <span class="text-primary font-medium">{{ token.qualifier }}:</span>
        <span class="search-badge">{{ token.value }}</span>
      </template>
      <template v-else>
        <span>{{ token.value }}</span>
      </template>
    </template>
    <span class="pl-px"></span>
  </div>
</template>

<style scoped>
.search-highlight {
  display: flex;
  align-items: center;
  white-space: pre;
  padding: 2px 0;
}

.search-badge {
  display: inline-flex;
  align-items: center;
  background-color: #ddf4ff;
  color: #0969da;
  border-radius: .2rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  margin: 0 1px;
  white-space: pre;
  flex-shrink: 0;
}

:root[class~="dark"] .search-badge {
  background-color: #1a384d;
  color: #2f81f7;
}
</style>
