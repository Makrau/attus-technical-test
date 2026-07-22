<template>
  <Modal
    :model-value="modelValue"
    :title="title"
    :closable="true"
    @update:model-value="handleUpdateModelValue"
  >
    <p class="confirm-dialog__message">{{ message }}</p>

    <template #footer>
      <Button
        variant="secondary"
        @click="handleCancel"
      >
        {{ cancelText }}
      </Button>
      <Button
        :variant="confirmVariant"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue'
import Button from '@/components/atoms/Button.vue'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface Props {
  modelValue: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonVariant
  loading?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirmar Ação',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  confirmVariant: 'danger',
  loading: false
})

const emit = defineEmits<Emits>()

function handleUpdateModelValue(value: boolean) {
  emit('update:modelValue', value)
}

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<style scoped>
.confirm-dialog__message {
  margin: 0;
  font-size: var(--text-base);
  color: var(--color-text);
  line-height: 1.6;
}
</style>
