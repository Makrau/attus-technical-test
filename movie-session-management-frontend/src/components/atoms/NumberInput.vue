<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number | null
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const inputClasses = computed(() => {
  return [
    'number-input__field',
    {
      'number-input__field--error': props.error,
      'number-input__field--disabled': props.disabled
    }
  ]
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value === '' ? null : Number(target.value)
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="number-input">
    <label v-if="label" class="number-input__label">
      {{ label }}
      <span v-if="required" class="number-input__required">*</span>
    </label>
    <input
      type="number"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :min="min"
      :max="max"
      :class="inputClasses"
      @input="handleInput"
    />
    <span v-if="error" class="number-input__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.number-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.number-input__label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.number-input__required {
  color: var(--color-error);
  margin-left: var(--spacing-1);
}

.number-input__field {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-base);
  font-family: var(--font-family-sans);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.number-input__field:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.number-input__field:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.number-input__field--error {
  border-color: var(--color-error);
}

.number-input__field--error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.number-input__field:disabled,
.number-input__field--disabled {
  background-color: var(--color-bg-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.number-input__error {
  font-size: var(--text-sm);
  color: var(--color-error);
}
</style>
