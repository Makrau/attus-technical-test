import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session, SessionWithDetails } from '@/types/models'
import type { CreateSessionDTO, UpdateSessionDTO } from '@/types/api'
import * as sessionsApi from '@/api/sessions'
import { useMoviesStore } from './movies'
import { useRoomsStore } from './rooms'

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref<Session[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const selectedSession = ref<Session | null>(null)

  const allSessions = computed(() => {
    return [...sessions.value].sort((a, b) => 
      new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
    )
  })

  const sessionById = computed(() => {
    return (id: string) => sessions.value.find((session) => session.id === id)
  })

  const sessionsWithDetails = computed((): SessionWithDetails[] => {
    const moviesStore = useMoviesStore()
    const roomsStore = useRoomsStore()

    return allSessions.value.map((session) => ({
      ...session,
      movie: moviesStore.movieById(session.movie_id),
      room: roomsStore.roomById(session.room_id)
    }))
  })

  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  async function fetchSessions() {
    loading.value = true
    error.value = null
    try {
      sessions.value = await sessionsApi.getSessions()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch sessions'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSession(id: string) {
    loading.value = true
    error.value = null
    try {
      selectedSession.value = await sessionsApi.getSession(id)
      return selectedSession.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch session'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSession(data: CreateSessionDTO) {
    loading.value = true
    error.value = null
    try {
      const newSession = await sessionsApi.createSession(data)
      sessions.value.push(newSession)
      return newSession
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create session'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSession(id: string, data: UpdateSessionDTO) {
    loading.value = true
    error.value = null
    try {
      const updatedSession = await sessionsApi.updateSession(id, data)
      const index = sessions.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        sessions.value[index] = updatedSession
      }
      return updatedSession
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update session'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSession(id: string) {
    loading.value = true
    error.value = null
    try {
      await sessionsApi.deleteSession(id)
      sessions.value = sessions.value.filter((s) => s.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete session'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    sessions,
    loading,
    error,
    selectedSession,
    allSessions,
    sessionById,
    sessionsWithDetails,
    isLoading,
    hasError,
    fetchSessions,
    fetchSession,
    createSession,
    updateSession,
    deleteSession
  }
})
