import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from './Button.vue'

describe('Button Component', () => {
  it('renders with text content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me'
      }
    })

    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button)

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Button, {
      props: { disabled: true }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(Button, {
      props: { loading: true }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('applies correct variant class', () => {
    const wrapper = mount(Button, {
      props: { variant: 'danger' }
    })

    expect(wrapper.classes()).toContain('btn--danger')
  })

  it('applies correct size class', () => {
    const wrapper = mount(Button, {
      props: { size: 'lg' }
    })

    expect(wrapper.classes()).toContain('btn--lg')
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(Button, {
      props: { loading: true }
    })

    expect(wrapper.find('.btn__spinner').exists()).toBe(true)
    expect(wrapper.classes()).toContain('btn--loading')
  })

  it('has disabled attribute when disabled', () => {
    const wrapper = mount(Button, {
      props: { disabled: true }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('has correct type attribute', () => {
    const wrapper = mount(Button, {
      props: { type: 'submit' }
    })

    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('renders all variants correctly', () => {
    const variants = ['primary', 'secondary', 'danger', 'ghost'] as const

    variants.forEach(variant => {
      const wrapper = mount(Button, {
        props: { variant }
      })

      expect(wrapper.classes()).toContain(`btn--${variant}`)
    })
  })

  it('renders all sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const

    sizes.forEach(size => {
      const wrapper = mount(Button, {
        props: { size }
      })

      expect(wrapper.classes()).toContain(`btn--${size}`)
    })
  })
})
