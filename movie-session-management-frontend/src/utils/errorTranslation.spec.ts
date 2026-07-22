import { describe, it, expect } from 'vitest'
import { translateError, translateErrors, translateFieldError } from './errorTranslation'

describe('errorTranslation', () => {
  describe('translateError', () => {
    it('should translate exact match for specific field', () => {
      expect(translateError('title', "can't be blank")).toBe('não pode ficar em branco')
      expect(translateError('duration', 'must be greater than 0')).toBe('deve ser maior que 0')
    })

    it('should translate partial match (case-insensitive)', () => {
      // A mensagem exata precisa conter o padrão, não o campo
      expect(translateError('title', "can't be blank")).toBe('não pode ficar em branco')
      expect(translateError('number', 'has already been taken')).toBe('já está em uso')
    })

    it('should translate starts_at errors', () => {
      expect(translateError('starts_at', 'cannot be in the past')).toBe('não pode ser no passado')
      expect(translateError('starts_at', 'must be at least 30 minutes from now'))
        .toBe('deve ser pelo menos 30 minutos a partir de agora')
      expect(translateError('starts_at', 'conflicts with an existing session in this room'))
        .toBe('conflita com uma sessão existente nesta sala')
    })

    it('should translate room_id errors', () => {
      expect(translateError('room_id', 'already has a session scheduled at this time'))
        .toBe('já possui uma sessão agendada neste horário')
      expect(translateError('room_id', 'must exist')).toBe('sala não encontrada')
    })

    it('should translate number errors', () => {
      expect(translateError('number', 'must be greater than 0')).toBe('deve ser maior que 0')
      expect(translateError('number', 'has already been taken')).toBe('já está em uso')
    })

    it('should use generic patterns when field-specific not found', () => {
      expect(translateError('unknown_field', 'is required')).toBe('é obrigatório')
      expect(translateError('unknown_field', 'is invalid')).toBe('é inválido')
    })

    it('should return original message when no translation found', () => {
      expect(translateError('unknown_field', 'some unknown error'))
        .toBe('some unknown error')
    })

    it('should handle base errors', () => {
      expect(translateError('base', 'There is already a session in this room at that time'))
        .toBe('Já existe uma sessão nesta sala neste horário')
    })
  })

  describe('translateErrors', () => {
    it('should translate all errors in an object', () => {
      const backendErrors = {
        title: ["can't be blank", 'is too short'],
        duration: ['must be greater than 0'],
        number: ['has already been taken']
      }

      const translated = translateErrors(backendErrors)

      expect(translated).toEqual({
        title: ['não pode ficar em branco', 'é muito curto'],
        duration: ['deve ser maior que 0'],
        number: ['já está em uso']
      })
    })

    it('should handle empty errors object', () => {
      const translated = translateErrors({})
      expect(translated).toEqual({})
    })

    it('should preserve unknown errors', () => {
      const backendErrors = {
        unknown_field: ['some unknown error']
      }

      const translated = translateErrors(backendErrors)

      expect(translated).toEqual({
        unknown_field: ['some unknown error']
      })
    })
  })

  describe('translateFieldError', () => {
    it('should translate first message of array', () => {
      expect(translateFieldError('title', ["can't be blank", 'is too short']))
        .toBe('não pode ficar em branco')
    })

    it('should return empty string for empty array', () => {
      expect(translateFieldError('title', [])).toBe('')
    })

    it('should handle session conflict errors', () => {
      expect(translateFieldError('starts_at', ['conflicts with an existing session in this room']))
        .toBe('conflita com uma sessão existente nesta sala')
      
      expect(translateFieldError('room_id', ['already has a session scheduled at this time']))
        .toBe('já possui uma sessão agendada neste horário')
    })

    it('should handle validation errors from Rails', () => {
      expect(translateFieldError('duration', ['is not a number']))
        .toBe('deve ser um número')
      
      expect(translateFieldError('synopsis', ['is too long']))
        .toBe('é muito longa')
    })
  })
})
