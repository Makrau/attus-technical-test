import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUIStore } from './ui'

describe('UI Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  describe('Modal', () => {
    it('should open modal with type', () => {
      const store = useUIStore()
      
      store.openModal('confirm')
      
      expect(store.showModal).toBe(true)
      expect(store.modalType).toBe('confirm')
      expect(store.isModalOpen).toBe(true)
    })

    it('should close modal and reset type', () => {
      const store = useUIStore()
      
      store.openModal('alert')
      store.closeModal()
      
      expect(store.showModal).toBe(false)
      expect(store.modalType).toBe(null)
      expect(store.isModalOpen).toBe(false)
    })
  })

  describe('Toast', () => {
    it('should show toast with message and type', () => {
      const store = useUIStore()
      
      store.showToast('Success message', 'success')
      
      expect(store.toastMessage).toBe('Success message')
      expect(store.toastType).toBe('success')
      expect(store.hasToast).toBe(true)
    })

    it('should default to info type when not specified', () => {
      const store = useUIStore()
      
      store.showToast('Info message')
      
      expect(store.toastType).toBe('info')
    })

    it('should auto-clear toast after 3 seconds', () => {
      const store = useUIStore()
      
      store.showToast('Test message', 'success')
      expect(store.hasToast).toBe(true)
      
      vi.advanceTimersByTime(3000)
      
      expect(store.toastMessage).toBe(null)
      expect(store.toastType).toBe(null)
      expect(store.hasToast).toBe(false)
    })

    it('should clear existing timeout when showing new toast', () => {
      const store = useUIStore()
      
      store.showToast('First message', 'info')
      vi.advanceTimersByTime(1500)
      
      store.showToast('Second message', 'success')
      expect(store.toastMessage).toBe('Second message')
      
      vi.advanceTimersByTime(1500)
      expect(store.hasToast).toBe(true) // Still showing because new timeout started
      
      vi.advanceTimersByTime(1500)
      expect(store.hasToast).toBe(false)
    })

    it('should manually clear toast', () => {
      const store = useUIStore()
      
      store.showToast('Test message', 'error')
      expect(store.hasToast).toBe(true)
      
      store.clearToast()
      
      expect(store.toastMessage).toBe(null)
      expect(store.toastType).toBe(null)
      expect(store.hasToast).toBe(false)
    })

    it('should clear timeout when manually clearing toast', () => {
      const store = useUIStore()
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
      
      store.showToast('Test', 'info')
      store.clearToast()
      
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('Loading', () => {
    it('should start loading without message', () => {
      const store = useUIStore()
      
      store.startLoading()
      
      expect(store.isLoading).toBe(true)
      expect(store.loadingMessage).toBe(null)
    })

    it('should start loading with message', () => {
      const store = useUIStore()
      
      store.startLoading('Carregando dados...')
      
      expect(store.isLoading).toBe(true)
      expect(store.loadingMessage).toBe('Carregando dados...')
    })

    it('should stop loading and clear message', () => {
      const store = useUIStore()
      
      store.startLoading('Loading...')
      store.stopLoading()
      
      expect(store.isLoading).toBe(false)
      expect(store.loadingMessage).toBe(null)
    })
  })
})
