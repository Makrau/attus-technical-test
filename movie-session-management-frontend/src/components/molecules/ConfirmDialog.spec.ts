import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfirmDialog from './ConfirmDialog.vue'
import Modal from './Modal.vue'
import Button from '@/components/atoms/Button.vue'

describe('ConfirmDialog Component', () => {
  beforeEach(() => {
    const app = document.createElement('div')
    app.id = 'app'
    document.body.appendChild(app)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders with message', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Are you sure you want to delete this item?'
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    expect(document.querySelector('.confirm-dialog__message')?.textContent)
      .toBe('Are you sure you want to delete this item?')

    wrapper.unmount()
  })

  it('uses default title when not provided', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Test message'
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    expect(document.querySelector('.modal__title')?.textContent).toBe('Confirm Action')

    wrapper.unmount()
  })

  it('uses custom title when provided', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Test message',
        title: 'Delete Item'
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    expect(document.querySelector('.modal__title')?.textContent).toBe('Delete Item')

    wrapper.unmount()
  })

  it('renders custom button texts', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Test message',
        confirmText: 'Yes, delete',
        cancelText: 'No, keep it'
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    const buttons = document.querySelectorAll('.modal__footer button')
    expect(buttons[0]?.textContent).toContain('No, keep it')
    expect(buttons[1]?.textContent).toContain('Yes, delete')

    wrapper.unmount()
  })

  it('emits confirm event when confirm button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Test message'
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    const buttons = document.querySelectorAll('.modal__footer button')
    const confirmButton = buttons[1] as HTMLElement
    confirmButton?.click()

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('confirm')).toBeTruthy()

    wrapper.unmount()
  })

  it('emits cancel and update:modelValue when cancel button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Test message'
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    const buttons = document.querySelectorAll('.modal__footer button')
    const cancelButton = buttons[0] as HTMLElement
    cancelButton?.click()

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    wrapper.unmount()
  })

  it('applies danger variant to confirm button by default', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Test message'
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    const buttons = document.querySelectorAll('.modal__footer button')
    const confirmButton = buttons[1] as HTMLElement
    expect(confirmButton?.classList.contains('btn--danger')).toBe(true)

    wrapper.unmount()
  })

  it('applies custom variant to confirm button', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Test message',
        confirmVariant: 'primary'
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    const buttons = document.querySelectorAll('.modal__footer button')
    const confirmButton = buttons[1] as HTMLElement
    expect(confirmButton?.classList.contains('btn--primary')).toBe(true)

    wrapper.unmount()
  })

  it('shows loading state on confirm button', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        modelValue: true,
        message: 'Test message',
        loading: true
      },
      attachTo: document.body,
      global: {
        components: {
          Modal,
          Button
        }
      }
    })

    await wrapper.vm.$nextTick()

    const buttons = document.querySelectorAll('.modal__footer button')
    const confirmButton = buttons[1] as HTMLElement
    expect(confirmButton?.classList.contains('btn--loading')).toBe(true)

    wrapper.unmount()
  })
})
