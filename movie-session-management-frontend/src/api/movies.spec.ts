import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Movie, CreateMovieDTO, UpdateMovieDTO } from '@/types/api'

// Mock axios antes de importar o módulo que o usa
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        defaults: { headers: { common: {} } },
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() }
        },
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
      }))
    }
  }
})

describe('Movies API', () => {
  let mockAxios: any

  beforeEach(async () => {
    vi.clearAllMocks()
    // Reimportar o módulo para ter acesso ao axios mockado
    const axios = await import('axios')
    mockAxios = axios.default.create()
    
    // Resetar os mocks
    mockAxios.get.mockReset()
    mockAxios.post.mockReset()
    mockAxios.put.mockReset()
    mockAxios.delete.mockReset()
  })

  it('should have API client configured', () => {
    expect(mockAxios).toBeDefined()
    expect(mockAxios.interceptors).toBeDefined()
  })
})
