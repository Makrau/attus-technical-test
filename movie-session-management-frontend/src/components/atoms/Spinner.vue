<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  size: 'md'
})
</script>

<template>
  <div class="spinner" :class="`spinner--${size}`">
    <div class="spinner__circle"></div>
  </div>
</template>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner__circle {
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.spinner--sm .spinner__circle {
  width: 16px;
  height: 16px;
}

.spinner--md .spinner__circle {
  width: 24px;
  height: 24px;
}

.spinner--lg .spinner__circle {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
