# Web Components Design System

A collection of reusable, framework-agnostic web components built with vanilla JavaScript and integrated with a universal CSS design system framework.

## Overview

This design system provides three core web components that solve common UI challenges while maintaining consistency through shared design tokens and styles. Each component is built using the Web Components API (Custom Elements) and leverages Shadow DOM for style encapsulation.

## Components

### 1. `ath-card` (Card Component)

**The Problem It Solves:**
The card component addresses the need for consistent, reusable content containers across the application. Without a standardized card component, developers would need to manually recreate card layouts with varying styles, leading to inconsistent spacing, borders, and visual hierarchy. This component provides a semantic, slot-based structure that ensures all cards share the same visual language and behavior.

**Why It Belongs in Your Design System:**
Cards are one of the most fundamental UI patterns in modern web applications. They provide a way to group related content, create visual hierarchy, and improve content scannability. By standardizing the card component, we ensure:
- Consistent spacing and padding across all cards
- Unified border and shadow treatments
- Predictable header, body, and footer sections
- Easy maintenance when design tokens change

**How It Uses Your Framework's Styles:**
The `ath-card` component imports the entire framework CSS inside its shadow root using `@import url("./acsd.css")`. It then leverages:
- Framework classes: Uses `.card`, `.card__header`, `.card__body`, and `.card__footer` classes directly from the framework
- Design tokens: Inherits all CSS custom properties (colors, spacing, borders, shadows) from the framework
- Responsive behavior: Automatically adapts to framework-defined breakpoints and spacing scales
- Theme support: Automatically supports dark mode when the `.theme-dark` class is applied to the document root

**Future Improvements:**
- Add support for `card--elevated` variant as an attribute (currently requires manual class application)
- Implement image/media slot for card media sections
- Add animation/transition options for card interactions
- Support for card actions (footer buttons/links) as a named slot
- Accessibility enhancements: ARIA labels and roles configuration
- Card size variants (small, medium, large) via attributes

---

### 2. `ath-progress-tracker` (Progress Tracker Component)

**The Problem It Solves:**
Student athletes need a way to track multiple categories of weekly activities (homework, practices, games, lifts) with visual progress indicators. Manually building this would require complex state management, progress bar calculations, and event handling. This component encapsulates all that logic while providing an intuitive interface for incrementing/decrementing counts and visualizing progress across four distinct categories.

**Why It Belongs in Your Design System:**
Progress tracking is a common pattern in dashboard and data visualization interfaces. By standardizing this component:
- Ensures consistent progress bar styling across the application
- Provides reusable interaction patterns (increment/decrement buttons)
- Maintains accessibility standards (ARIA progressbar roles)
- Creates a foundation for other progress-based components

**How It Uses Your Framework's Styles:**
The progress tracker deeply integrates with the framework:
- **Framework classes**: Uses `.btn`, `.btn--sm`, `.btn--primary`, `.btn--secondary`, `.btn--danger` for all interactive controls
- **Design tokens**: 
  - Spacing: `var(--space-xs)`, `var(--space-sm)`, `var(--space-md)` for consistent gaps and padding
  - Colors: `var(--color-primary)` for progress bars, `var(--color-border)`, `var(--color-surface)`, `var(--color-fg-muted)` for UI elements
  - Border radius: `var(--radius-md)`, `var(--radius-pill)` for rounded corners
  - Typography: `var(--font-size-sm)`, `var(--font-weight-strong)` for text styling
- **Card integration**: Wraps itself in `.card.card--elevated` for consistent container styling
- **Motion preferences**: Respects `prefers-reduced-motion` for animated percentage updates
- **Theme support**: All colors automatically adapt to dark mode via CSS custom properties

**Future Improvements:**
- Add configurable color per category (currently hardcoded to `--color-primary`)
- Support for custom category labels and counts (currently fixed to 4 categories)
- Add data persistence (localStorage) to save progress between sessions
- Export/import functionality for progress data
- Add animation options for progress bar fills (easing functions, duration)
- Keyboard navigation improvements (arrow keys for increment/decrement)
- Add validation for min/max values per category
- Support for percentage-based goals in addition to count-based tracking
- Add visual indicators for goals (e.g., "2/5 remaining" badges)

---

### 3. `ath-toggle` (Toggle Switch Component)

**The Problem It Solves:**
Toggle switches are essential for binary choices (on/off states), but building them from scratch requires handling accessibility (ARIA attributes, keyboard navigation), visual states (checked/unchecked), and often theme management. This component provides a complete toggle solution that can also optionally manage application-wide theme switching with localStorage persistence.

**Why It Belongs in Your Design System:**
Toggles are ubiquitous in modern UIs for settings, preferences, and feature flags. Standardizing this component ensures:
- Consistent toggle appearance and behavior across the application
- Built-in accessibility (keyboard support, ARIA attributes)
- Reusable theme switching functionality
- Predictable interaction patterns for users

**How It Uses Your Framework's Styles:**
The toggle component leverages the framework extensively:
- **Design tokens**:
  - Spacing: `var(--space-xs)`, `var(--space-sm)` for internal gaps and padding
  - Colors: `var(--color-primary)` for active state, `var(--color-border)` for track, `var(--color-surface)` for thumb
  - Border radius: `var(--radius-pill)` for fully rounded toggle track and thumb
  - Typography: `var(--font-size-sm)` for labels
  - Shadows: `var(--shadow-sm)` for thumb elevation
  - Transitions: `var(--transition-fast)` for smooth state changes
- **Focus management**: Uses `var(--color-focus-ring)` for accessible focus indicators
- **Theme integration**: When used with `mode="theme"`, it directly manipulates the `.theme-dark` class on the document root, which triggers all framework CSS custom property updates
- **Color mixing**: Uses `color-mix()` function with framework tokens for subtle border effects

**Future Improvements:**
- Add size variants (small, medium, large) via attributes
- Support for custom on/off labels (currently just shows a single label)
- Add icon support (checkmark/X icons in the thumb)
- Implement toggle groups for mutually exclusive options
- Add loading/disabled states with visual feedback
- Support for custom storage keys beyond "theme" (already partially supported)
- Add animation customization (spring physics, duration)
- Support for indeterminate state (three-state toggle)
- Add tooltip support for additional context
- Implement form integration (works with native form submission)

---

## Framework Integration

All components are designed to work seamlessly with the universal CSS design system framework. The integration happens through:

1. **CSS Import**: Each component imports `acsd.css` directly into its shadow root, ensuring framework styles are available even in encapsulated contexts.

2. **CSS Custom Properties**: Components rely heavily on CSS variables defined in the framework:
   - Color tokens (`--color-primary`, `--color-secondary`, `--color-surface`, etc.)
   - Spacing tokens (`--space-xs` through `--space-xl`)
   - Typography tokens (`--font-size-*`, `--font-weight-*`)
   - Border and radius tokens (`--radius-*`, `--border-width`)
   - Shadow tokens (`--shadow-sm`, `--shadow-md`)
   - Transition tokens (`--transition-fast`, `--transition-med`)

3. **Framework Classes**: Components use framework utility and component classes (`.btn`, `.card`, etc.) within their shadow DOM templates.

4. **Theme Support**: All components automatically support dark mode through the framework's `.theme-dark` class mechanism, which updates all CSS custom properties.

## Usage

### Basic Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="./acsd.css">
</head>
<body>
  <!-- Card Component -->
  <ath-card>
    <span slot="header">Card Title</span>
    <p>Card content goes here.</p>
    <span slot="footer">Card footer</span>
  </ath-card>

  <!-- Progress Tracker -->
  <ath-progress-tracker
    homework-completed="3"
    homework-total="5"
    practices-completed="2"
    practices-total="4"
    games-completed="1"
    games-total="2"
    lifts-completed="0"
    lifts-total="3"
  ></ath-progress-tracker>

  <!-- Theme Toggle -->
  <ath-toggle 
    mode="theme" 
    storage-key="theme" 
    label="Dark Mode"
  ></ath-toggle>

  <script type="module" src="./card.js"></script>
  <script type="module" src="./progress-tracker.js"></script>
  <script type="module" src="./toggle.js"></script>
</body>
</html>
```

## Browser Support

These components use modern web standards:
- Custom Elements API
- Shadow DOM
- ES6+ JavaScript
- CSS Custom Properties

Supported in all modern browsers (Chrome, Firefox, Safari, Edge) released in the last 3 years.

## Development

To use these components in your project:

1. Include the `acsd.css` framework file in your HTML
2. Load the component JavaScript files as ES modules
3. Use the custom elements in your HTML as shown in the examples above

## Design System Philosophy

These components follow a "framework-first" approach:
- Components are consumers of design tokens, not creators
- Visual styling comes from the framework CSS, not component-specific styles
- Components focus on behavior and structure, while the framework handles appearance
- This separation allows for easy theme customization and maintenance

