## 1. Project Setup and Configuration

- [x] 1.1 Install Axios and configure TypeScript types (`npm install axios @types/axios`)
- [x] 1.2 Create `.env` file with `VITE_API_BASE_URL=http://localhost:3000` and `VITE_API_TIMEOUT=10000`
- [x] 1.3 Update `tsconfig.json` to enable strict mode and configure path aliases
- [x] 1.4 Create `/src/types/models.ts` with Movie, Room, Session interfaces matching backend schema
- [x] 1.5 Create `/src/types/api.ts` with DTO types (CreateMovieDTO, UpdateMovieDTO, etc.)
- [x] 1.6 Create `/src/types/errors.ts` with custom error classes (NetworkError, ValidationError, etc.)

## 2. Design System Foundation

- [x] 2.1 Create `/src/styles/variables.css` with CSS custom properties for colors (primary, semantic, neutral)
- [x] 2.2 Add typography CSS variables (font-family, sizes, weights, line-heights) to variables.css
- [x] 2.3 Add spacing scale CSS variables (--spacing-1 through --spacing-12) to variables.css
- [x] 2.4 Add border-radius, shadow, and breakpoint CSS variables to variables.css
- [x] 2.5 Create `/src/styles/base.css` with CSS reset and global styles
- [x] 2.6 Import variables.css and base.css in `main.ts`

## 3. API Client Layer

- [x] 3.1 Create `/src/api/client.ts` with configured Axios instance (base URL, headers, timeout)
- [x] 3.2 Add request interceptor in client.ts for logging (development only) and headers
- [x] 3.3 Add response interceptor in client.ts for unwrapping data and error standardization
- [x] 3.4 Create `/src/api/movies.ts` with typed methods (getMovies, getMovie, createMovie, updateMovie, deleteMovie)
- [x] 3.5 Create `/src/api/rooms.ts` with typed methods (getRooms, getRoom, createRoom, updateRoom, deleteRoom)
- [x] 3.6 Create `/src/api/sessions.ts` with typed methods (getSessions, getSession, createSession, updateSession, deleteSession)
- [x] 3.7 Implement request payload wrapping for Rails conventions (wrap with resource name)
- [x] 3.8 Write unit tests for API client error handling in `/src/api/client.spec.ts`

## 4. State Management with Pinia

- [x] 4.1 Create `/src/stores/movies.ts` with state structure (movies, loading, error, selectedMovie)
- [x] 4.2 Implement movies store actions (fetchMovies, fetchMovie, createMovie, updateMovie, deleteMovie)
- [x] 4.3 Implement movies store getters (allMovies sorted by title, movieById, isLoading, hasError)
- [x] 4.4 Create `/src/stores/rooms.ts` with state structure (rooms, loading, error, selectedRoom)
- [x] 4.5 Implement rooms store actions (fetchRooms, fetchRoom, createRoom, updateRoom, deleteRoom)
- [x] 4.6 Implement rooms store getters (allRooms sorted by number, roomById, isLoading, hasError)
- [x] 4.7 Create `/src/stores/sessions.ts` with state structure (sessions, loading, error, selectedSession)
- [x] 4.8 Implement sessions store actions (fetchSessions, fetchSession, createSession, updateSession, deleteSession)
- [x] 4.9 Implement sessions store getter sessionsWithDetails (joins with movies and rooms data)
- [x] 4.10 Create `/src/stores/ui.ts` with modal and toast state management
- [x] 4.11 Write unit tests for movies store in `/src/stores/movies.spec.ts`
- [x] 4.12 Write unit tests for rooms store in `/src/stores/rooms.spec.ts`
- [x] 4.13 Write unit tests for sessions store in `/src/stores/sessions.spec.ts`

## 5. Atomic Components (Atoms)

- [x] 5.1 Create `/src/components/atoms/Button.vue` with variants (primary, secondary, danger, ghost) and sizes
- [x] 5.2 Add loading and disabled states to Button component
- [x] 5.3 Write unit tests for Button in `/src/components/atoms/Button.spec.ts`
- [x] 5.4 Create `/src/components/atoms/Input.vue` with label, error, required indicator, and disabled props
- [x] 5.5 Implement v-model binding in Input component
- [x] 5.6 Write unit tests for Input in `/src/components/atoms/Input.spec.ts`
- [x] 5.7 Create `/src/components/atoms/NumberInput.vue` with min/max validation
- [x] 5.8 Create `/src/components/atoms/Select.vue` with options, placeholder, and search capability
- [x] 5.9 Write unit tests for Select in `/src/components/atoms/Select.spec.ts`
- [x] 5.10 Create `/src/components/atoms/Textarea.vue` with rows prop and v-model binding
- [x] 5.11 Create `/src/components/atoms/DatetimePicker.vue` with calendar and time selection (ISO 8601 output)
- [x] 5.12 Create `/src/components/atoms/Spinner.vue` with size variants (sm, md, lg)
- [x] 5.13 Create `/src/components/atoms/Card.vue` with header, body, footer slots

## 6. Molecular Components (Molecules)

- [x] 6.1 Create `/src/components/molecules/FormField.vue` composing Input with label and error display
- [x] 6.2 Create `/src/components/molecules/TableRow.vue` with action buttons (edit, delete)
- [x] 6.3 Create `/src/components/molecules/Toast.vue` with types (success, error, info) and auto-dismiss
- [x] 6.4 Implement Toast with role="alert" and aria-live for accessibility
- [x] 6.5 Write unit tests for Toast in `/src/components/molecules/Toast.spec.ts`
- [x] 6.6 Create `/src/components/molecules/Modal.vue` with overlay, focus trap, and keyboard support
- [x] 6.7 Implement Modal accessibility (aria-modal, role="dialog", Escape key close)
- [x] 6.8 Write unit tests for Modal in `/src/components/molecules/Modal.spec.ts`
- [x] 6.9 Create `/src/components/molecules/ConfirmDialog.vue` for delete confirmations
- [x] 6.10 Write unit tests for ConfirmDialog in `/src/components/molecules/ConfirmDialog.spec.ts`

## 7. Organism Components (Data Tables)

- [x] 7.1 Create `/src/components/organisms/Table.vue` with thead, tbody, sortable columns, hover effects
- [x] 7.2 Implement empty state message in Table component
- [x] 7.3 Add row-click event emission in Table component
- [x] 7.4 Write unit tests for Table in `/src/components/organisms/Table.spec.ts`
- [x] 7.5 Create `/src/components/organisms/MoviesTable.vue` displaying movies with edit/delete actions
- [x] 7.6 Create `/src/components/organisms/RoomsTable.vue` displaying rooms with edit/delete actions
- [x] 7.7 Create `/src/components/organisms/SessionsTable.vue` displaying sessions with denormalized movie/room data

## 8. Movie Management Views

- [x] 8.1 Create `/src/views/MoviesList.vue` with table, loading state, empty state, and "Create Movie" button
- [x] 8.2 Implement fetchMovies call on component mount in MoviesList
- [x] 8.3 Add navigation to create/edit routes in MoviesList
- [x] 8.4 Implement delete confirmation dialog in MoviesList
- [x] 8.5 Write unit tests for MoviesList in `/src/views/MoviesList.spec.ts`
- [x] 8.6 Create `/src/components/organisms/MovieForm.vue` with fields (title, director, duration, synopsis)
- [x] 8.7 Implement form validation in MovieForm (required fields, duration > 0)
- [x] 8.8 Add create mode logic in MovieForm (calls createMovie action)
- [x] 8.9 Add edit mode logic in MovieForm (loads existing movie, calls updateMovie action)
- [x] 8.10 Display API validation errors next to form fields in MovieForm
- [x] 8.11 Write unit tests for MovieForm in `/src/components/organisms/MovieForm.spec.ts`
- [x] 8.12 Create `/src/views/MovieFormView.vue` wrapper for create/edit routes
- [x] 8.13 Configure Vue Router with movies CRUD routes (/movies, /movies/new, /movies/:id/edit)

## 9. Room Management Views

- [ ] 9.1 Create `/src/views/RoomsList.vue` with table, loading state, empty state, and "Create Room" button
- [ ] 9.2 Implement fetchRooms call on component mount in RoomsList
- [ ] 9.3 Add navigation to create/edit routes in RoomsList
- [ ] 9.4 Implement delete confirmation dialog in RoomsList
- [ ] 9.5 Write unit tests for RoomsList in `/src/views/RoomsList.spec.ts`
- [ ] 9.6 Create `/src/components/organisms/RoomForm.vue` with number field and validation
- [ ] 9.7 Implement form validation in RoomForm (required, positive integer, unique)
- [ ] 9.8 Add create and edit mode logic in RoomForm
- [ ] 9.9 Display duplicate number error from backend in RoomForm
- [ ] 9.10 Write unit tests for RoomForm in `/src/components/organisms/RoomForm.spec.ts`
- [ ] 9.11 Create `/src/views/RoomFormView.vue` wrapper for create/edit routes

## 10. Session Management Views

- [ ] 10.1 Create `/src/views/SessionsList.vue` with table showing movie title, room number, start/end times
- [ ] 10.2 Implement fetchSessions on mount and use sessionsWithDetails getter in SessionsList
- [ ] 10.3 Add navigation to create/edit routes in SessionsList
- [ ] 10.4 Implement delete confirmation dialog in SessionsList
- [ ] 10.5 Write unit tests for SessionsList in `/src/views/SessionsList.spec.ts`
- [ ] 10.6 Create `/src/components/organisms/SessionForm.vue` with movie select, room select, datetime picker
- [ ] 10.7 Load movies and rooms on SessionForm mount for dropdown options
- [ ] 10.8 Implement calculated end time preview (starts_at + movie.duration) in SessionForm
- [ ] 10.9 Implement form validation in SessionForm (required movie, room, starts_at)
- [ ] 10.10 Add create and edit mode logic in SessionForm
- [ ] 10.11 Display time conflict error prominently near room/time fields in SessionForm
- [ ] 10.12 Display backend validation errors (past time, insufficient advance notice) in SessionForm
- [ ] 10.13 Write unit tests for SessionForm in `/src/components/organisms/SessionForm.spec.ts`
- [ ] 10.14 Create `/src/views/SessionFormView.vue` wrapper for create/edit routes

## 11. Routing Configuration

- [ ] 11.1 Update `/src/router/index.ts` with all routes (movies, rooms, sessions with list/create/edit)
- [ ] 11.2 Implement lazy loading for all view components using dynamic imports
- [ ] 11.3 Create `/src/views/Dashboard.vue` as home page with summary statistics
- [ ] 11.4 Add navigation guard for handling unknown routes (404 redirect)
- [ ] 11.5 Write route tests verifying each route renders correct component

## 12. Layout and Navigation

- [ ] 12.1 Create `/src/components/layout/AppLayout.vue` with header, sidebar, and main content area
- [ ] 12.2 Create `/src/components/layout/AppHeader.vue` with application title and navigation menu
- [ ] 12.3 Create `/src/components/layout/AppSidebar.vue` with links to Movies, Rooms, Sessions, Dashboard
- [ ] 12.4 Implement responsive behavior in AppLayout (collapsible sidebar on mobile)
- [ ] 12.5 Add active route highlighting in navigation menu

## 13. Error Handling and UX Polish

- [ ] 13.1 Integrate Toast component with UI store for global notifications
- [ ] 13.2 Show success toasts after create/update/delete operations
- [ ] 13.3 Show error toasts for network failures and server errors
- [ ] 13.4 Add loading spinner overlay for full-page loading states
- [ ] 13.5 Implement error boundary component for unhandled errors
- [ ] 13.6 Add empty state illustrations/messages for all lists
- [ ] 13.7 Ensure all forms have proper focus management (first input focused on mount)

## 14. Accessibility Improvements

- [ ] 14.1 Verify all interactive elements are keyboard accessible (Tab, Enter, Escape)
- [ ] 14.2 Add proper ARIA labels to all form inputs
- [ ] 14.3 Ensure all buttons have descriptive text or aria-label
- [ ] 14.4 Test color contrast ratios meet WCAG AA standards
- [ ] 14.5 Add skip-to-content link in AppHeader
- [ ] 14.6 Ensure focus visible styles are clear for keyboard navigation

## 15. Testing Coverage

- [ ] 15.1 Write integration tests for Movies CRUD flow (list → create → edit → delete)
- [ ] 15.2 Write integration tests for Rooms CRUD flow
- [ ] 15.3 Write integration tests for Sessions CRUD flow with conflict validation
- [ ] 15.4 Run coverage report and ensure >80% coverage for components
- [ ] 15.5 Run coverage report and ensure >90% coverage for stores
- [ ] 15.6 Run coverage report and ensure >90% coverage for API client
- [ ] 15.7 Fix any failing tests and improve coverage gaps

## 16. Documentation and Final Polish

- [ ] 16.1 Create `/docs/setup.md` with development environment setup instructions
- [ ] 16.2 Create `/docs/architecture.md` documenting project structure and design decisions
- [ ] 16.3 Add JSDoc comments to all public component props and emits
- [ ] 16.4 Update README.md with project description, tech stack, and getting started guide
- [ ] 16.5 Add code comments for complex logic (session conflict checking, end time calculation)
- [ ] 16.6 Create `/docs/deployment.md` with build and deployment instructions

## 17. Performance Optimization

- [ ] 17.1 Verify all routes use lazy loading with dynamic imports
- [ ] 17.2 Run Lighthouse audit and optimize Core Web Vitals
- [ ] 17.3 Implement virtual scrolling if tables have >100 rows (optional enhancement)
- [ ] 17.4 Add request debouncing for search/filter inputs (if implemented)
- [ ] 17.5 Verify production build size is <200KB (initial bundle)
- [ ] 17.6 Enable Vite build cache and compression

## 18. Final Testing and QA

- [ ] 18.1 Test all CRUD operations against running Rails backend
- [ ] 18.2 Test session conflict validation with overlapping times
- [ ] 18.3 Test session advance notice validation (< 30 minutes)
- [ ] 18.4 Test cascade delete behavior (delete movie/room with sessions)
- [ ] 18.5 Test all error scenarios (network error, 404, 422, 500)
- [ ] 18.6 Test responsive design on mobile, tablet, and desktop breakpoints
- [ ] 18.7 Test keyboard navigation through all views and forms
- [ ] 18.8 Test with screen reader (basic announcement verification)
