<template>
  <div class="flex flex-col items-center justify-center py-8 gap-4">
    <Icon name="octicon:sync-24" class="animate-spin h-8 w-8 text-muted-foreground" />
    <p class="text-muted-foreground">Loading repositories...</p>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
