<template>
  <Transition name="toast">
    <div
      v-if="visible"
      role="alert"
      aria-live="polite"
      :class="['toast', `toast--${type}`]"
    >
      <div class="toast__icon">
        <component :is="icon" :size="20" />
      </div>
      <div class="toast__content">
        <p class="toast__message">{{ message }}</p>
      </div>
      <button
        v-if="dismissible"
        class="toast__close"
        @click="handleClose"
        aria-label="Fechar notificação"
      >
        <XIcon :size="18" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { CheckIcon, XIcon, InfoIcon, AlertTriangleIcon } from 'lucide-vue-next'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Props {
  message: string
  type?: ToastType
  duration?: number
  dismissible?: boolean
  show?: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 5000,
  dismissible: true,
  show: false
})

const emit = defineEmits<Emits>()

const visible = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

const icon = computed(() => {
  const icons = {
    success: CheckIcon,
    error: XIcon,
    info: InfoIcon,
    warning: AlertTriangleIcon
  }
  return icons[props.type]
})

function handleClose() {
  visible.value = false
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  emit('close')
}

function startAutoDismiss() {
  if (props.duration > 0) {
    timeoutId = setTimeout(() => {
      handleClose()
    }, props.duration)
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    visible.value = true
    startAutoDismiss()
  } else {
    visible.value = false
  }
}, { immediate: true })

onMounted(() => {
  if (props.show) {
    visible.value = true
    startAutoDismiss()
  }
})
</script>

<style scoped>
.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  min-width: 300px;
  max-width: 500px;
  pointer-events: auto;
}

.toast__icon {
  font-size: var(--text-xl);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  flex-shrink: 0;
}

.toast--success {
  border-left: 4px solid var(--color-success);
}

.toast--success .toast__icon {
  color: var(--color-success);
}

.toast--error {
  border-left: 4px solid var(--color-danger);
}

.toast--error .toast__icon {
  color: var(--color-danger);
}

.toast--info {
  border-left: 4px solid var(--color-primary);
}

.toast--info .toast__icon {
  color: var(--color-primary);
}

.toast--warning {
  border-left: 4px solid var(--color-warning);
}

.toast--warning .toast__icon {
  color: var(--color-warning);
}

.toast__content {
  flex: 1;
}

.toast__message {
  margin: 0;
  font-size: var(--text-base);
  color: var(--color-text);
  line-height: 1.5;
}

.toast__close {
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
  font-size: var(--text-lg);
  line-height: 1;
  flex-shrink: 0;
}

.toast__close:hover {
  background-color: var(--color-muted);
  color: var(--color-text);
}

.toast__close:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
