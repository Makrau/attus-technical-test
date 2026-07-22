import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Movie } from '@/types/models'
import type { CreateMovieDTO, UpdateMovieDTO } from '@/types/api'
import * as moviesApi from '@/api/movies'

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref<Movie[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedMovie = ref<Movie | null>(null)

  const allMovies = computed(() => {
    return [...movies.value].sort((a, b) => a.title.localeCompare(b.title))
  })

  const movieById = computed(() => {
    return (id: string) => movies.value.find((movie) => movie.id === id)
  })

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  async function fetchMovies() {
    loading.value = true
    error.value = null
    try {
      movies.value = await moviesApi.getMovies()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch movies'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMovie(id: string) {
    loading.value = true
    error.value = null
    try {
      selectedMovie.value = await moviesApi.getMovie(id)
      return selectedMovie.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch movie'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createMovie(data: CreateMovieDTO) {
    loading.value = true
    error.value = null
    try {
      const newMovie = await moviesApi.createMovie(data)
      movies.value.push(newMovie)
      return newMovie
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create movie'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateMovie(id: string, data: UpdateMovieDTO) {
    loading.value = true
    error.value = null
    try {
      const updatedMovie = await moviesApi.updateMovie(id, data)
      const index = movies.value.findIndex((m) => m.id === id)
      if (index !== -1) {
        movies.value[index] = updatedMovie
      }
      return updatedMovie
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update movie'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteMovie(id: string) {
    loading.value = true
    error.value = null
    try {
      await moviesApi.deleteMovie(id)
      movies.value = movies.value.filter((m) => m.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete movie'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    movies,
    loading,
    error,
    selectedMovie,
    allMovies,
    movieById,
    isLoading,
    hasError,
    fetchMovies,
    fetchMovie,
    createMovie,
    updateMovie,
    deleteMovie
  }
})
