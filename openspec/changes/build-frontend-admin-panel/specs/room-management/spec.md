## ADDED Requirements

### Requirement: List all rooms
The system SHALL display a list of all cinema rooms with their number.

#### Scenario: Display rooms list
- **WHEN** user navigates to the rooms page
- **THEN** system displays a table with all rooms showing id and room number

#### Scenario: Empty rooms list
- **WHEN** there are no rooms in the database
- **THEN** system displays an empty state message prompting user to create the first room

#### Scenario: Rooms list loading state
- **WHEN** rooms are being fetched from the API
- **THEN** system displays a loading indicator

### Requirement: View room details
The system SHALL allow users to view detailed information about a specific room.

#### Scenario: View single room
- **WHEN** user clicks on a room in the list
- **THEN** system displays a detailed view with room UUID, number, created_at, and updated_at timestamps

### Requirement: Create new room
The system SHALL allow users to create a new cinema room with a unique positive integer number.

#### Scenario: Successful room creation
- **WHEN** user fills the form with valid room number (e.g., 5)
- **THEN** system creates the room, returns to the list, and displays a success message

#### Scenario: Create room without number
- **WHEN** user submits the form without entering a room number
- **THEN** system displays validation error "Room number is required" and prevents submission

#### Scenario: Create room with zero or negative number
- **WHEN** user enters room number as 0 or negative value
- **THEN** system displays validation error "Room number must be greater than 0" and prevents submission

#### Scenario: Create room with duplicate number
- **WHEN** user enters a room number that already exists
- **THEN** backend returns 422 error and system displays "Room number must be unique"

#### Scenario: Create room with non-integer number
- **WHEN** user enters a decimal or non-numeric value
- **THEN** system displays validation error "Room number must be an integer" and prevents submission

### Requirement: Update existing room
The system SHALL allow users to update the room number.

#### Scenario: Successful room update
- **WHEN** user edits a room and changes the number from 3 to 8
- **THEN** system updates the room, returns to the list, and displays a success message

#### Scenario: Update with duplicate number
- **WHEN** user changes room number to one that already exists
- **THEN** system displays validation error "Room number must be unique"

### Requirement: Delete room
The system SHALL allow users to delete a room with confirmation.

#### Scenario: Successful room deletion
- **WHEN** user clicks delete button and confirms the action
- **THEN** system deletes the room, removes it from the list, and displays a success message

#### Scenario: Cancel room deletion
- **WHEN** user clicks delete button but cancels the confirmation
- **THEN** system does not delete the room and returns to the previous state

#### Scenario: Delete room with sessions
- **WHEN** user deletes a room that has associated sessions
- **THEN** system deletes the room and all its sessions (cascade delete) and displays a warning message

### Requirement: Handle API errors gracefully
The system SHALL display user-friendly error messages when API operations fail.

#### Scenario: Network error during fetch
- **WHEN** API request fails due to network error
- **THEN** system displays "Unable to connect to server. Please check your connection."

#### Scenario: Validation errors from backend
- **WHEN** backend returns 422 with validation errors (e.g., duplicate number)
- **THEN** system displays the validation error next to the room number field
