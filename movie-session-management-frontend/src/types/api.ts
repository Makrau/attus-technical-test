export interface CreateMovieDTO {
  title: string
  director: string
  duration: number
  synopsis?: string | null
}

export interface UpdateMovieDTO {
  title?: string
  director?: string
  duration?: number
  synopsis?: string | null
}

export interface CreateRoomDTO {
  number: number
}

export interface UpdateRoomDTO {
  number?: number
}

export interface CreateSessionDTO {
  movie_id: string
  room_id: string
  starts_at: string
}

export interface UpdateSessionDTO {
  movie_id?: string
  room_id?: string
  starts_at?: string
}
