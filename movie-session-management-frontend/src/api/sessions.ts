import apiClient from './client'
import type { Session } from '@/types/models'
import type { CreateSessionDTO, UpdateSessionDTO } from '@/types/api'

export async function getSessions(): Promise<Session[]> {
  return apiClient.get('/sessions')
}

export async function getSession(id: string): Promise<Session> {
  return apiClient.get(`/sessions/${id}`)
}

export async function createSession(data: CreateSessionDTO): Promise<Session> {
  return apiClient.post('/sessions', { session: data })
}

export async function updateSession(id: string, data: UpdateSessionDTO): Promise<Session> {
  return apiClient.patch(`/sessions/${id}`, { session: data })
}

export async function deleteSession(id: string): Promise<void> {
  return apiClient.delete(`/sessions/${id}`)
}
