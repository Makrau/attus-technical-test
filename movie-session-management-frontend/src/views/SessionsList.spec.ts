import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SessionsList from '@/views/SessionsList.vue'
import * as sessionsApi from '@/api/sessions'
import * as moviesApi from '@/api/movies'
import * as roomsApi from '@/api/rooms'

vi.mock('@/api/sessions')
vi.mock('@/api/movies')
vi.mock('@/api/rooms')

const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('SessionsList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render loading state', async () => {
    let resolvePromise: (value: any) => void
    const loadingPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    vi.mocked(sessionsApi.getSessions).mockReturnValue(loadingPromise as any)
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    const wrapper = mount(SessionsList)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Carregando sessões')

    resolvePromise!([])
    await wrapper.vm.$nextTick()
  })

  it('should render sessions list', async () => {
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

    vi.mocked(sessionsApi.getSessions).mockResolvedValue([mockSession])
    vi.mocked(moviesApi.getMovies).mockResolvedValue([mockMovie])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([mockRoom])

    const wrapper = mount(SessionsList)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.text()).toContain('Sessões')
    expect(wrapper.text()).toContain('Criar Sessão')
  })

  it('should render empty state', async () => {
    vi.mocked(sessionsApi.getSessions).mockResolvedValue([])
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    const wrapper = mount(SessionsList)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    // Empty state é tratado pela própria tabela (SessionsTable)
    expect(wrapper.text()).toContain('Sessões')
  })

  it('should navigate to create session on button click', async () => {
    vi.mocked(sessionsApi.getSessions).mockResolvedValue([])
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    const wrapper = mount(SessionsList)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    const createButton = wrapper.findAll('button').find(btn => btn.text().includes('Criar'))
    await createButton?.trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'sessions-new' })
  })

  it('should show delete confirmation dialog', async () => {
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

    vi.mocked(sessionsApi.getSessions).mockResolvedValue([mockSession])
    vi.mocked(moviesApi.getMovies).mockResolvedValue([mockMovie])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([mockRoom])
    vi.mocked(sessionsApi.deleteSession).mockResolvedValue(undefined)

    const wrapper = mount(SessionsList)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    const sessionWithDetails = {
      ...mockSession,
      movie: mockMovie,
      room: mockRoom
    }

    wrapper.vm.handleDeleteClick(sessionWithDetails)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(wrapper.vm.showDeleteDialog).toBe(true)
  })

  it('should delete session on confirmation', async () => {
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

    vi.mocked(sessionsApi.getSessions).mockResolvedValue([mockSession])
    vi.mocked(moviesApi.getMovies).mockResolvedValue([mockMovie])
    vi.mocked(roomsApi.getRooms).mockResolvedValue([mockRoom])
    vi.mocked(sessionsApi.deleteSession).mockResolvedValue(undefined)

    const wrapper = mount(SessionsList)
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    const sessionWithDetails = {
      ...mockSession,
      movie: mockMovie,
      room: mockRoom
    }

    wrapper.vm.handleDeleteClick(sessionWithDetails)
    await wrapper.vm.$nextTick()

    await wrapper.vm.handleDeleteConfirm()

    expect(sessionsApi.deleteSession).toHaveBeenCalledWith('1')
  })
})
