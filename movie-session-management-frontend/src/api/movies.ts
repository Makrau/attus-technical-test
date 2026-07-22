import apiClient from './client'
import type { Movie } from '@/types/models'
import type { CreateMovieDTO, UpdateMovieDTO } from '@/types/api'

export async function getMovies(): Promise<Movie[]> {
  return apiClient.get('/movies')
}

export async function getMovie(id: string): Promise<Movie> {
  return apiClient.get(`/movies/${id}`)
}

export async function createMovie(data: CreateMovieDTO): Promise<Movie> {
  return apiClient.post('/movies', { movie: data })
}

export async function updateMovie(id: string, data: UpdateMovieDTO): Promise<Movie> {
  return apiClient.patch(`/movies/${id}`, { movie: data })
}

export async function deleteMovie(id: string): Promise<void> {
  return apiClient.delete(`/movies/${id}`)
}
