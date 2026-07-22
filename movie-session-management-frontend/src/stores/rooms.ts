import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Room } from '@/types/models'
import type { CreateRoomDTO, UpdateRoomDTO } from '@/types/api'
import * as roomsApi from '@/api/rooms'

export const useRoomsStore = defineStore('rooms', () => {
  const rooms = ref<Room[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedRoom = ref<Room | null>(null)

  const allRooms = computed(() => {
    return [...rooms.value].sort((a, b) => a.number - b.number)
  })

  const roomById = computed(() => {
    return (id: string) => rooms.value.find((room) => room.id === id)
  })

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  async function fetchRooms() {
    loading.value = true
    error.value = null
    try {
      rooms.value = await roomsApi.getRooms()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch rooms'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRoom(id: string) {
    loading.value = true
    error.value = null
    try {
      selectedRoom.value = await roomsApi.getRoom(id)
      return selectedRoom.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch room'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRoom(data: CreateRoomDTO) {
    loading.value = true
    error.value = null
    try {
      const newRoom = await roomsApi.createRoom(data)
      rooms.value.push(newRoom)
      return newRoom
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create room'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRoom(id: string, data: UpdateRoomDTO) {
    loading.value = true
    error.value = null
    try {
      const updatedRoom = await roomsApi.updateRoom(id, data)
      const index = rooms.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        rooms.value[index] = updatedRoom
      }
      return updatedRoom
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update room'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRoom(id: string) {
    loading.value = true
    error.value = null
    try {
      await roomsApi.deleteRoom(id)
      rooms.value = rooms.value.filter((r) => r.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete room'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    rooms,
    loading,
    error,
    selectedRoom,
    allRooms,
    roomById,
    isLoading,
    hasError,
    fetchRooms,
    fetchRoom,
    createRoom,
    updateRoom,
    deleteRoom
  }
})
