<template>
  <div class="datetime-picker">
    <label v-if="label" class="datetime-picker__label">
      {{ label }}
      <span v-if="required" class="datetime-picker__required">*</span>
    </label>
    <input
      :value="modelValue"
      @input="handleInput"
      type="datetime-local"
      :disabled="disabled"
      :min="min"
      :max="max"
      :class="[
        'datetime-picker__input',
        { 'datetime-picker__input--error': error },
        { 'datetime-picker__input--disabled': disabled }
      ]"
    />
    <span v-if="error" class="datetime-picker__error">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | null
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  min?: string
  max?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | null): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  if (value) {
    const isoString = new Date(value).toISOString()
    emit('update:modelValue', isoString)
  } else {
    emit('update:modelValue', null)
  }
}
</script>

<style scoped>
.datetime-picker {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.datetime-picker__label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: var(--spacing-2xs);
}

.datetime-picker__required {
  color: var(--color-danger);
  font-weight: 600;
}

.datetime-picker__input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--color-text);
  background-color: var(--color-surface);
  transition: all 0.2s ease;
  font-family: var(--font-family-sans);
  width: 100%;
}

.datetime-picker__input:hover:not(:disabled) {
  border-color: var(--color-primary-light);
}

.datetime-picker__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

.datetime-picker__input--error {
  border-color: var(--color-danger);
}

.datetime-picker__input--error:focus {
  box-shadow: 0 0 0 3px var(--color-danger-alpha);
}

.datetime-picker__input--disabled {
  background-color: var(--color-muted);
  cursor: not-allowed;
  opacity: 0.6;
}

.datetime-picker__error {
  font-size: var(--text-sm);
  color: var(--color-danger);
  margin-top: var(--spacing-2xs);
}

.datetime-picker__input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  filter: var(--color-primary);
}

.datetime-picker__input::-webkit-calendar-picker-indicator:hover {
  opacity: 0.8;
}
</style>
