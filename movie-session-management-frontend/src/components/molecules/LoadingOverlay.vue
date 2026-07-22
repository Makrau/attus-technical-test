<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="show" class="loading-overlay">
        <div class="loading-overlay__content">
          <Spinner size="large" />
          <p v-if="message" class="loading-overlay__message">{{ message }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Spinner from '@/components/atoms/Spinner.vue'

interface Props {
  show: boolean
  message?: string
}

defineProps<Props>()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.loading-overlay__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.loading-overlay__message {
  color: var(--color-text-inverse);
  font-size: var(--text-lg);
  font-weight: var(--font-weight-medium);
  margin: 0;
}

/* Overlay transition */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
