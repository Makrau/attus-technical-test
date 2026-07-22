import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMoviesStore } from './movies'
import * as moviesApi from '@/api/movies'
import type { Movie } from '@/types/models'

vi.mock('@/api/movies')

describe('Movies Store', () => {
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

  describe('fetchMovies', () => {
    it('should fetch and store movies', async () => {
      const mockMovies = [mockMovie]
      vi.mocked(moviesApi.getMovies).mockResolvedValue(mockMovies)

      const store = useMoviesStore()
      await store.fetchMovies()

      expect(store.movies).toEqual(mockMovies)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should set loading state during fetch', async () => {
      vi.mocked(moviesApi.getMovies).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve([]), 100))
      )

      const store = useMoviesStore()
      const fetchPromise = store.fetchMovies()
      
      expect(store.loading).toBe(true)
      
      await fetchPromise
      expect(store.loading).toBe(false)
    })

    it('should handle fetch errors', async () => {
      const error = new Error('Failed to fetch')
      vi.mocked(moviesApi.getMovies).mockRejectedValue(error)

      const store = useMoviesStore()
      
      try {
        await store.fetchMovies()
      } catch (e) {
        expect(store.error).toBe('Failed to fetch')
        expect(store.loading).toBe(false)
      }
    })
  })

  describe('createMovie', () => {
    it('should create and add movie to store', async () => {
      vi.mocked(moviesApi.createMovie).mockResolvedValue(mockMovie)

      const store = useMoviesStore()
      const result = await store.createMovie({
        title: 'Test Movie',
        director: 'Test Director',
        duration: 120
      })

      expect(result).toEqual(mockMovie)
      expect(store.movies).toContainEqual(mockMovie)
    })

    it('should handle create errors', async () => {
      const error = new Error('Failed to create')
      vi.mocked(moviesApi.createMovie).mockRejectedValue(error)

      const store = useMoviesStore()
      
      try {
        await store.createMovie({ title: 'Test', director: 'Test', duration: 120 })
      } catch (e) {
        expect(store.error).toBe('Failed to create')
      }
    })
  })

  describe('updateMovie', () => {
    it('should update movie in store', async () => {
      const updatedMovie = { ...mockMovie, title: 'Updated Title' }
      vi.mocked(moviesApi.updateMovie).mockResolvedValue(updatedMovie)

      const store = useMoviesStore()
      store.movies = [mockMovie]

      const result = await store.updateMovie('1', { title: 'Updated Title' })

      expect(result).toEqual(updatedMovie)
      expect(store.movies[0]).toEqual(updatedMovie)
    })
  })

  describe('deleteMovie', () => {
    it('should remove movie from store', async () => {
      vi.mocked(moviesApi.deleteMovie).mockResolvedValue()

      const store = useMoviesStore()
      store.movies = [mockMovie]

      await store.deleteMovie('1')

      expect(store.movies).not.toContain(mockMovie)
      expect(store.movies.length).toBe(0)
    })
  })

  describe('getters', () => {
    it('allMovies should return sorted movies by title', () => {
      const store = useMoviesStore()
      store.movies = [
        { ...mockMovie, id: '2', title: 'Zebra Movie' },
        { ...mockMovie, id: '1', title: 'Alpha Movie' }
      ]

      const sorted = store.allMovies
      expect(sorted[0]?.title).toBe('Alpha Movie')
      expect(sorted[1]?.title).toBe('Zebra Movie')
    })

    it('movieById should return correct movie', () => {
      const store = useMoviesStore()
      store.movies = [mockMovie]

      const movie = store.movieById('1')
      expect(movie).toEqual(mockMovie)
    })

    it('isLoading should reflect loading state', () => {
      const store = useMoviesStore()
      expect(store.isLoading).toBe(false)
      
      store.loading = true
      expect(store.isLoading).toBe(true)
    })

    it('hasError should reflect error state', () => {
      const store = useMoviesStore()
      expect(store.hasError).toBe(false)
      
      store.error = 'Some error'
      expect(store.hasError).toBe(true)
    })
  })
})
