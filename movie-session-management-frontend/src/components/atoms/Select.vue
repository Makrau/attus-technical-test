<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number | null
  options: Option[]
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  required: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const selectClasses = computed(() => {
  return [
    'select__field',
    {
      'select__field--error': props.error,
      'select__field--disabled': props.disabled
    }
  ]
})

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value === '' ? null : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="select">
    <label v-if="label" class="select__label">
      {{ label }}
      <span v-if="required" class="select__required">*</span>
    </label>
    <select
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
      @change="handleChange"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <span v-if="error" class="select__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.select {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.select__label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.select__required {
  color: var(--color-error);
  margin-left: var(--spacing-1);
}

.select__field {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-base);
  font-family: var(--font-family-sans);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.select__field:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.select__field:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.select__field--error {
  border-color: var(--color-error);
}

.select__field--error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.select__field:disabled,
.select__field--disabled {
  background-color: var(--color-bg-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.select__error {
  font-size: var(--text-sm);
  color: var(--color-error);
}
</style>
