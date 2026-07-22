## ADDED Requirements

### Requirement: Pinia store configuration
The system SHALL use Pinia as the centralized state management solution.

#### Scenario: Initialize Pinia
- **WHEN** application starts
- **THEN** system creates and registers Pinia instance in main.ts

#### Scenario: DevTools integration
- **WHEN** running in development mode
- **THEN** system enables Pinia DevTools for state inspection

### Requirement: Movies store
The system SHALL provide a Pinia store for movies state management.

#### Scenario: Movies state structure
- **WHEN** movies store is initialized
- **THEN** system provides state: { movies: Movie[], loading: boolean, error: string | null, selectedMovie: Movie | null }

#### Scenario: Fetch all movies action
- **WHEN** fetchMovies action is called
- **THEN** system sets loading=true, calls API getMovies(), updates movies state on success, sets error on failure, sets loading=false

#### Scenario: Fetch single movie action
- **WHEN** fetchMovie(id) action is called
- **THEN** system calls API getMovie(id), updates selectedMovie state on success

#### Scenario: Create movie action
- **WHEN** createMovie(data) action is called
- **THEN** system calls API createMovie(data), adds new movie to movies array on success, returns created movie

#### Scenario: Update movie action
- **WHEN** updateMovie(id, data) action is called
- **THEN** system calls API updateMovie(id, data), updates movie in movies array on success, returns updated movie

#### Scenario: Delete movie action
- **WHEN** deleteMovie(id) action is called
- **THEN** system calls API deleteMovie(id), removes movie from movies array on success

#### Scenario: Movies getters
- **WHEN** accessing computed data
- **THEN** system provides getters: allMovies (sorted by title), movieById(id), isLoading, hasError

### Requirement: Rooms store
The system SHALL provide a Pinia store for rooms state management.

#### Scenario: Rooms state structure
- **WHEN** rooms store is initialized
- **THEN** system provides state: { rooms: Room[], loading: boolean, error: string | null, selectedRoom: Room | null }

#### Scenario: Fetch all rooms action
- **WHEN** fetchRooms action is called
- **THEN** system sets loading=true, calls API getRooms(), updates rooms state on success, sets error on failure, sets loading=false

#### Scenario: Create room action
- **WHEN** createRoom(data) action is called
- **THEN** system calls API createRoom(data), adds new room to rooms array on success

#### Scenario: Update room action
- **WHEN** updateRoom(id, data) action is called
- **THEN** system calls API updateRoom(id, data), updates room in rooms array on success

#### Scenario: Delete room action
- **WHEN** deleteRoom(id) action is called
- **THEN** system calls API deleteRoom(id), removes room from rooms array on success

#### Scenario: Rooms getters
- **WHEN** accessing computed data
- **THEN** system provides getters: allRooms (sorted by number), roomById(id), isLoading, hasError

### Requirement: Sessions store
The system SHALL provide a Pinia store for sessions state management.

#### Scenario: Sessions state structure
- **WHEN** sessions store is initialized
- **THEN** system provides state: { sessions: Session[], loading: boolean, error: string | null, selectedSession: Session | null }

#### Scenario: Fetch all sessions action
- **WHEN** fetchSessions action is called
- **THEN** system sets loading=true, calls API getSessions(), updates sessions state on success, sets error on failure, sets loading=false

#### Scenario: Create session action
- **WHEN** createSession(data) action is called
- **THEN** system calls API createSession(data), adds new session to sessions array on success

#### Scenario: Update session action
- **WHEN** updateSession(id, data) action is called
- **THEN** system calls API updateSession(id, data), updates session in sessions array on success

#### Scenario: Delete session action
- **WHEN** deleteSession(id) action is called
- **THEN** system calls API deleteSession(id), removes session from sessions array on success

#### Scenario: Sessions with denormalized data getter
- **WHEN** accessing sessions with related data
- **THEN** system provides getter sessionsWithDetails that joins sessions with movies and rooms data

#### Scenario: Sessions getters
- **WHEN** accessing computed data
- **THEN** system provides getters: allSessions (sorted by starts_at), sessionById(id), sessionsWithDetails, isLoading, hasError

### Requirement: UI store
The system SHALL provide a Pinia store for UI state management.

#### Scenario: UI state structure
- **WHEN** UI store is initialized
- **THEN** system provides state: { showModal: boolean, modalType: string | null, toastMessage: string | null, toastType: 'success' | 'error' | 'info' | null }

#### Scenario: Show modal action
- **WHEN** showModal(type) action is called
- **THEN** system sets showModal=true and modalType to specified type

#### Scenario: Hide modal action
- **WHEN** hideModal action is called
- **THEN** system sets showModal=false and modalType=null

#### Scenario: Show toast notification action
- **WHEN** showToast(message, type) action is called
- **THEN** system sets toastMessage and toastType, automatically clears after 3 seconds

#### Scenario: Clear toast action
- **WHEN** clearToast action is called
- **THEN** system sets toastMessage=null and toastType=null

### Requirement: Store composition
The system SHALL allow stores to access other stores when needed.

#### Scenario: Sessions store accesses movies and rooms
- **WHEN** sessions store needs movie/room details
- **THEN** system allows accessing useMoviesStore() and useRoomsStore() from within sessions store

### Requirement: Error state handling
The system SHALL standardize error handling across all stores.

#### Scenario: API error in store action
- **WHEN** API call fails in any store action
- **THEN** system sets error state with error message, preserves existing data, sets loading=false

#### Scenario: Clear error state
- **WHEN** new successful action is executed
- **THEN** system clears error state automatically
