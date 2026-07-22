import { describe, it, expect } from 'vitest'
import { NetworkError, ValidationError, NotFoundError, ServerError, isValidationError, isNetworkError } from '@/types/errors'

describe('API Client Error Classes', () => {
  describe('NetworkError', () => {
    it('should create a NetworkError with default message', () => {
      const error = new NetworkError()
      
      expect(error).toBeInstanceOf(NetworkError)
      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('NetworkError')
      expect(error.message).toBe('Unable to connect to server. Please check your connection.')
    })

    it('should create a NetworkError with custom message', () => {
      const error = new NetworkError('Custom network error')
      
      expect(error.message).toBe('Custom network error')
    })

    it('should be detected by isNetworkError type guard', () => {
      const error = new NetworkError()
      
      expect(isNetworkError(error)).toBe(true)
      expect(isNetworkError(new Error('Regular error'))).toBe(false)
    })
  })

  describe('ValidationError', () => {
    it('should create a ValidationError with validation errors', () => {
      const validationErrors = {
        title: ["can't be blank"],
        duration: ['must be greater than 0']
      }
      
      const error = new ValidationError('Validation failed', validationErrors)
      
      expect(error).toBeInstanceOf(ValidationError)
      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('ValidationError')
      expect(error.message).toBe('Validation failed')
      expect(error.statusCode).toBe(422)
      expect(error.errors).toEqual(validationErrors)
    })

    it('should be detected by isValidationError type guard', () => {
      const error = new ValidationError('Validation failed', {})
      
      expect(isValidationError(error)).toBe(true)
      expect(isValidationError(new Error('Regular error'))).toBe(false)
    })
  })

  describe('NotFoundError', () => {
    it('should create a NotFoundError with default message', () => {
      const error = new NotFoundError()
      
      expect(error).toBeInstanceOf(NotFoundError)
      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('NotFoundError')
      expect(error.message).toBe('Resource not found')
      expect(error.statusCode).toBe(404)
    })

    it('should create a NotFoundError with custom message', () => {
      const error = new NotFoundError('Movie not found')
      
      expect(error.message).toBe('Movie not found')
      expect(error.statusCode).toBe(404)
    })
  })

  describe('ServerError', () => {
    it('should create a ServerError with defaults', () => {
      const error = new ServerError()
      
      expect(error).toBeInstanceOf(ServerError)
      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('ServerError')
      expect(error.message).toBe('Server error occurred. Please try again later.')
      expect(error.statusCode).toBe(500)
    })

    it('should create a ServerError with custom message and status', () => {
      const error = new ServerError('Service unavailable', 503)
      
      expect(error.message).toBe('Service unavailable')
      expect(error.statusCode).toBe(503)
    })

    it('should handle different server error codes', () => {
      const error503 = new ServerError('Service unavailable', 503)
      const error502 = new ServerError('Bad gateway', 502)
      
      expect(error503.statusCode).toBe(503)
      expect(error502.statusCode).toBe(502)
    })
  })

  describe('Error inheritance', () => {
    it('should maintain correct inheritance chain', () => {
      const errors = [
        new NetworkError('Network error'),
        new ValidationError('Validation error', {}),
        new NotFoundError('Not found'),
        new ServerError('Server error', 500)
      ]
      
      errors.forEach(error => {
        expect(error).toBeInstanceOf(Error)
        expect(error.name).toBeDefined()
        expect(error.message).toBeDefined()
        expect(error.stack).toBeDefined()
      })
    })
  })
})
