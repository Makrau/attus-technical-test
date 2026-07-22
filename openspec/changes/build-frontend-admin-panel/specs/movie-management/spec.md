## ADDED Requirements

### Requirement: List all movies
The system SHALL display a list of all movies with their title, director, duration, and synopsis.

#### Scenario: Display movies list
- **WHEN** user navigates to the movies page
- **THEN** system displays a table with all movies showing id, title, director, duration (in minutes), and synopsis

#### Scenario: Empty movies list
- **WHEN** there are no movies in the database
- **THEN** system displays an empty state message prompting user to create the first movie

#### Scenario: Movies list loading state
- **WHEN** movies are being fetched from the API
- **THEN** system displays a loading indicator

### Requirement: View movie details
The system SHALL allow users to view detailed information about a specific movie.

#### Scenario: View single movie
- **WHEN** user clicks on a movie in the list
- **THEN** system displays a detailed view with all movie information including UUID, title, director, duration, synopsis, created_at, and updated_at timestamps

### Requirement: Create new movie
The system SHALL allow users to create a new movie with title, director, duration, and optional synopsis.

#### Scenario: Successful movie creation
- **WHEN** user fills the form with valid data (title: "Inception", director: "Christopher Nolan", duration: 148, synopsis: "A thief...")
- **THEN** system creates the movie, returns to the list, and displays a success message

#### Scenario: Create movie with missing required fields
- **WHEN** user submits the form without title, director, or duration
- **THEN** system displays validation errors for each missing field and prevents submission

#### Scenario: Create movie with invalid duration
- **WHEN** user enters a duration less than or equal to 0
- **THEN** system displays error "Duration must be greater than 0" and prevents submission

#### Scenario: Create movie without synopsis
- **WHEN** user submits the form with only title, director, and duration
- **THEN** system creates the movie successfully (synopsis is optional)

### Requirement: Update existing movie
The system SHALL allow users to update any field of an existing movie.

#### Scenario: Successful movie update
- **WHEN** user edits a movie and changes the title from "Matrix" to "The Matrix"
- **THEN** system updates the movie, returns to the list, and displays a success message

#### Scenario: Update with validation errors
- **WHEN** user clears the title field and submits
- **THEN** system displays validation error and prevents submission

### Requirement: Delete movie
The system SHALL allow users to delete a movie with confirmation.

#### Scenario: Successful movie deletion
- **WHEN** user clicks delete button and confirms the action
- **THEN** system deletes the movie, removes it from the list, and displays a success message

#### Scenario: Cancel movie deletion
- **WHEN** user clicks delete button but cancels the confirmation
- **THEN** system does not delete the movie and returns to the previous state

#### Scenario: Delete movie with sessions
- **WHEN** user deletes a movie that has associated sessions
- **THEN** system deletes the movie and all its sessions (cascade delete) and displays a warning message

### Requirement: Handle API errors gracefully
The system SHALL display user-friendly error messages when API operations fail.

#### Scenario: Network error during fetch
- **WHEN** API request fails due to network error
- **THEN** system displays "Unable to connect to server. Please check your connection."

#### Scenario: Server error during creation
- **WHEN** API returns 500 error during movie creation
- **THEN** system displays "Server error occurred. Please try again later."

#### Scenario: Validation errors from backend
- **WHEN** backend returns 422 with validation errors
- **THEN** system displays each validation error next to the corresponding form field
