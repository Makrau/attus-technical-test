## ADDED Requirements

### Requirement: Color palette definition
The system SHALL define a consistent color palette used across all components.

#### Scenario: Primary colors
- **WHEN** using primary colors in the application
- **THEN** system provides CSS variables: --color-primary (main brand color), --color-primary-light (lighter variant), --color-primary-dark (darker variant)

#### Scenario: Semantic colors
- **WHEN** using semantic colors for states
- **THEN** system provides CSS variables: --color-success (green for success states), --color-error (red for errors/delete), --color-warning (yellow/orange for warnings), --color-info (blue for informational)

#### Scenario: Neutral colors
- **WHEN** using neutral colors for text and backgrounds
- **THEN** system provides CSS variables: --color-text-primary (main text), --color-text-secondary (secondary text), --color-text-disabled (disabled state), --color-bg-primary (main background), --color-bg-secondary (secondary background), --color-border (borders and dividers)

#### Scenario: Color palette accessibility
- **WHEN** applying colors
- **THEN** system ensures all text/background combinations meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text)

### Requirement: Typography scale
The system SHALL define a consistent typography system.

#### Scenario: Font family
- **WHEN** rendering text
- **THEN** system uses CSS variable --font-family-sans (system font stack: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)

#### Scenario: Font sizes
- **WHEN** applying text sizes
- **THEN** system provides CSS variables: --text-xs (12px), --text-sm (14px), --text-base (16px), --text-lg (18px), --text-xl (20px), --text-2xl (24px), --text-3xl (30px)

#### Scenario: Font weights
- **WHEN** applying font weights
- **THEN** system provides CSS variables: --font-weight-normal (400), --font-weight-medium (500), --font-weight-semibold (600), --font-weight-bold (700)

#### Scenario: Line heights
- **WHEN** setting line heights
- **THEN** system provides CSS variables: --line-height-tight (1.25), --line-height-normal (1.5), --line-height-relaxed (1.75)

### Requirement: Spacing system
The system SHALL define a consistent spacing scale.

#### Scenario: Spacing scale
- **WHEN** applying margins, paddings, gaps
- **THEN** system provides CSS variables: --spacing-1 (4px), --spacing-2 (8px), --spacing-3 (12px), --spacing-4 (16px), --spacing-5 (20px), --spacing-6 (24px), --spacing-8 (32px), --spacing-10 (40px), --spacing-12 (48px)

### Requirement: Border radius
The system SHALL define consistent border radius values.

#### Scenario: Border radius scale
- **WHEN** applying rounded corners
- **THEN** system provides CSS variables: --radius-sm (4px), --radius-md (8px), --radius-lg (12px), --radius-full (9999px for pills/circles)

### Requirement: Shadows
The system SHALL define consistent shadow styles for elevation.

#### Scenario: Shadow scale
- **WHEN** applying shadows for elevation
- **THEN** system provides CSS variables: --shadow-sm (subtle shadow), --shadow-md (medium shadow), --shadow-lg (prominent shadow)

### Requirement: Button component
The system SHALL provide a reusable button component with consistent styling.

#### Scenario: Button variants
- **WHEN** using buttons
- **THEN** system provides variants: primary (solid primary color), secondary (outlined), danger (red for delete actions), ghost (transparent background)

#### Scenario: Button sizes
- **WHEN** using buttons
- **THEN** system provides sizes: sm (small), md (medium/default), lg (large)

#### Scenario: Button states
- **WHEN** button state changes
- **THEN** system provides visual feedback: hover (slightly darker/lighter), active (pressed state), disabled (reduced opacity, no pointer events), loading (spinner icon with disabled state)

#### Scenario: Button with icon
- **WHEN** button includes an icon
- **THEN** system positions icon with proper spacing (--spacing-2) before or after text

### Requirement: Input component
The system SHALL provide reusable form input components.

#### Scenario: Text input
- **WHEN** using text inputs
- **THEN** system provides Input component with label, placeholder, error message, required indicator, and disabled state

#### Scenario: Number input
- **WHEN** using number inputs
- **THEN** system provides NumberInput component with min/max validation and step controls

#### Scenario: Select dropdown
- **WHEN** using select inputs
- **THEN** system provides Select component with label, options array, placeholder, error message, and search/filter capability

#### Scenario: Datetime picker
- **WHEN** selecting dates and times
- **THEN** system provides DatetimePicker component with calendar view, time selection, and ISO 8601 output

#### Scenario: Textarea
- **WHEN** using multi-line text inputs
- **THEN** system provides Textarea component with label, rows prop, and error message

#### Scenario: Input validation states
- **WHEN** input validation occurs
- **THEN** system displays error state with red border and error message below input

### Requirement: Card component
The system SHALL provide a reusable card component for content grouping.

#### Scenario: Card structure
- **WHEN** using cards
- **THEN** system provides Card component with optional header, body, and footer slots

#### Scenario: Card styling
- **WHEN** rendering cards
- **THEN** system applies background, border, border-radius (--radius-lg), and shadow (--shadow-sm)

### Requirement: Modal component
The system SHALL provide a reusable modal dialog component.

#### Scenario: Modal structure
- **WHEN** displaying modals
- **THEN** system provides Modal component with overlay (semi-transparent backdrop), content area, header with title, body slot, and footer with action buttons

#### Scenario: Modal behavior
- **WHEN** modal is opened
- **THEN** system prevents background scrolling, focuses first focusable element, closes on overlay click or Escape key

#### Scenario: Modal accessibility
- **WHEN** modal is visible
- **THEN** system sets aria-modal="true", role="dialog", traps focus within modal, restores focus on close

### Requirement: Table component
The system SHALL provide a reusable table component for data display.

#### Scenario: Table structure
- **WHEN** displaying tabular data
- **THEN** system provides Table component with thead, tbody, sortable columns, and row hover effects

#### Scenario: Table row actions
- **WHEN** displaying table rows
- **THEN** system provides action column with edit and delete icon buttons

#### Scenario: Empty table state
- **WHEN** table has no data
- **THEN** system displays centered empty state message with call-to-action

### Requirement: Toast notification component
The system SHALL provide a toast notification component for feedback messages.

#### Scenario: Toast types
- **WHEN** showing notifications
- **THEN** system provides types: success (green with checkmark icon), error (red with X icon), info (blue with info icon)

#### Scenario: Toast behavior
- **WHEN** toast is displayed
- **THEN** system positions toast at top-right, auto-dismisses after 3 seconds, allows manual close via X button, stacks multiple toasts vertically

#### Scenario: Toast accessibility
- **WHEN** toast appears
- **THEN** system sets role="alert" and aria-live="polite" for screen readers

### Requirement: Loading spinner component
The system SHALL provide a loading spinner component.

#### Scenario: Spinner sizes
- **WHEN** displaying loading state
- **THEN** system provides sizes: sm, md, lg with corresponding dimensions

#### Scenario: Spinner centering
- **WHEN** displaying full-page loading
- **THEN** system provides centered variant with optional overlay

### Requirement: Confirmation dialog component
The system SHALL provide a confirmation dialog for destructive actions.

#### Scenario: Confirmation dialog structure
- **WHEN** confirming destructive actions
- **THEN** system provides ConfirmDialog component with title, message, cancel button, and confirm button (danger variant)

#### Scenario: Confirmation dialog behavior
- **WHEN** user interacts with confirmation dialog
- **THEN** system emits confirm or cancel event, closes dialog, and restores focus

### Requirement: Responsive design
The system SHALL ensure all components work on mobile, tablet, and desktop screens.

#### Scenario: Breakpoints
- **WHEN** designing responsive layouts
- **THEN** system provides CSS variables: --breakpoint-sm (640px), --breakpoint-md (768px), --breakpoint-lg (1024px), --breakpoint-xl (1280px)

#### Scenario: Mobile-first approach
- **WHEN** writing responsive styles
- **THEN** system uses mobile styles as default and adds complexity with min-width media queries

### Requirement: CSS architecture
The system SHALL organize styles for maintainability.

#### Scenario: CSS organization
- **WHEN** structuring CSS
- **THEN** system provides: styles/variables.css (design tokens), styles/base.css (resets, global styles), styles/components/ (component-specific styles), components use scoped styles

#### Scenario: CSS custom properties
- **WHEN** defining theme values
- **THEN** system uses CSS custom properties (--var-name) defined in :root for easy theming
