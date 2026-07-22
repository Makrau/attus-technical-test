<template>
  <header class="app-header">
    <button 
      class="app-header__toggle"
      @click="$emit('toggle-sidebar')"
      aria-label="Toggle menu"
    >
      <MenuIcon :size="24" />
    </button>
    
    <div class="app-header__title">
      <FilmIcon :size="24" />
      <h1>Cinema Manager</h1>
    </div>
    
    <nav class="app-header__nav">
      <router-link to="/dashboard" class="app-header__link">
        Dashboard
      </router-link>
      <router-link to="/movies" class="app-header__link">
        Filmes
      </router-link>
      <router-link to="/rooms" class="app-header__link">
        Salas
      </router-link>
      <router-link to="/sessions" class="app-header__link">
        Sessões
      </router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { MenuIcon, FilmIcon } from 'lucide-vue-next'

interface Emits {
  (e: 'toggle-sidebar'): void
}

defineEmits<Emits>()
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-md);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.app-header__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background-color 0.2s ease;
}

.app-header__toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.app-header__toggle:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.app-header__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.app-header__title h1 {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: 600;
}

.app-header__nav {
  display: none;
  gap: var(--spacing-md);
  margin-left: auto;
}

.app-header__link {
  padding: var(--spacing-sm) var(--spacing-md);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.app-header__link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.app-header__link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

@media (min-width: 768px) {
  .app-header__nav {
    display: flex;
  }
  
  .app-header__toggle {
    display: none;
  }
}

@media (min-width: 1024px) {
  .app-header {
    margin-left: 250px;
  }
  
  .app-header__toggle {
    display: none;
  }
}
</style>
