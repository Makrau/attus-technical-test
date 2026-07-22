import apiClient from './client'
import type { Room } from '@/types/models'
import type { CreateRoomDTO, UpdateRoomDTO } from '@/types/api'

export async function getRooms(): Promise<Room[]> {
  return apiClient.get('/rooms')
}

export async function getRoom(id: string): Promise<Room> {
  return apiClient.get(`/rooms/${id}`)
}

export async function createRoom(data: CreateRoomDTO): Promise<Room> {
  return apiClient.post('/rooms', { room: data })
}

export async function updateRoom(id: string, data: UpdateRoomDTO): Promise<Room> {
  return apiClient.patch(`/rooms/${id}`, { room: data })
}

export async function deleteRoom(id: string): Promise<void> {
  return apiClient.delete(`/rooms/${id}`)
}
