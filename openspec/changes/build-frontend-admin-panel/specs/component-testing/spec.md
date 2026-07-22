## ADDED Requirements

### Requirement: Testing framework setup
The system SHALL use Vitest and Vue Test Utils for component testing.

#### Scenario: Vitest configuration
- **WHEN** running tests
- **THEN** system uses Vitest with Vue plugin, jsdom environment, and coverage collection enabled

#### Scenario: Test file location
- **WHEN** organizing tests
- **THEN** system places test files adjacent to components with .spec.ts or .test.ts extension (e.g., Button.vue → Button.spec.ts)

#### Scenario: Test script commands
- **WHEN** running tests
- **THEN** system provides npm scripts: "test" (run all tests), "test:ui" (Vitest UI), "test:coverage" (with coverage report)

### Requirement: Component mounting utilities
The system SHALL provide standardized test setup for components.

#### Scenario: Mount component with default props
- **WHEN** testing a component
- **THEN** system uses mount() or shallowMount() from @vue/test-utils with default props

#### Scenario: Mount component with Pinia stores
- **WHEN** testing components that use stores
- **THEN** system creates test Pinia instance with createPinia() and provides it in mount options

#### Scenario: Mount component with router
- **WHEN** testing components that use router
- **THEN** system creates test router with createRouter() and provides it in mount options

### Requirement: Button component tests
The system SHALL test Button component behavior.

#### Scenario: Render button with text
- **WHEN** mounting Button with text prop
- **THEN** test verifies button renders with correct text content

#### Scenario: Button click event
- **WHEN** user clicks button
- **THEN** test verifies click event is emitted

#### Scenario: Disabled button
- **WHEN** mounting Button with disabled prop
- **THEN** test verifies button has disabled attribute and does not emit click event

#### Scenario: Button variants
- **WHEN** mounting Button with variant prop (primary, secondary, danger, ghost)
- **THEN** test verifies button has correct CSS class

#### Scenario: Loading button
- **WHEN** mounting Button with loading prop
- **THEN** test verifies spinner is visible and button is disabled

### Requirement: Input component tests
The system SHALL test Input component behavior.

#### Scenario: Input v-model binding
- **WHEN** user types in input field
- **THEN** test verifies update:modelValue event is emitted with correct value

#### Scenario: Input validation error display
- **WHEN** mounting Input with error prop
- **THEN** test verifies error message is displayed and input has error styling

#### Scenario: Required input indicator
- **WHEN** mounting Input with required prop
- **THEN** test verifies asterisk or required indicator is visible

#### Scenario: Disabled input
- **WHEN** mounting Input with disabled prop
- **THEN** test verifies input has disabled attribute and cannot be edited

### Requirement: Table component tests
The system SHALL test Table component behavior.

#### Scenario: Render table with data
- **WHEN** mounting Table with data array
- **THEN** test verifies correct number of rows are rendered with correct data

#### Scenario: Empty table state
- **WHEN** mounting Table with empty array
- **THEN** test verifies empty state message is displayed

#### Scenario: Table row click
- **WHEN** user clicks table row
- **THEN** test verifies row-click event is emitted with row data

#### Scenario: Table action buttons
- **WHEN** clicking edit or delete buttons in table row
- **THEN** test verifies corresponding events are emitted with row id

### Requirement: Modal component tests
The system SHALL test Modal component behavior.

#### Scenario: Modal visibility
- **WHEN** mounting Modal with show prop
- **THEN** test verifies modal is visible or hidden based on prop value

#### Scenario: Modal close on overlay click
- **WHEN** user clicks modal overlay
- **THEN** test verifies close event is emitted

#### Scenario: Modal close on Escape key
- **WHEN** user presses Escape key
- **THEN** test verifies close event is emitted

#### Scenario: Modal focus trap
- **WHEN** modal is opened
- **THEN** test verifies focus is trapped within modal and tabs through focusable elements

### Requirement: Movies list view tests
The system SHALL test MoviesListView component.

#### Scenario: Fetch movies on mount
- **WHEN** component is mounted
- **THEN** test verifies fetchMovies action is called on movies store

#### Scenario: Display loading state
- **WHEN** movies are being fetched
- **THEN** test verifies loading spinner is displayed

#### Scenario: Display movies table
- **WHEN** movies are loaded successfully
- **THEN** test verifies table is rendered with correct movies data

#### Scenario: Navigate to create movie
- **WHEN** user clicks "Create Movie" button
- **THEN** test verifies router navigates to /movies/new

#### Scenario: Navigate to edit movie
- **WHEN** user clicks edit button on movie row
- **THEN** test verifies router navigates to /movies/:id/edit

#### Scenario: Delete movie confirmation
- **WHEN** user clicks delete button
- **THEN** test verifies confirmation dialog is displayed

#### Scenario: Delete movie action
- **WHEN** user confirms deletion
- **THEN** test verifies deleteMovie action is called with correct id

### Requirement: Movie form tests
The system SHALL test MovieForm component.

#### Scenario: Form validation on submit
- **WHEN** user submits form with empty fields
- **THEN** test verifies validation errors are displayed

#### Scenario: Create movie submission
- **WHEN** user fills form and submits (create mode)
- **THEN** test verifies createMovie action is called with form data

#### Scenario: Update movie submission
- **WHEN** user modifies form and submits (edit mode)
- **THEN** test verifies updateMovie action is called with id and updated data

#### Scenario: API error display
- **WHEN** API returns validation errors
- **THEN** test verifies error messages are displayed next to corresponding fields

### Requirement: Sessions form tests
The system SHALL test SessionForm component.

#### Scenario: Load movies and rooms on mount
- **WHEN** component is mounted
- **THEN** test verifies fetchMovies and fetchRooms actions are called

#### Scenario: Calculate end time preview
- **WHEN** user selects movie and start time
- **THEN** test verifies calculated end time is displayed

#### Scenario: Display time conflict error
- **WHEN** API returns room conflict error
- **THEN** test verifies conflict error message is displayed prominently

### Requirement: Store tests
The system SHALL test Pinia store actions and getters.

#### Scenario: Movies store fetchMovies action
- **WHEN** fetchMovies is called
- **THEN** test verifies API is called, loading state is set correctly, and movies are populated on success

#### Scenario: Movies store error handling
- **WHEN** API call fails
- **THEN** test verifies error state is set with error message

#### Scenario: Movies store getters
- **WHEN** accessing allMovies getter
- **THEN** test verifies movies are sorted by title alphabetically

### Requirement: API client tests
The system SHALL test API client methods.

#### Scenario: API method calls correct endpoint
- **WHEN** calling getMovies()
- **THEN** test verifies HTTP GET request is made to /movies

#### Scenario: API method includes payload
- **WHEN** calling createMovie(data)
- **THEN** test verifies HTTP POST request is made to /movies with correctly wrapped payload

#### Scenario: API error handling
- **WHEN** API returns 422 error
- **THEN** test verifies error is thrown with structured validation errors

### Requirement: Test coverage requirements
The system SHALL maintain high test coverage.

#### Scenario: Component coverage threshold
- **WHEN** running coverage report
- **THEN** system requires minimum 80% coverage for components

#### Scenario: Store coverage threshold
- **WHEN** running coverage report
- **THEN** system requires minimum 90% coverage for store files

#### Scenario: API client coverage threshold
- **WHEN** running coverage report
- **THEN** system requires minimum 90% coverage for API client

### Requirement: Test best practices
The system SHALL follow Vue testing best practices.

#### Scenario: Test user behavior not implementation
- **WHEN** writing tests
- **THEN** test verifies what user sees and does, not internal component state or methods

#### Scenario: Use semantic queries
- **WHEN** finding elements
- **THEN** test uses getByRole, getByLabelText, getByText over getByTestId when possible

#### Scenario: Avoid testing library internals
- **WHEN** writing tests
- **THEN** test does not access wrapper.vm or internal component properties

#### Scenario: Test accessibility
- **WHEN** testing components
- **THEN** test verifies proper ARIA attributes and keyboard navigation

### Requirement: Mock API calls in tests
The system SHALL mock HTTP requests in component tests.

#### Scenario: Mock API responses
- **WHEN** testing components that make API calls
- **THEN** test uses vi.mock() to mock API client and return controlled responses

#### Scenario: Simulate API errors
- **WHEN** testing error handling
- **THEN** test mocks API to throw errors and verifies error states
