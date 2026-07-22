import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RoomForm from './RoomForm.vue'
import * as roomsApi from '@/api/rooms'
import { ValidationError } from '@/types/errors'
import type { Room } from '@/types/models'

vi.mock('@/api/rooms')

describe('RoomForm Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockRoom: Room = {
    id: '1',
    number: 5,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }

  it('renders in create mode by default', () => {
    const wrapper = mount(RoomForm)

    expect(wrapper.find('button[type="submit"]').text()).toContain('Criar Sala')
  })

  it('renders number input field', () => {
    const wrapper = mount(RoomForm)

    expect(wrapper.find('input[placeholder="Digite o número da sala"]').exists()).toBe(true)
  })

  it('validates required number field on submit', async () => {
    const wrapper = mount(RoomForm)

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Número da sala deve ser maior que 0')
  })

  it('validates number is greater than 0', async () => {
    const wrapper = mount(RoomForm)

    const numberInput = wrapper.find('input[placeholder="Digite o número da sala"]')
    await numberInput.setValue('0')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Número da sala deve ser maior que 0')
  })

  it('calls createRoom when submitting in create mode', async () => {
    vi.mocked(roomsApi.createRoom).mockResolvedValue(mockRoom)

    const wrapper = mount(RoomForm)

    const numberInput = wrapper.find('input[placeholder="Digite o número da sala"]')
    await numberInput.setValue('5')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(roomsApi.createRoom).toHaveBeenCalledWith({
      number: 5
    })
  })

  it('emits success event after successful creation', async () => {
    vi.mocked(roomsApi.createRoom).mockResolvedValue(mockRoom)

    const wrapper = mount(RoomForm)

    const numberInput = wrapper.find('input[placeholder="Digite o número da sala"]')
    await numberInput.setValue('5')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.emitted('success')?.[0]).toEqual([mockRoom])
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(RoomForm)

    const cancelButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Cancelar')
    )
    
    await cancelButton?.trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('loads room data in edit mode', async () => {
    vi.mocked(roomsApi.getRoom).mockResolvedValue(mockRoom)

    const wrapper = mount(RoomForm, {
      props: {
        roomId: '1'
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(roomsApi.getRoom).toHaveBeenCalledWith('1')
  })

  it('shows submit button text for edit mode', async () => {
    vi.mocked(roomsApi.getRoom).mockResolvedValue(mockRoom)

    const wrapper = mount(RoomForm, {
      props: {
        roomId: '1'
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.text()).toContain('Atualizar Sala')
  })

  it('calls updateRoom when submitting in edit mode', async () => {
    vi.mocked(roomsApi.getRoom).mockResolvedValue(mockRoom)
    vi.mocked(roomsApi.updateRoom).mockResolvedValue({ ...mockRoom, number: 10 })

    const wrapper = mount(RoomForm, {
      props: {
        roomId: '1'
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const numberInput = wrapper.find('input[placeholder="Digite o número da sala"]')
    await numberInput.setValue('10')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(roomsApi.updateRoom).toHaveBeenCalledWith('1', {
      number: 10
    })
  })

  it('displays backend validation errors', async () => {
    const validationError = new ValidationError(
      'Validation failed',
      {
        number: ['já está em uso']
      }
    )

    vi.mocked(roomsApi.createRoom).mockRejectedValue(validationError)

    const wrapper = mount(RoomForm)

    const numberInput = wrapper.find('input[placeholder="Digite o número da sala"]')
    await numberInput.setValue('5')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.html()).toContain('já está em uso')
  })
})
