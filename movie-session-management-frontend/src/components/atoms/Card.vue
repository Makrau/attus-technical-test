<script setup lang="ts">
interface Props {
  padding?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: true
})
</script>

<template>
  <div class="card" :class="{ 'card--padded': padding }">
    <header v-if="$slots.header" class="card__header">
      <slot name="header" />
    </header>
    <div class="card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card--padded .card__header,
.card--padded .card__body,
.card--padded .card__footer {
  padding: var(--spacing-6);
}

.card__header {
  border-bottom: 1px solid var(--color-border);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.card__footer {
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}
</style>
