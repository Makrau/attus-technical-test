import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from './Modal.vue'

describe('Modal Component', () => {
  beforeEach(() => {
    const app = document.createElement('div')
    app.id = 'app'
    document.body.appendChild(app)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('renders when modelValue is true', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: 'Test Modal'
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    expect(document.querySelector('.modal')).toBeTruthy()
    expect(document.querySelector('.modal__title')?.textContent).toBe('Test Modal')

    wrapper.unmount()
  })

  it('does not render when modelValue is false', () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: false,
        title: 'Test Modal'
      }
    })

    expect(document.querySelector('.modal')).toBeFalsy()
    wrapper.unmount()
  })

  it('has correct accessibility attributes', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: 'Test Modal'
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    const modal = document.querySelector('.modal')
    expect(modal?.getAttribute('role')).toBe('dialog')
    expect(modal?.getAttribute('aria-modal')).toBe('true')
    expect(modal?.getAttribute('aria-labelledby')).toBeTruthy()

    wrapper.unmount()
  })

  it('emits update:modelValue and close when close button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: 'Test Modal',
        closable: true
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    const closeButton = document.querySelector('.modal__close') as HTMLElement
    closeButton?.click()

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toBeTruthy()

    wrapper.unmount()
  })

  it('emits close when overlay is clicked and closeOnOverlay is true', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: 'Test Modal',
        closeOnOverlay: true
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    const overlay = document.querySelector('.modal-overlay') as HTMLElement
    overlay?.click()

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])

    wrapper.unmount()
  })

  it('does not close when overlay is clicked and closeOnOverlay is false', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: 'Test Modal',
        closeOnOverlay: false
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    const overlay = document.querySelector('.modal-overlay') as HTMLElement
    overlay?.click()

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()

    wrapper.unmount()
  })

  it('prevents body scroll when open', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: false,
        title: 'Test Modal'
      }
    })

    expect(document.body.style.overflow).toBe('')

    await wrapper.setProps({ modelValue: true })
    await wrapper.vm.$nextTick()

    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
  })

  it('renders footer slot when provided', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: 'Test Modal'
      },
      slots: {
        footer: '<button>Save</button>'
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    expect(document.querySelector('.modal__footer')).toBeTruthy()
    expect(document.querySelector('.modal__footer button')?.textContent).toBe('Save')

    wrapper.unmount()
  })

  it('renders default slot content', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: 'Test Modal'
      },
      slots: {
        default: '<p>Modal content</p>'
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    expect(document.querySelector('.modal__body p')?.textContent).toBe('Modal content')

    wrapper.unmount()
  })

  it('hides close button when closable is false', async () => {
    const wrapper = mount(Modal, {
      props: {
        modelValue: true,
        title: 'Test Modal',
        closable: false
      },
      attachTo: document.body
    })

    await wrapper.vm.$nextTick()

    expect(document.querySelector('.modal__close')).toBeFalsy()

    wrapper.unmount()
  })
})
