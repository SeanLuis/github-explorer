<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ClientOnly>
</template>

<script setup lang="ts">
// Base schema for the website
useSchemaOrg([
  defineWebSite({
    name: 'GitHub Open Source Explorer',
    description: 'Explore amazing open source projects on GitHub',
  })
])
</script>
