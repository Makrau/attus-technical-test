<template>
  <div class="datetime-picker">
    <label v-if="label" class="datetime-picker__label">
      {{ label }}
      <span v-if="required" class="datetime-picker__required">*</span>
    </label>
    <input
      :value="localValue"
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
import { computed } from 'vue'

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

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * Converte o valor ISO 8601 (do backend) para o formato datetime-local
 * Input datetime-local espera: YYYY-MM-DDTHH:mm (sem timezone, no fuso local)
 */
const localValue = computed(() => {
  if (!props.modelValue) {
    return ''
  }

  try {
    // Parse da string ISO (ex: "2024-01-01T10:00:00Z")
    const date = new Date(props.modelValue)
    
    // Converte para o formato datetime-local (YYYY-MM-DDTHH:mm)
    // Precisamos usar o horário local, não UTC
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  } catch (error) {
    console.error('Error parsing datetime:', error)
    return ''
  }
})

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  if (value) {
    // Converte o valor local para ISO 8601 antes de emitir
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
