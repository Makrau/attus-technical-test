export interface Movie {
  id: string
  title: string
  director: string
  duration: number
  synopsis: string | null
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  number: number
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  movie_id: string
  room_id: string
  starts_at: string
  ends_at: string
  created_at: string
  updated_at: string
}

export interface SessionWithDetails extends Session {
  movie?: Movie
  room?: Room
}
