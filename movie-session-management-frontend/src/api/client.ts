import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import {
  NetworkError,
  ValidationError,
  NotFoundError,
  ServerError,
  ApiError
} from '@/types/errors'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000
const IS_DEV = import.meta.env.DEV

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (IS_DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      })
    }
    return config
  },
  (error: AxiosError) => {
    if (IS_DEV) {
      console.error('[API Request Error]', error)
    }
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    if (IS_DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }
    return response.data
  },
  (error: AxiosError) => {
    if (!error.response) {
      if (IS_DEV) {
        console.error('[API Network Error]', error.message)
      }
      return Promise.reject(new NetworkError())
    }

    const { status, data } = error.response

    if (IS_DEV) {
      console.error(`[API Error] ${status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, data)
    }

    switch (status) {
      case 404:
        return Promise.reject(new NotFoundError())

      case 422:
        return Promise.reject(
          new ValidationError(
            'Validation failed',
            data as Record<string, string[]>
          )
        )

      case 500:
      case 502:
      case 503:
      case 504:
        return Promise.reject(new ServerError())

      default:
        return Promise.reject(
          new ApiError(
            (data as { message?: string })?.message || 'An error occurred',
            status,
            error
          )
        )
    }
  }
)

export default apiClient
