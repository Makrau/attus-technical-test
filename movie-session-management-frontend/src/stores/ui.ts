import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type ToastType = 'success' | 'error' | 'info' | null

export const useUIStore = defineStore('ui', () => {
  const showModal = ref(false)
  const modalType = ref<string | null>(null)
  const toastMessage = ref<string | null>(null)
  const toastType = ref<ToastType>(null)
  const isLoading = ref(false)
  const loadingMessage = ref<string | null>(null)
  
  let toastTimeout: ReturnType<typeof setTimeout> | null = null

  function openModal(type: string) {
    modalType.value = type
    showModal.value = true
  }

  function closeModal() {
    showModal.value = false
    modalType.value = null
  }

  function showToast(message: string, type: ToastType = 'info') {
    if (toastTimeout) {
      clearTimeout(toastTimeout)
    }

    toastMessage.value = message
    toastType.value = type

    toastTimeout = setTimeout(() => {
      clearToast()
    }, 3000)
  }

  function clearToast() {
    toastMessage.value = null
    toastType.value = null
    if (toastTimeout) {
      clearTimeout(toastTimeout)
      toastTimeout = null
    }
  }

  const isModalOpen = computed(() => showModal.value)
  const hasToast = computed(() => toastMessage.value !== null)

  function startLoading(message: string | null = null) {
    isLoading.value = true
    loadingMessage.value = message
  }

  function stopLoading() {
    isLoading.value = false
    loadingMessage.value = null
  }

  return {
    showModal,
    modalType,
    toastMessage,
    toastType,
    isLoading,
    loadingMessage,
    isModalOpen,
    hasToast,
    openModal,
    closeModal,
    showToast,
    clearToast,
    startLoading,
    stopLoading
  }
})
