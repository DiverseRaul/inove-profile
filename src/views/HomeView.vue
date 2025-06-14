<template>
  <div class="min-h-screen bg-background">
    <!-- <NavBar /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
/*import NavBar from '@/components/NavBar.vue'*/

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>


<style scoped>
/* Basic styles for the hero section */
.gradient-text {
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-tertiary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
