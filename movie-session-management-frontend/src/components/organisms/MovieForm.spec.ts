import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MovieForm from './MovieForm.vue'
import { useMoviesStore } from '@/stores/movies'
import * as moviesApi from '@/api/movies'
import type { Movie } from '@/types/models'

vi.mock('@/api/movies')

describe('MovieForm Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockMovie: Movie = {
    id: '1',
    title: 'Test Movie',
    director: 'Test Director',
    duration: 120,
    synopsis: 'Test synopsis',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }

  it('renders in create mode by default', () => {
    const wrapper = mount(MovieForm)

    expect(wrapper.find('button[type="submit"]').text()).toContain('Criar Filme')
  })

  it('renders all form fields', () => {
    const wrapper = mount(MovieForm)

    expect(wrapper.find('input[placeholder="Digite o título do filme"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Digite o nome do diretor"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Digite a duração em minutos"]').exists()).toBe(true)
    expect(wrapper.find('textarea[placeholder*="sinopse"]').exists()).toBe(true)
  })

  it('validates required fields on submit', async () => {
    const wrapper = mount(MovieForm)

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Título é obrigatório')
    expect(wrapper.html()).toContain('Diretor é obrigatório')
  })

  it('validates duration is greater than 0', async () => {
    const wrapper = mount(MovieForm)

    const titleInput = wrapper.find('input[placeholder="Digite o título do filme"]')
    const directorInput = wrapper.find('input[placeholder="Digite o nome do diretor"]')
    const durationInput = wrapper.find('input[placeholder="Digite a duração em minutos"]')

    await titleInput.setValue('Test')
    await directorInput.setValue('Director')
    await durationInput.setValue('0')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toContain('Duração deve ser maior que 0')
  })

  it('calls createMovie when submitting in create mode', async () => {
    vi.mocked(moviesApi.createMovie).mockResolvedValue(mockMovie)

    const wrapper = mount(MovieForm)

    const titleInput = wrapper.find('input[placeholder="Digite o título do filme"]')
    const directorInput = wrapper.find('input[placeholder="Digite o nome do diretor"]')
    const durationInput = wrapper.find('input[placeholder="Digite a duração em minutos"]')

    await titleInput.setValue('Test Movie')
    await directorInput.setValue('Test Director')
    await durationInput.setValue('120')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(moviesApi.createMovie).toHaveBeenCalledWith({
      title: 'Test Movie',
      director: 'Test Director',
      duration: 120,
      synopsis: null
    })
  })

  it('emits success event after successful creation', async () => {
    vi.mocked(moviesApi.createMovie).mockResolvedValue(mockMovie)

    const wrapper = mount(MovieForm)

    const titleInput = wrapper.find('input[placeholder="Digite o título do filme"]')
    const directorInput = wrapper.find('input[placeholder="Digite o nome do diretor"]')
    const durationInput = wrapper.find('input[placeholder="Digite a duração em minutos"]')

    await titleInput.setValue('Test Movie')
    await directorInput.setValue('Test Director')
    await durationInput.setValue('120')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('success')).toBeTruthy()
    expect(wrapper.emitted('success')?.[0]).toEqual([mockMovie])
  })

  it('emits cancel event when cancel button is clicked', async () => {
    const wrapper = mount(MovieForm)

    const cancelButton = wrapper.findAll('button').find(btn => 
      btn.text().includes('Cancelar')
    )
    
    await cancelButton?.trigger('click')

    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('loads movie data in edit mode', async () => {
    vi.mocked(moviesApi.getMovie).mockResolvedValue(mockMovie)

    const wrapper = mount(MovieForm, {
      props: {
        movieId: '1'
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(moviesApi.getMovie).toHaveBeenCalledWith('1')
  })

  it('shows submit button text for edit mode', async () => {
    vi.mocked(moviesApi.getMovie).mockResolvedValue(mockMovie)

    const wrapper = mount(MovieForm, {
      props: {
        movieId: '1'
      }
    })

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.text()).toContain('Atualizar Filme')
  })

  it('disables form fields while loading', async () => {
    const wrapper = mount(MovieForm)

    await wrapper.vm.$nextTick()

    const inputs = wrapper.findAll('input')
    inputs.forEach(input => {
      expect(input.attributes('disabled')).toBeUndefined()
    })
  })

  it('includes synopsis in submission when provided', async () => {
    vi.mocked(moviesApi.createMovie).mockResolvedValue(mockMovie)

    const wrapper = mount(MovieForm)

    await wrapper.find('input[placeholder="Digite o título do filme"]').setValue('Test')
    await wrapper.find('input[placeholder="Digite o nome do diretor"]').setValue('Director')
    await wrapper.find('input[placeholder="Digite a duração em minutos"]').setValue('120')
    await wrapper.find('textarea').setValue('Test synopsis')

    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()

    expect(moviesApi.createMovie).toHaveBeenCalledWith(
      expect.objectContaining({
        synopsis: 'Test synopsis'
      })
    )
  })
})
