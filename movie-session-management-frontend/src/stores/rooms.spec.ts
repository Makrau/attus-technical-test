import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRoomsStore } from './rooms'
import * as roomsApi from '@/api/rooms'
import type { Room } from '@/types/models'

vi.mock('@/api/rooms')

describe('Rooms Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockRoom: Room = {
    id: '1',
    number: 5,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }

  describe('fetchRooms', () => {
    it('should fetch and store rooms', async () => {
      const mockRooms = [mockRoom]
      vi.mocked(roomsApi.getRooms).mockResolvedValue(mockRooms)

      const store = useRoomsStore()
      await store.fetchRooms()

      expect(store.rooms).toEqual(mockRooms)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle fetch errors', async () => {
      const error = new Error('Failed to fetch')
      vi.mocked(roomsApi.getRooms).mockRejectedValue(error)

      const store = useRoomsStore()
      
      try {
        await store.fetchRooms()
      } catch (e) {
        expect(store.error).toBe('Failed to fetch')
      }
    })
  })

  describe('createRoom', () => {
    it('should create and add room to store', async () => {
      vi.mocked(roomsApi.createRoom).mockResolvedValue(mockRoom)

      const store = useRoomsStore()
      const result = await store.createRoom({ number: 5 })

      expect(result).toEqual(mockRoom)
      expect(store.rooms).toContainEqual(mockRoom)
    })
  })

  describe('updateRoom', () => {
    it('should update room in store', async () => {
      const updatedRoom = { ...mockRoom, number: 10 }
      vi.mocked(roomsApi.updateRoom).mockResolvedValue(updatedRoom)

      const store = useRoomsStore()
      store.rooms = [mockRoom]

      const result = await store.updateRoom('1', { number: 10 })

      expect(result).toEqual(updatedRoom)
      expect(store.rooms[0]).toEqual(updatedRoom)
    })
  })

  describe('deleteRoom', () => {
    it('should remove room from store', async () => {
      vi.mocked(roomsApi.deleteRoom).mockResolvedValue()

      const store = useRoomsStore()
      store.rooms = [mockRoom]

      await store.deleteRoom('1')

      expect(store.rooms).not.toContain(mockRoom)
      expect(store.rooms.length).toBe(0)
    })
  })

  describe('getters', () => {
    it('allRooms should return sorted rooms by number', () => {
      const store = useRoomsStore()
      store.rooms = [
        { ...mockRoom, id: '2', number: 10 },
        { ...mockRoom, id: '1', number: 3 }
      ]

      const sorted = store.allRooms
      expect(sorted[0]?.number).toBe(3)
      expect(sorted[1]?.number).toBe(10)
    })

    it('roomById should return correct room', () => {
      const store = useRoomsStore()
      store.rooms = [mockRoom]

      const room = store.roomById('1')
      expect(room).toEqual(mockRoom)
    })
  })
})
