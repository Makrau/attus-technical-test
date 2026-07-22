import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import MoviesList from './MoviesList.vue'
import { useMoviesStore } from '@/stores/movies'
import * as moviesApi from '@/api/movies'
import type { Movie } from '@/types/models'

vi.mock('@/api/movies')

describe('MoviesList View', () => {
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
        { path: '/movies', name: 'movies', component: MoviesList },
        { path: '/movies/new', name: 'movies-new', component: { template: '<div>New</div>' } },
        { path: '/movies/:id/edit', name: 'movies-edit', component: { template: '<div>Edit</div>' } }
      ]
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  const mockMovies: Movie[] = [
    {
      id: '1',
      title: 'Test Movie 1',
      director: 'Director 1',
      duration: 120,
      synopsis: 'Synopsis 1',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'Test Movie 2',
      director: 'Director 2',
      duration: 90,
      synopsis: null,
      created_at: '2026-01-02T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z'
    }
  ]

  it('renders page title and create button', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])

    router.push('/movies')
    await router.isReady()

    const wrapper = mount(MoviesList, {
      global: {
        plugins: [router]
      },
      attachTo: document.body
    })

    await flushPromises()

    expect(wrapper.find('.movies-list__title').text()).toBe('Filmes')
    expect(wrapper.find('button').text()).toContain('Criar Filme')

    wrapper.unmount()
  })

  it('fetches movies on mount', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue(mockMovies)

    router.push('/movies')
    await router.isReady()

    const wrapper = mount(MoviesList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(moviesApi.getMovies).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('displays loading state', async () => {
    let resolvePromise: any
    const promise = new Promise<Movie[]>(resolve => {
      resolvePromise = resolve
    })
    vi.mocked(moviesApi.getMovies).mockReturnValue(promise)

    router.push('/movies')
    await router.isReady()

    const wrapper = mount(MoviesList, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.movies-list__loading').exists()).toBe(true)
    expect(wrapper.text()).toContain('Carregando filmes')

    resolvePromise([])
    await flushPromises()

    wrapper.unmount()
  })

  it('displays movies table when loaded', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue(mockMovies)

    router.push('/movies')
    await router.isReady()

    const wrapper = mount(MoviesList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.find('.movies-list__loading').exists()).toBe(false)

    wrapper.unmount()
  })

  it('navigates to create page when create button is clicked', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue([])

    router.push('/movies')
    await router.isReady()

    const wrapper = mount(MoviesList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    const createButton = wrapper.find('button')
    await createButton.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('movies-new')

    wrapper.unmount()
  })

  it('opens delete confirmation dialog when delete is clicked', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue(mockMovies)

    router.push('/movies')
    await router.isReady()

    const wrapper = mount(MoviesList, {
      global: {
        plugins: [router]
      },
      attachTo: document.body
    })

    await flushPromises()
    await wrapper.vm.$nextTick()

    wrapper.vm.handleDeleteClick(mockMovies[0]!)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showDeleteDialog).toBe(true)
    expect(wrapper.vm.movieToDelete).toEqual(mockMovies[0])

    wrapper.unmount()
  })

  it('calls deleteMovie when delete is confirmed', async () => {
    vi.mocked(moviesApi.getMovies).mockResolvedValue(mockMovies)
    vi.mocked(moviesApi.deleteMovie).mockResolvedValue()

    router.push('/movies')
    await router.isReady()

    const wrapper = mount(MoviesList, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    wrapper.vm.movieToDelete = mockMovies[0]!
    wrapper.vm.showDeleteDialog = true
    await wrapper.vm.$nextTick()

    await wrapper.vm.handleDeleteConfirm()
    await flushPromises()

    expect(moviesApi.deleteMovie).toHaveBeenCalledWith('1')
    expect(wrapper.vm.showDeleteDialog).toBe(false)

    wrapper.unmount()
  })
})
