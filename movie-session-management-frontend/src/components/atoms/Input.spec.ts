import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Input from './Input.vue'

describe('Input Component', () => {
  it('renders with v-model binding', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 'test value',
        'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value })
      }
    })

    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('test value')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Input, {
      props: { modelValue: '' }
    })

    const input = wrapper.find('input')
    await input.setValue('new value')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })

  it('renders label when provided', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        label: 'Username'
      }
    })

    expect(wrapper.find('.input__label').text()).toContain('Username')
  })

  it('shows required indicator when required', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        label: 'Username',
        required: true
      }
    })

    expect(wrapper.find('.input__required').exists()).toBe(true)
    expect(wrapper.find('.input__required').text()).toBe('*')
  })

  it('displays error message when error prop is provided', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        error: 'This field is required'
      }
    })

    expect(wrapper.find('.input__error').text()).toBe('This field is required')
    expect(wrapper.find('.input__field').classes()).toContain('input__field--error')
  })

  it('applies disabled state', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        disabled: true
      }
    })

    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.input__field').classes()).toContain('input__field--disabled')
  })

  it('renders with placeholder', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        placeholder: 'Enter your name'
      }
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter your name')
  })

  it('supports different input types', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: '',
        type: 'password'
      }
    })

    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('handles number values', async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 42,
        type: 'number'
      }
    })

    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('42')
  })
})
