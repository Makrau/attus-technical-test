import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import RoomsList from './RoomsList.vue'
import * as roomsApi from '@/api/rooms'
import type { Room } from '@/types/models'

vi.mock('@/api/rooms')

describe('RoomsList View', () => {
  let router: any

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    
    const app = document.createElement('div')
    app.id = 'app'
    document.body.appendChild(app)

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/rooms', name: 'rooms', component: RoomsList },
        { path: '/rooms/new', name: 'rooms-new', component: { template: '<div>New</div>' } },
        { path: '/rooms/:id/edit', name: 'rooms-edit', component: { template: '<div>Edit</div>' } }
      ]
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  const mockRooms: Room[] = [
    {
      id: '1',
      number: 1,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: '2',
      number: 5,
      created_at: '2026-01-02T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z'
    }
  ]

  it('renders page title and create button', async () => {
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    router.push('/rooms')
    await router.isReady()

    const wrapper = mount(RoomsList, {
      global: {
        plugins: [router]
      },
      attachTo: document.body
    })

    await flushPromises()

    expect(wrapper.find('.rooms-list__title').text()).toBe('Salas')
    expect(wrapper.find('button').text()).toContain('Criar Sala')

    wrapper.unmount()
  })

  it('fetches rooms on mount', async () => {
    vi.mocked(roomsApi.getRooms).mockResolvedValue(mockRooms)

    router.push('/rooms')
    await router.isReady()

    const wrapper = mount(RoomsList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(roomsApi.getRooms).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('displays loading state', async () => {
    let resolvePromise: any
    const promise = new Promise<Room[]>(resolve => {
      resolvePromise = resolve
    })
    vi.mocked(roomsApi.getRooms).mockReturnValue(promise)

    router.push('/rooms')
    await router.isReady()

    const wrapper = mount(RoomsList, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.rooms-list__loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Carregando salas')

    resolvePromise([])
    await flushPromises()

    wrapper.unmount()
  })

  it('displays rooms table when loaded', async () => {
    vi.mocked(roomsApi.getRooms).mockResolvedValue(mockRooms)

    router.push('/rooms')
    await router.isReady()

    const wrapper = mount(RoomsList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.find('.rooms-list__loading').exists()).toBe(false)

    wrapper.unmount()
  })

  it('navigates to create page when create button is clicked', async () => {
    vi.mocked(roomsApi.getRooms).mockResolvedValue([])

    router.push('/rooms')
    await router.isReady()

    const wrapper = mount(RoomsList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    const createButton = wrapper.find('button')
    await createButton.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('rooms-new')

    wrapper.unmount()
  })

  it('opens delete confirmation dialog when delete is clicked', async () => {
    vi.mocked(roomsApi.getRooms).mockResolvedValue(mockRooms)

    router.push('/rooms')
    await router.isReady()

    const wrapper = mount(RoomsList, {
      global: {
        plugins: [router]
      },
      attachTo: document.body
    })

    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handleDeleteClick(mockRooms[0]!)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showDeleteDialog).toBe(true)
    expect(wrapper.vm.roomToDelete).toEqual(mockRooms[0])

    wrapper.unmount()
  })

  it('calls deleteRoom when delete is confirmed', async () => {
    vi.mocked(roomsApi.getRooms).mockResolvedValue(mockRooms)
    vi.mocked(roomsApi.deleteRoom).mockResolvedValue()

    router.push('/rooms')
    await router.isReady()

    const wrapper = mount(RoomsList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    wrapper.vm.roomToDelete = mockRooms[0]!
    wrapper.vm.showDeleteDialog = true
    await wrapper.vm.$nextTick()

    await wrapper.vm.handleDeleteConfirm()
    await flushPromises()

    expect(roomsApi.deleteRoom).toHaveBeenCalledWith('1')
    expect(wrapper.vm.showDeleteDialog).toBe(false)

    wrapper.unmount()
  })
})
