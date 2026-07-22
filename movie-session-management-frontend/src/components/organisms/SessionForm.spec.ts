import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SessionForm from '@/components/organisms/SessionForm.vue'
import * as sessionsApi from '@/api/sessions'
import * as moviesApi from '@/api/movies'
import * as roomsApi from '@/api/rooms'
import { ValidationError } from '@/types/errors'

vi.mock('@/api/sessions')
vi.mock('@/api/movies')
vi.mock('@/api/rooms')

const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('SessionForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render form fields', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    const wrapper = mount(SessionForm)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Nova Sessão')
    expect(wrapper.text()).toContain('Filme')
    expect(wrapper.text()).toContain('Sala')
    expect(wrapper.text()).toContain('Data e Hora de Início')
  })

  it('should render edit mode title when sessionId is provided', async () => {
    const mockSession = {
      id: '1',
      movie_id: '1',
      room_id: '1',
      starts_at: '2024-01-01T10:00:00Z',
      ends_at: '2024-01-01T12:00:00Z',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    vi.mocked(sessionsApi.getSession).mockResolvedValue(mockSession)
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    const wrapper = mount(SessionForm, {
      props: {
        sessionId: '1'
      }
    })
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Editar Sessão')
  })

  it('should validate required fields', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    const wrapper = mount(SessionForm)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Filme é obrigatório')
    expect(wrapper.text()).toContain('Sala é obrigatória')
    expect(wrapper.text()).toContain('Data e hora de início são obrigatórias')
  })

  it('should create session on valid submission', async () => {
    const mockMovie = {
      id: '1',
      title: 'Test Movie',
      director: 'Test Director',
      duration: 120,
      synopsis: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const mockRoom = {
      id: '1',
      number: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const mockSession = {
      id: '1',
      movie_id: '1',
      room_id: '1',
      starts_at: '2024-01-01T10:00:00Z',
      ends_at: '2024-01-01T12:00:00Z',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    vi.mocked(moviesApi.getMovies).mockResolvedValue([mockMovie])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([mockRoom])
    vi.mocked(sessionsApi.createSession).mockResolvedValue(mockSession)

    const wrapper = mount(SessionForm)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    wrapper.vm.formData = {
      movie_id: '1',
      room_id: '1',
      starts_at: '2024-01-01T10:00:00Z'
    }

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(sessionsApi.createSession).toHaveBeenCalledWith({
      movie_id: '1',
      room_id: '1',
      starts_at: '2024-01-01T10:00:00Z'
    })
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'sessions' })
  })

  it('should update session in edit mode', async () => {
    const mockSession = {
      id: '1',
      movie_id: '1',
      room_id: '1',
      starts_at: '2024-01-01T10:00:00Z',
      ends_at: '2024-01-01T12:00:00Z',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const mockMovie = {
      id: '1',
      title: 'Test Movie',
      director: 'Test Director',
      duration: 120,
      synopsis: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const mockRoom = {
      id: '1',
      number: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    vi.mocked(sessionsApi.getSession).mockResolvedValue(mockSession)
    vi.mocked(sessionsApi.updateSession).mockResolvedValue(mockSession)
    vi.mocked(moviesApi.getMovies).mockResolvedValue([mockMovie])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([mockRoom])

    const wrapper = mount(SessionForm, {
      props: {
        sessionId: '1'
      }
    })
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(sessionsApi.updateSession).toHaveBeenCalledWith('1', {
      movie_id: '1',
      room_id: '1',
      starts_at: '2024-01-01T10:00:00Z'
    })
  })

  it('should display time conflict error from backend', async () => {
    const mockMovie = {
      id: '1',
      title: 'Test Movie',
      director: 'Test Director',
      duration: 120,
      synopsis: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const mockRoom = {
      id: '1',
      number: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    vi.mocked(moviesApi.getMovies).mockResolvedValue([mockMovie])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([mockRoom])
    
    // Backend agora envia erro em starts_at ao invés de base
    const validationError = new ValidationError('Validation failed', {
      starts_at: ['conflicts with an existing session in this room'],
      room_id: ['already has a session scheduled at this time']
    })
    vi.mocked(sessionsApi.createSession).mockRejectedValue(validationError)

    const wrapper = mount(SessionForm)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    wrapper.vm.formData = {
      movie_id: '1',
      room_id: '1',
      starts_at: '2024-01-01T10:00:00Z'
    }

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Verifica que o erro de conflito é exibido na área destacada
    expect(wrapper.text()).toContain('Conflito de horário')
    expect(wrapper.text()).toContain('Esta sala já possui uma sessão agendada neste horário')
  })

  it('should display end time preview', async () => {
    const mockMovie = {
      id: '1',
      title: 'Test Movie',
      director: 'Test Director',
      duration: 120,
      synopsis: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const mockRoom = {
      id: '1',
      number: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    vi.mocked(moviesApi.getMovies).mockResolvedValue([mockMovie])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([mockRoom])

    const wrapper = mount(SessionForm)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    wrapper.vm.formData = {
      movie_id: '1',
      room_id: '1',
      starts_at: '2024-01-01T10:00:00Z'
    }
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Horário de término previsto')
  })

  it('should navigate to sessions list on cancel', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    const wrapper = mount(SessionForm)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    const cancelButton = wrapper.findAll('button').find(btn => btn.text() === 'Cancelar')
    await cancelButton?.trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'sessions' })
  })

  it('should clear errors on input change', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    const wrapper = mount(SessionForm)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    const form = wrapper.find('form')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Filme é obrigatório')

    wrapper.vm.formData.movie_id = '1'
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.errors.movie_id).toBe('')
  })
})
