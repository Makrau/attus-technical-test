<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click="handleOverlayClick"
        @keydown.esc="handleEscape"
      >
        <div
          ref="modalRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          class="modal"
          @click.stop
        >
          <div class="modal__header">
            <h2 :id="titleId" class="modal__title">
              <slot name="title">{{ title }}</slot>
            </h2>
            <button
              v-if="closable"
              class="modal__close"
              @click="handleClose"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div class="modal__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
  closable?: boolean
  closeOnOverlay?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
  closeOnOverlay: true
})

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLElement | null>(null)
const titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`
const previousActiveElement = ref<HTMLElement | null>(null)

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    handleClose()
  }
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closable) {
    handleClose()
  }
}

function trapFocus(event: KeyboardEvent) {
  if (!modalRef.value || event.key !== 'Tab') return

  const focusableElements = modalRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    lastElement?.focus()
    event.preventDefault()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    firstElement?.focus()
    event.preventDefault()
  }
}

watch(() => props.modelValue, async (isOpen) => {
  if (isOpen) {
    previousActiveElement.value = document.activeElement as HTMLElement
    document.body.style.overflow = 'hidden'
    
    await nextTick()
    const firstFocusable = modalRef.value?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    firstFocusable?.focus()
    
    document.addEventListener('keydown', trapFocus)
  } else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', trapFocus)
    previousActiveElement.value?.focus()
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal__title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-text);
}

.modal__close {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  font-size: var(--text-xl);
  line-height: 1;
  width: 32px;
  height: 32px;
}

.modal__close:hover {
  background-color: var(--color-muted);
  color: var(--color-text);
}

.modal__close:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.modal__body {
  padding: var(--spacing-lg);
  overflow-y: auto;
  flex: 1;
}

.modal__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  flex-shrink: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9);
}
</style>
