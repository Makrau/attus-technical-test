<template>
  <Teleport to="body">
    <div class="toast-container">
      <Transition name="toast">
        <Toast
          v-if="uiStore.hasToast"
          :type="uiStore.toastType || 'info'"
          :message="uiStore.toastMessage || ''"
          @close="uiStore.clearToast"
        />
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useUIStore } from '@/stores/ui'
import Toast from '@/components/molecules/Toast.vue'

const uiStore = useUIStore()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: var(--z-toast);
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
}

/* Toast transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@media (max-width: 640px) {
  .toast-container {
    top: var(--spacing-md);
    right: var(--spacing-md);
    left: var(--spacing-md);
  }
}
</style>
