import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from './Toast.vue'

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders with message', () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test message',
        show: true
      }
    })

    expect(wrapper.text()).toContain('Test message')
  })

  it('displays correct icon for success type', () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test',
        type: 'success',
        show: true
      }
    })

    expect(wrapper.find('.toast__icon svg').exists()).toBe(true)
    expect(wrapper.find('.toast').classes()).toContain('toast--success')
  })

  it('displays correct icon for error type', () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test',
        type: 'error',
        show: true
      }
    })

    expect(wrapper.find('.toast__icon svg').exists()).toBe(true)
    expect(wrapper.find('.toast').classes()).toContain('toast--error')
  })

  it('displays correct icon for info type', () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test',
        type: 'info',
        show: true
      }
    })

    expect(wrapper.find('.toast__icon svg').exists()).toBe(true)
    expect(wrapper.find('.toast').classes()).toContain('toast--info')
  })

  it('displays correct icon for warning type', () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test',
        type: 'warning',
        show: true
      }
    })

    expect(wrapper.find('.toast__icon svg').exists()).toBe(true)
    expect(wrapper.find('.toast').classes()).toContain('toast--warning')
  })

  it('has correct accessibility attributes', () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test message',
        show: true
      }
    })

    const toast = wrapper.find('.toast')
    expect(toast.attributes('role')).toBe('alert')
    expect(toast.attributes('aria-live')).toBe('polite')
  })

  it('emits close event when close button is clicked', async () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test message',
        show: true,
        dismissible: true
      }
    })

    await wrapper.find('.toast__close').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('auto-dismisses after duration', async () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test message',
        show: true,
        duration: 3000
      }
    })

    expect(wrapper.find('.toast').exists()).toBe(true)

    vi.advanceTimersByTime(3000)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('does not auto-dismiss when duration is 0', async () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test message',
        show: true,
        duration: 0
      }
    })

    vi.advanceTimersByTime(10000)
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('hides close button when not dismissible', () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test message',
        show: true,
        dismissible: false
      }
    })

    expect(wrapper.find('.toast__close').exists()).toBe(false)
  })

  it('shows toast when show prop becomes true', async () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test message',
        show: false
      }
    })

    expect(wrapper.find('.toast').exists()).toBe(false)

    await wrapper.setProps({ show: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.toast').exists()).toBe(true)
  })

  it('has close button with aria-label', () => {
    const wrapper = mount(Toast, {
      props: {
        message: 'Test message',
        show: true,
        dismissible: true
      }
    })

    const closeButton = wrapper.find('.toast__close')
    expect(closeButton.attributes('aria-label')).toBe('Fechar notificação')
  })
})
