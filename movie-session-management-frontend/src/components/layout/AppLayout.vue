<template>
  <div class="app-layout">
    <AppHeader @toggle-sidebar="toggleSidebar" />
    
    <div class="app-layout__container">
      <AppSidebar 
        :is-open="isSidebarOpen" 
        @close="closeSidebar"
      />
      
      <main class="app-layout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

const isSidebarOpen = ref(false)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  isSidebarOpen.value = false
}

// Fecha sidebar em telas grandes ao redimensionar
function handleResize() {
  if (window.innerWidth >= 1024) {
    isSidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
}

.app-layout__container {
  display: flex;
  flex: 1;
  position: relative;
}

.app-layout__main {
  flex: 1;
  overflow-x: hidden;
}

@media (min-width: 1024px) {
  .app-layout__container {
    margin-left: 250px;
  }
}
</style>
