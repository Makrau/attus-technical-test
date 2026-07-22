import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from './Select.vue'

describe('Select Component', () => {
  const mockOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  it('renders with options', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: mockOptions
      }
    })

    const options = wrapper.findAll('option')
    expect(options).toHaveLength(4)
    expect(options[1]?.text()).toBe('Option 1')
    expect(options[2]?.text()).toBe('Option 2')
    expect(options[3]?.text()).toBe('Option 3')
  })

  it('renders placeholder as first option', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: mockOptions,
        placeholder: 'Choose an option'
      }
    })

    const firstOption = wrapper.find('option')
    expect(firstOption.text()).toBe('Choose an option')
    expect(firstOption.attributes('value')).toBe('')
  })

  it('emits update:modelValue on change', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: mockOptions
      }
    })

    const select = wrapper.find('select')
    await select.setValue('2')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2'])
  })

  it('displays selected value', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '2',
        options: mockOptions
      }
    })

    const select = wrapper.find('select')
    expect((select.element as HTMLSelectElement).value).toBe('2')
  })

  it('renders label when provided', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: mockOptions,
        label: 'Choose'
      }
    })

    expect(wrapper.find('.select__label').text()).toContain('Choose')
  })

  it('shows required indicator', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: mockOptions,
        label: 'Choose',
        required: true
      }
    })

    expect(wrapper.find('.select__required').exists()).toBe(true)
  })

  it('displays error message', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: mockOptions,
        error: 'Selection required'
      }
    })

    expect(wrapper.find('.select__error').text()).toBe('Selection required')
    expect(wrapper.find('.select__field').classes()).toContain('select__field--error')
  })

  it('applies disabled state', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: null,
        options: mockOptions,
        disabled: true
      }
    })

    const select = wrapper.find('select')
    expect(select.attributes('disabled')).toBeDefined()
    expect(wrapper.find('.select__field').classes()).toContain('select__field--disabled')
  })

  it('handles numeric option values', () => {
    const numericOptions = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' }
    ]

    const wrapper = mount(Select, {
      props: {
        modelValue: 1,
        options: numericOptions
      }
    })

    const options = wrapper.findAll('option')
    expect(options[1]?.attributes('value')).toBe('1')
  })

  it('emits null when placeholder is selected', async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '1',
        options: mockOptions
      }
    })

    const select = wrapper.find('select')
    await select.setValue('')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })
})
