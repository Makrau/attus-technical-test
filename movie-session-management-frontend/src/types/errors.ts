export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Unable to connect to server. Please check your connection.') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message, 422)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Server error occurred. Please try again later.', statusCode = 500) {
    super(message, statusCode)
    this.name = 'ServerError'
  }
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}
