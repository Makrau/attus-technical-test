## ADDED Requirements

### Requirement: List all sessions
The system SHALL display a list of all sessions with movie title, room number, start time, and end time.

#### Scenario: Display sessions list
- **WHEN** user navigates to the sessions page
- **THEN** system displays a table with all sessions showing session id, movie title, room number, starts_at, and ends_at timestamps

#### Scenario: Empty sessions list
- **WHEN** there are no sessions in the database
- **THEN** system displays an empty state message prompting user to create the first session

#### Scenario: Sessions list loading state
- **WHEN** sessions are being fetched from the API
- **THEN** system displays a loading indicator

#### Scenario: Sessions list with denormalized data
- **WHEN** displaying sessions
- **THEN** system shows movie title and room number (not just IDs) by joining with movies and rooms data

### Requirement: View session details
The system SHALL allow users to view detailed information about a specific session.

#### Scenario: View single session
- **WHEN** user clicks on a session in the list
- **THEN** system displays detailed view with session UUID, movie details (title, director, duration), room number, starts_at, ends_at, created_at, and updated_at timestamps

### Requirement: Create new session
The system SHALL allow users to create a new session by selecting a movie, room, and start datetime.

#### Scenario: Successful session creation
- **WHEN** user selects movie "Inception" (UUID), room 5 (UUID), and start time "2026-07-23T20:00:00Z"
- **THEN** system creates the session with ends_at calculated automatically (starts_at + movie duration), returns to the list, and displays success message

#### Scenario: Create session without movie
- **WHEN** user submits form without selecting a movie
- **THEN** system displays validation error "Movie is required" and prevents submission

#### Scenario: Create session without room
- **WHEN** user submits form without selecting a room
- **THEN** system displays validation error "Room is required" and prevents submission

#### Scenario: Create session without start time
- **WHEN** user submits form without selecting a start time
- **THEN** system displays validation error "Start time is required" and prevents submission

#### Scenario: Create session in the past
- **WHEN** user selects a start time before the current time
- **THEN** backend returns 422 error and system displays "Start time cannot be in the past"

#### Scenario: Create session without minimum advance notice
- **WHEN** user selects a start time less than 30 minutes from now
- **THEN** backend returns 422 error and system displays "Session must be scheduled at least 30 minutes in advance"

#### Scenario: Create session with room conflict
- **WHEN** user creates a session where the time overlaps with another session in the same room
- **THEN** backend returns 422 error and system displays "There is already a session in this room at that time"

#### Scenario: Display calculated end time preview
- **WHEN** user selects a movie and start time
- **THEN** system displays a preview of the calculated end time (starts_at + movie.duration) before submission

### Requirement: Update existing session
The system SHALL allow users to update movie, room, or start time of an existing session.

#### Scenario: Successful session update
- **WHEN** user edits a session and changes the start time
- **THEN** system updates the session with new ends_at calculated, returns to list, and displays success message

#### Scenario: Update session creating time conflict
- **WHEN** user updates a session causing a time overlap with another session in the same room
- **THEN** backend returns 422 error and system displays "There is already a session in this room at that time"

#### Scenario: Update session to past time
- **WHEN** user changes start time to a past datetime
- **THEN** backend returns 422 error and system displays appropriate validation message

### Requirement: Delete session
The system SHALL allow users to delete a session with confirmation.

#### Scenario: Successful session deletion
- **WHEN** user clicks delete button and confirms the action
- **THEN** system deletes the session, removes it from the list, and displays a success message

#### Scenario: Cancel session deletion
- **WHEN** user clicks delete button but cancels the confirmation
- **THEN** system does not delete the session and returns to the previous state

### Requirement: Movie and room selection interface
The system SHALL provide dropdown selectors for choosing movies and rooms.

#### Scenario: Display movie dropdown
- **WHEN** user is on session create/edit form
- **THEN** system displays a dropdown with all movies showing title and director

#### Scenario: Display room dropdown
- **WHEN** user is on session create/edit form
- **THEN** system displays a dropdown with all rooms showing room number

#### Scenario: Load movies and rooms on form mount
- **WHEN** session form is opened
- **THEN** system fetches and caches movies and rooms list for the dropdowns

### Requirement: Handle API errors gracefully
The system SHALL display user-friendly error messages when API operations fail.

#### Scenario: Network error during fetch
- **WHEN** API request fails due to network error
- **THEN** system displays "Unable to connect to server. Please check your connection."

#### Scenario: Time conflict validation error
- **WHEN** backend returns 422 with room conflict error
- **THEN** system displays "There is already a session in this room at that time" prominently near the room and time fields

#### Scenario: Invalid movie or room reference
- **WHEN** backend returns error for invalid movie_id or room_id
- **THEN** system displays "Selected movie or room no longer exists. Please refresh and try again."
