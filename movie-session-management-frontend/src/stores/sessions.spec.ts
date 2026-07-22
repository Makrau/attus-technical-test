import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSessionsStore } from './sessions'
import { useMoviesStore } from './movies'
import { useRoomsStore } from './rooms'
import * as sessionsApi from '@/api/sessions'
import type { Session } from '@/types/models'

vi.mock('@/api/sessions')

describe('Sessions Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockSession: Session = {
    id: '1',
    movie_id: 'movie-1',
    room_id: 'room-1',
    starts_at: '2026-07-23T20:00:00Z',
    ends_at: '2026-07-23T22:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z'
  }

  describe('fetchSessions', () => {
    it('should fetch and store sessions', async () => {
      const mockSessions = [mockSession]
      vi.mocked(sessionsApi.getSessions).mockResolvedValue(mockSessions)

      const store = useSessionsStore()
      await store.fetchSessions()

      expect(store.sessions).toEqual(mockSessions)
      expect(store.loading).toBe(false)
      expect(store.error).toBe(null)
    })

    it('should handle fetch errors', async () => {
      const error = new Error('Failed to fetch')
      vi.mocked(sessionsApi.getSessions).mockRejectedValue(error)

      const store = useSessionsStore()
      
      try {
        await store.fetchSessions()
      } catch (e) {
        expect(store.error).toBe('Failed to fetch')
      }
    })
  })

  describe('createSession', () => {
    it('should create and add session to store', async () => {
      vi.mocked(sessionsApi.createSession).mockResolvedValue(mockSession)

      const store = useSessionsStore()
      const result = await store.createSession({
        movie_id: 'movie-1',
        room_id: 'room-1',
        starts_at: '2026-07-23T20:00:00Z'
      })

      expect(result).toEqual(mockSession)
      expect(store.sessions).toContainEqual(mockSession)
    })
  })

  describe('updateSession', () => {
    it('should update session in store', async () => {
      const updatedSession = { ...mockSession, starts_at: '2026-07-23T21:00:00Z' }
      vi.mocked(sessionsApi.updateSession).mockResolvedValue(updatedSession)

      const store = useSessionsStore()
      store.sessions = [mockSession]

      const result = await store.updateSession('1', { starts_at: '2026-07-23T21:00:00Z' })

      expect(result).toEqual(updatedSession)
      expect(store.sessions[0]).toEqual(updatedSession)
    })
  })

  describe('deleteSession', () => {
    it('should remove session from store', async () => {
      vi.mocked(sessionsApi.deleteSession).mockResolvedValue()

      const store = useSessionsStore()
      store.sessions = [mockSession]

      await store.deleteSession('1')

      expect(store.sessions).not.toContain(mockSession)
      expect(store.sessions.length).toBe(0)
    })
  })

  describe('getters', () => {
    it('allSessions should return sorted sessions by start time', () => {
      const store = useSessionsStore()
      store.sessions = [
        { ...mockSession, id: '2', starts_at: '2026-07-24T20:00:00Z' },
        { ...mockSession, id: '1', starts_at: '2026-07-23T20:00:00Z' }
      ]

      const sorted = store.allSessions
      expect(sorted[0]?.starts_at).toBe('2026-07-23T20:00:00Z')
      expect(sorted[1]?.starts_at).toBe('2026-07-24T20:00:00Z')
    })

    it('sessionById should return correct session', () => {
      const store = useSessionsStore()
      store.sessions = [mockSession]

      const session = store.sessionById('1')
      expect(session).toEqual(mockSession)
    })

    it('sessionsWithDetails should join with movies and rooms', () => {
      const store = useSessionsStore()
      const moviesStore = useMoviesStore()
      const roomsStore = useRoomsStore()

      moviesStore.movies = [{
        id: 'movie-1',
        title: 'Test Movie',
        director: 'Test Director',
        duration: 120,
        synopsis: null,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }]

      roomsStore.rooms = [{
        id: 'room-1',
        number: 5,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z'
      }]

      store.sessions = [mockSession]

      const sessionsWithDetails = store.sessionsWithDetails

      expect(sessionsWithDetails[0]?.movie?.title).toBe('Test Movie')
      expect(sessionsWithDetails[0]?.room?.number).toBe(5)
    })
  })
})
