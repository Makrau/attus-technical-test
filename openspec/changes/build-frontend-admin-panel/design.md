## Context

The Movie Session Management system has a complete Rails 8 API backend with PostgreSQL, but no user interface. The backend exposes RESTful JSON endpoints for managing movies, rooms, and sessions with comprehensive validation rules including time conflict detection. The frontend project already exists with a Vue 3 boilerplate using Vite, TypeScript, Pinia, and Vitest.

**Current state:**
- Backend: Rails 8 API-only mode running on port 3000
- Frontend: Empty Vue 3 project with basic dependencies installed
- Models use UUID primary keys (generated via PostgreSQL pgcrypto)
- Backend validates session conflicts, minimum advance time (30 minutes), and cascade deletes

**Constraints:**
- Must consume existing backend API without modifications
- Must use TypeScript for type safety
- Must use Pinia for state management (already in package.json)
- Must maintain test coverage with Vitest/Vue Test Utils
- Must follow Vue 3 Composition API best practices

**Stakeholders:**
- Cinema administrators who need to manage daily operations
- End implementation: Single Page Application

## Goals / Non-Goals

**Goals:**
- Create a production-ready admin panel for managing movies, rooms, and sessions
- Establish a maintainable design system with consistent visual language
- Implement type-safe API integration layer with comprehensive error handling
- Build reusable components that follow accessibility standards
- Achieve high test coverage (80%+ components, 90%+ stores/API)
- Enable efficient workflows for common tasks (create session, schedule multiple sessions)

**Non-Goals:**
- Public-facing cinema website or ticket booking system (this is admin-only)
- Multi-language support (Brazilian Portuguese only for initial version)
- Real-time collaboration features (single-user admin sessions)
- Backend modifications or additional endpoints
- Mobile native apps (responsive web only)
- Authentication/authorization (assumed trusted admin access)

## Decisions

### Decision 1: Composition API with `<script setup>`

**Choice:** Use Vue 3 Composition API with `<script setup>` syntax throughout.

**Rationale:**
- Better TypeScript inference without manual type annotations
- More concise and readable code compared to Options API
- Tree-shaking friendly (unused composables not included in bundle)
- Official recommendation for new Vue 3 projects

**Alternatives considered:**
- Options API: Rejected due to weaker TypeScript support and verbosity
- Class-based components: Not officially supported in Vue 3

### Decision 2: Axios for HTTP client

**Choice:** Use Axios as the HTTP client library.

**Rationale:**
- Industry standard with mature ecosystem
- Built-in interceptor support for request/response transformations
- Automatic JSON transformation
- Better error handling than native fetch
- Request cancellation via AbortController
- TypeScript types available via @types/axios

**Alternatives considered:**
- Native fetch: Rejected due to lack of interceptor support and more verbose error handling
- ky or ofetch: Rejected due to smaller ecosystem and less team familiarity

**Implementation details:**
- Create `/src/api/client.ts` with configured Axios instance
- Base URL from environment variable (default: `http://localhost:3000`)
- Request interceptor: logs in development, adds headers
- Response interceptor: unwraps data, standardizes error format
- Error types: NetworkError, ValidationError (422), NotFoundError (404), ServerError (5xx)

### Decision 3: Pinia stores with actions pattern

**Choice:** Organize state into domain-specific Pinia stores (movies, rooms, sessions, ui).

**Rationale:**
- Matches backend resource structure (movies, rooms, sessions)
- Each store encapsulates CRUD operations for one entity
- Stores can compose other stores (sessions uses movies/rooms)
- DevTools integration for debugging
- Better than Vuex for TypeScript projects

**Store structure:**
```
/src/stores/
  movies.ts     - Movie CRUD + state
  rooms.ts      - Room CRUD + state
  sessions.ts   - Session CRUD + state, composes movies/rooms
  ui.ts         - Modal, toast, global UI state
```

Each domain store pattern:
- State: `items: T[]`, `loading: boolean`, `error: string | null`, `selectedItem: T | null`
- Actions: `fetchAll()`, `fetchOne(id)`, `create(data)`, `update(id, data)`, `delete(id)`
- Getters: `allItems` (sorted), `itemById(id)`, `isLoading`, `hasError`

**Alternatives considered:**
- Single global store: Rejected due to poor modularity and harder testing
- Vuex: Rejected due to boilerplate and weaker TypeScript support

### Decision 4: Atomic design system structure

**Choice:** Build design system using atomic design methodology (tokens → atoms → molecules → organisms).

**Rationale:**
- Enforces consistency by defining design tokens first (colors, spacing, typography)
- Promotes reusability through composition
- Easier to maintain and update visual language
- Testable at each level

**Structure:**
```
/src/styles/
  variables.css        - CSS custom properties (design tokens)
  base.css             - Reset, global styles
/src/components/
  atoms/               - Button, Input, Select, etc.
  molecules/           - FormField, TableRow, etc.
  organisms/           - MovieForm, SessionsTable, etc.
```

**Design tokens defined in CSS custom properties:**
- Colors: Primary palette + semantic colors (success, error, warning, info)
- Typography: Font sizes, weights, line heights
- Spacing: 4px base unit scale (4, 8, 12, 16, 20, 24, 32, 40, 48)
- Shadows: 3-level elevation system
- Radii: sm/md/lg/full
- Breakpoints: sm/md/lg/xl for responsive design

**Alternatives considered:**
- Tailwind CSS: Rejected to maintain design system ownership and reduce bundle size
- Component library (Vuetify, Element Plus): Rejected to avoid lock-in and maintain full control over design

### Decision 5: File-based routing structure

**Choice:** Use manual route configuration in `/src/router/index.ts` with lazy-loaded components.

**Rationale:**
- Vue Router 5 is already in dependencies
- Explicit route definitions make navigation clear
- Code splitting via dynamic imports reduces initial bundle size
- Route guards can be added later for authentication

**Route structure:**
```
/                        → Dashboard (summary view)
/movies                  → MoviesList
/movies/new              → MovieForm (create mode)
/movies/:id/edit         → MovieForm (edit mode)
/rooms                   → RoomsList
/rooms/new               → RoomForm
/rooms/:id/edit          → RoomForm
/sessions                → SessionsList
/sessions/new            → SessionForm
/sessions/:id/edit       → SessionForm
```

**Alternatives considered:**
- File-based routing (unplugin-vue-router): Rejected due to additional dependency and learning curve

### Decision 6: Co-located component tests

**Choice:** Place test files adjacent to components (`Button.vue` + `Button.spec.ts` in same directory).

**Rationale:**
- Easier to find and maintain tests
- Encourages writing tests (lower friction)
- Follows Vue community best practice
- Supported by Vitest out of the box

**Test organization:**
```
/src/components/atoms/Button.vue
/src/components/atoms/Button.spec.ts
/src/stores/movies.ts
/src/stores/movies.spec.ts
```

**Alternatives considered:**
- Separate `/tests` directory: Rejected due to distance from implementation

### Decision 7: TypeScript strict mode

**Choice:** Enable strict TypeScript mode with `strict: true` in tsconfig.json.

**Rationale:**
- Catches more bugs at compile time
- Forces explicit null/undefined handling
- Better IDE autocomplete and refactoring support
- Future-proof codebase

**Type organization:**
```
/src/types/
  models.ts           - Movie, Room, Session interfaces
  api.ts              - DTO types (Create*, Update*)
  errors.ts           - Custom error classes
```

**Alternatives considered:**
- Loose TypeScript: Rejected as it defeats the purpose of using TypeScript

### Decision 8: Environment-based configuration

**Choice:** Use Vite's environment variables with `.env` files.

**Rationale:**
- Vite built-in support via `import.meta.env`
- Different configs for dev/staging/production
- Secrets not committed to version control

**Environment variables:**
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_API_TIMEOUT` - Request timeout in ms (default: 10000)

**Alternatives considered:**
- Hardcoded config: Rejected for lack of flexibility across environments

## Risks / Trade-offs

**[Risk]** Backend API might change endpoints or validation rules.
**→ Mitigation:** TypeScript interfaces act as contract. Write integration tests that fail when API contract breaks. Document API assumptions in `/docs/api-contract.md`.

**[Risk]** UUID-based URLs are not user-friendly (e.g., `/movies/550e8400-...`).
**→ Mitigation:** Accepted trade-off for security and backend consistency. Users navigate via UI lists, not URLs.

**[Risk]** Session time conflict validation only happens server-side, leading to late error feedback.
**→ Mitigation:** Implement client-side conflict checking by fetching existing sessions for selected room/date. Still rely on backend as source of truth.

**[Risk]** Large bundle size if all components loaded upfront.
**→ Mitigation:** Route-level code splitting via dynamic imports. Lazy load heavy components (datetime picker, modals). Target <200KB initial bundle.

**[Risk]** No backend authentication means frontend can't enforce access control.
**→ Mitigation:** Out of scope for initial version. Document assumption of trusted network/VPN access. Can add auth later via interceptor.

**[Risk]** Testing components that depend on multiple stores increases test complexity.
**→ Mitigation:** Use factory functions to create test stores with known state. Mock store dependencies when testing store composition.

**[Risk]** CSS custom properties not supported in older browsers.
**→ Mitigation:** Target modern browsers only (last 2 versions). Add browserslist to package.json. Accepted trade-off for admin tool.

**[Risk]** Manual routing configuration can drift from actual components.
**→ Mitigation:** Write route tests that verify each route renders expected component. Use TypeScript const assertions for route paths.

## Migration Plan

**Phase 1: Foundation (Week 1)**
1. Set up design system (CSS variables, atomic components)
2. Implement API client with interceptors and types
3. Create Pinia stores structure
4. Set up routing and layouts

**Phase 2: CRUD Implementation (Week 2)**
1. Movies management (list, create, edit, delete)
2. Rooms management (list, create, edit, delete)
3. Basic sessions management (list, create)

**Phase 3: Advanced Features (Week 3)**
1. Session conflict validation with real-time feedback
2. Session editing and deletion
3. Dashboard with statistics
4. Enhanced error handling and UX polish

**Phase 4: Testing & Documentation (Week 4)**
1. Achieve 80%+ test coverage
2. Write user documentation
3. Performance optimization (bundle size, lazy loading)
4. Accessibility audit

**Deployment strategy:**
- Development: Vite dev server on port 5173, proxying API to localhost:3000
- Staging: Build with `npm run build`, serve via Nginx, API at staging.api.example.com
- Production: Static build deployed to CDN, API at api.example.com
- Rollback: Keep previous build artifact, swap Nginx config

**No database migrations required** (frontend only).

## Open Questions

1. **Color palette:** Should we match an existing brand guideline, or create a generic professional palette?
   - **Decision needed by:** Before starting design system implementation
   - **Options:** (a) Generic blue/gray professional theme, (b) Cinema-themed with dark mode, (c) Wait for brand guidelines
   - **Answer:** We will adopt option (a)

2. **Date/time localization:** All timestamps are UTC. Should we display in user's local timezone?
   - **Impact:** Affects datetime picker and display formatting
   - **Recommendation:** Display in user's local timezone but always send UTC to backend
   - **Answer:** Follow recomendation

3. **Optimistic UI updates:** Should we update UI immediately before API confirmation?
   - **Trade-off:** Better perceived performance vs. potential rollback complexity
   - **Recommendation:** Use optimistic updates for low-risk operations (edit), show loading for high-risk (delete)
   - **Answer:** We will not adopt optimistic ui update. Since its admin user will be more tolerant to poorer performance.

4. **Batch operations:** Should we support bulk delete or bulk session creation?
   - **Scope:** Not in initial version, but architecture should allow adding later
   - **Recommendation:** Design store actions to accept single items first, extend to arrays later
   - **Answer:** Follow recomendation, we will postpone bulk operations

5. **Real-time updates:** Should multiple admins see each other's changes in real-time?
   - **Technical:** Would require WebSocket or polling
   - **Recommendation:** Out of scope. Admins can refresh page manually. Add polling later if needed.
   - **Answer:** Follow recomendation. There will be must likely only one admin at a time using the system.
