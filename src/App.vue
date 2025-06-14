<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const isDarkMode = ref(true)

onMounted(() => {
  document.documentElement.classList.add('dark')
})
</script>

<template>
  <div id="app" class="min-h-screen bg-surface text-on-surface">
    <RouterView />
  </div>
</template>

<style scoped>
#app {
  transition: all 0.3s ease;
}
</style>

