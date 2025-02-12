<script setup>
const colorMode = useColorMode()
</script>

<template>
  <div :class="[colorMode.value]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html.dark {
  color-scheme: dark;
}
</style>
