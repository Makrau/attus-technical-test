<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => {
  return [
    'btn',
    `btn--${props.variant}`,
    `btn--${props.size}`,
    {
      'btn--loading': props.loading,
      'btn--disabled': props.disabled || props.loading
    }
  ]
})

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__spinner"></span>
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Sizes */
.btn--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-sm);
}

.btn--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-base);
}

.btn--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--text-lg);
}

/* Variants */
.btn--primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-color: var(--color-primary);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn--primary:active:not(:disabled) {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
}

.btn--secondary:active:not(:disabled) {
  background-color: var(--color-bg-tertiary);
}

.btn--danger {
  background-color: var(--color-error);
  color: var(--color-text-inverse);
  border-color: var(--color-error);
}

.btn--danger:hover:not(:disabled) {
  background-color: var(--color-error-dark);
  border-color: var(--color-error-dark);
}

.btn--danger:active:not(:disabled) {
  background-color: #b91c1c;
  border-color: #b91c1c;
}

.btn--ghost {
  background-color: transparent;
  color: var(--color-text-primary);
  border-color: transparent;
}

.btn--ghost:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
}

.btn--ghost:active:not(:disabled) {
  background-color: var(--color-bg-tertiary);
}

/* States */
.btn:disabled,
.btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--loading {
  position: relative;
  color: transparent;
}

.btn__spinner {
  position: absolute;
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
