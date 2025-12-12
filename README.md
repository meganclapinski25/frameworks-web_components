# Web Components Design System

A collection of reusable, framework-agnostic web components built with vanilla JavaScript and integrated with a universal CSS design system framework.

## Overview

This design system provides three core web components that solve common UI challenges while maintaining consistency through shared design tokens and styles. Each component is built using the Web Components API (Custom Elements) and leverages Shadow DOM for style encapsulation.

## Components

### 1. `ath-card` (Card)
**Static:**
This component solves the problem of displaying structured information in a clean and reusable way instead of rewriting the same HTML and styles every time. It belongs in my design system because it represents a common UI pattern that could be used across multiple pages or projects. The component uses my CSS framework’s variables for spacing, font sizes, and colors so it stays consistent with the rest of the system. In the future, I’d like to improve it by adding more configurable attributes and making it more flexible for different content types.
---

### 2. `ath-progress-tracker` (Progress Tracker)

**Smart:**
This component focuses on showing progress or status information in a clear visual way. It fits into the design system because progress indicators are common in dashboards and tracking interfaces. The styling is handled using shared framework variables, which makes it easy to adjust the look without changing the component logic. A future improvement would be adding animation options and better accessibility support, like clearer labels for screen readers.

---

### 3. `ath-toggle` (Toggle Switch)

**Interactive:**
This component brings multiple pieces of information together and acts more like a building block for larger layouts. It belongs in the design system because it demonstrates how smaller components can be composed into something more useful. It relies on the same framework styles for layout, spacing, and typography to keep everything consistent. Moving forward, I would like to improve this component by refining how it passes data to child components and making it easier to reuse in different layouts.


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


