## ADDED Requirements

### Requirement: HTTP client base configuration
The system SHALL provide a configured HTTP client for all API communications.

#### Scenario: Base URL configuration
- **WHEN** HTTP client is initialized
- **THEN** system sets base URL to "http://localhost:3000" (configurable via environment variable)

#### Scenario: JSON content type headers
- **WHEN** making POST, PUT, or PATCH requests
- **THEN** system automatically sets "Content-Type: application/json" header

#### Scenario: Accept JSON responses
- **WHEN** making any API request
- **THEN** system sets "Accept: application/json" header

### Requirement: TypeScript-typed API methods
The system SHALL provide type-safe API methods for all backend endpoints.

#### Scenario: Movies API methods
- **WHEN** calling movies API methods
- **THEN** system provides getMovies(): Promise<Movie[]>, getMovie(id: string): Promise<Movie>, createMovie(data: CreateMovieDTO): Promise<Movie>, updateMovie(id: string, data: UpdateMovieDTO): Promise<Movie>, deleteMovie(id: string): Promise<void>

#### Scenario: Rooms API methods
- **WHEN** calling rooms API methods
- **THEN** system provides getRooms(): Promise<Room[]>, getRoom(id: string): Promise<Room>, createRoom(data: CreateRoomDTO): Promise<Room>, updateRoom(id: string, data: UpdateRoomDTO): Promise<Room>, deleteRoom(id: string): Promise<void>

#### Scenario: Sessions API methods
- **WHEN** calling sessions API methods
- **THEN** system provides getSessions(): Promise<Session[]>, getSession(id: string): Promise<Session>, createSession(data: CreateSessionDTO): Promise<Session>, updateSession(id: string, data: UpdateSessionDTO): Promise<Session>, deleteSession(id: string): Promise<void>

### Requirement: Request interceptors
The system SHALL apply request interceptors before sending HTTP requests.

#### Scenario: Add request timestamp
- **WHEN** making any API request
- **THEN** system logs request method, URL, and timestamp to console (development mode only)

#### Scenario: Handle request cancellation
- **WHEN** component unmounts before request completes
- **THEN** system cancels pending requests using AbortController

### Requirement: Response interceptors
The system SHALL process all API responses through interceptors.

#### Scenario: Successful response parsing
- **WHEN** API returns 2xx status code
- **THEN** system extracts response.data and returns it to caller

#### Scenario: Log response in development
- **WHEN** API responds successfully (development mode)
- **THEN** system logs response status and data to console

### Requirement: Error handling interceptor
The system SHALL standardize error handling across all API calls.

#### Scenario: Network error
- **WHEN** API request fails with network error (no response)
- **THEN** system throws standardized error with message "Unable to connect to server. Please check your connection."

#### Scenario: 404 Not Found
- **WHEN** API returns 404 status code
- **THEN** system throws error with message "Resource not found"

#### Scenario: 422 Validation errors
- **WHEN** API returns 422 with validation errors object
- **THEN** system throws error containing structured validation errors: { field: string[], ... }

#### Scenario: 500 Server error
- **WHEN** API returns 5xx status code
- **THEN** system throws error with message "Server error occurred. Please try again later."

#### Scenario: Unknown error
- **WHEN** API returns unexpected error
- **THEN** system throws error with generic message and logs full error details

### Requirement: TypeScript type definitions
The system SHALL define TypeScript interfaces matching backend models.

#### Scenario: Movie type definition
- **WHEN** working with movie data
- **THEN** system provides interface Movie { id: string; title: string; director: string; duration: number; synopsis: string | null; created_at: string; updated_at: string; }

#### Scenario: Room type definition
- **WHEN** working with room data
- **THEN** system provides interface Room { id: string; number: number; created_at: string; updated_at: string; }

#### Scenario: Session type definition
- **WHEN** working with session data
- **THEN** system provides interface Session { id: string; movie_id: string; room_id: string; starts_at: string; ends_at: string; created_at: string; updated_at: string; }

#### Scenario: DTO type definitions
- **WHEN** creating or updating resources
- **THEN** system provides CreateMovieDTO, UpdateMovieDTO, CreateRoomDTO, UpdateRoomDTO, CreateSessionDTO, UpdateSessionDTO with appropriate required/optional fields

### Requirement: Request payload wrapping
The system SHALL wrap request payloads according to Rails conventions.

#### Scenario: Wrap movie payload
- **WHEN** creating or updating a movie
- **THEN** system wraps payload as { movie: { title, director, duration, synopsis } }

#### Scenario: Wrap room payload
- **WHEN** creating or updating a room
- **THEN** system wraps payload as { room: { number } }

#### Scenario: Wrap session payload
- **WHEN** creating or updating a session
- **THEN** system wraps payload as { session: { movie_id, room_id, starts_at } }

### Requirement: Response unwrapping
The system SHALL unwrap Rails JSON responses to plain objects.

#### Scenario: Unwrap single resource response
- **WHEN** API returns a single resource (create, update, show)
- **THEN** system returns the object directly (no extra wrapping)

#### Scenario: Unwrap array response
- **WHEN** API returns an array (index)
- **THEN** system returns the array directly
