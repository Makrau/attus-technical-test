<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  rows: 4
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaClasses = computed(() => {
  return [
    'textarea__field',
    {
      'textarea__field--error': props.error,
      'textarea__field--disabled': props.disabled
    }
  ]
})

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="textarea">
    <label v-if="label" class="textarea__label">
      {{ label }}
      <span v-if="required" class="textarea__required">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :class="textareaClasses"
      @input="handleInput"
    />
    <span v-if="error" class="textarea__error">{{ error }}</span>
  </div>
</template>

<style scoped>
.textarea {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.textarea__label {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.textarea__required {
  color: var(--color-error);
  margin-left: var(--spacing-1);
}

.textarea__field {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-base);
  font-family: var(--font-family-sans);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.textarea__field::placeholder {
  color: var(--color-text-disabled);
}

.textarea__field:hover:not(:disabled) {
  border-color: var(--color-border-hover);
}

.textarea__field:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.textarea__field--error {
  border-color: var(--color-error);
}

.textarea__field--error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.textarea__field:disabled,
.textarea__field--disabled {
  background-color: var(--color-bg-disabled);
  color: var(--color-text-disabled);
  cursor: not-allowed;
  resize: none;
}

.textarea__error {
  font-size: var(--text-sm);
  color: var(--color-error);
}
</style>
