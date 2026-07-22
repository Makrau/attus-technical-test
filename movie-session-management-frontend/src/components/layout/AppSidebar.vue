<template>
  <Teleport to="body">
    <Transition name="sidebar-backdrop">
      <div 
        v-if="isOpen" 
        class="app-sidebar__backdrop"
        @click="$emit('close')"
      />
    </Transition>
  </Teleport>

  <Transition name="sidebar">
    <aside v-if="isOpen || isDesktop" class="app-sidebar">
      <div class="app-sidebar__header">
        <div class="app-sidebar__logo">
          <FilmIcon :size="32" />
          <span>Cinema Manager</span>
        </div>
        
        <button 
          class="app-sidebar__close"
          @click="$emit('close')"
          aria-label="Fechar menu"
        >
          <XIcon :size="24" />
        </button>
      </div>

      <nav class="app-sidebar__nav">
        <router-link 
          to="/dashboard" 
          class="app-sidebar__link"
          @click="handleLinkClick"
        >
          <LayoutDashboardIcon :size="20" />
          <span>Dashboard</span>
        </router-link>

        <router-link 
          to="/movies" 
          class="app-sidebar__link"
          @click="handleLinkClick"
        >
          <FilmIcon :size="20" />
          <span>Filmes</span>
        </router-link>

        <router-link 
          to="/rooms" 
          class="app-sidebar__link"
          @click="handleLinkClick"
        >
          <DoorOpenIcon :size="20" />
          <span>Salas</span>
        </router-link>

        <router-link 
          to="/sessions" 
          class="app-sidebar__link"
          @click="handleLinkClick"
        >
          <CalendarIcon :size="20" />
          <span>Sessões</span>
        </router-link>
      </nav>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  FilmIcon, 
  XIcon, 
  LayoutDashboardIcon, 
  DoorOpenIcon, 
  CalendarIcon 
} from 'lucide-vue-next'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isDesktop = ref(false)

function checkDesktop() {
  isDesktop.value = window.innerWidth >= 1024
}

function handleLinkClick() {
  if (!isDesktop.value) {
    emit('close')
  }
}

onMounted(() => {
  checkDesktop()
  window.addEventListener('resize', checkDesktop)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkDesktop)
})
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-modal);
  display: flex;
  flex-direction: column;
}

.app-sidebar__backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: calc(var(--z-modal) - 1);
}

.app-sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.app-sidebar__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-primary);
  font-weight: 600;
  font-size: var(--text-lg);
}

.app-sidebar__close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.app-sidebar__close:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
}

.app-sidebar__nav {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  overflow-y: auto;
}

.app-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
}

.app-sidebar__link:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-primary);
}

.app-sidebar__link.router-link-active {
  background-color: var(--color-primary);
  color: white;
}

/* Transitions */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease;
}

.sidebar-enter-from {
  transform: translateX(-100%);
}

.sidebar-leave-to {
  transform: translateX(-100%);
}

.sidebar-backdrop-enter-active,
.sidebar-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-backdrop-enter-from,
.sidebar-backdrop-leave-to {
  opacity: 0;
}

@media (min-width: 1024px) {
  .app-sidebar {
    z-index: var(--z-sticky);
  }
  
  .app-sidebar__close {
    display: none;
  }
  
  .sidebar-enter-active,
  .sidebar-leave-active {
    transition: none;
  }
  
  .sidebar-enter-from,
  .sidebar-leave-to {
    transform: translateX(0);
  }
}
</style>
