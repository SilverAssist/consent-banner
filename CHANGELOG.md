# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-04

### Added

- Initial release of `@silverassist/consent-banner`
- **ConsentBanner component**: Flexible, accessible consent banner for React
  - Multiple position options: `top`, `bottom`, `center`
  - Variant styles: `default`, `dark`, `light`, `primary`, `minimal`
  - Full keyboard navigation and ARIA support
  - Smooth animations with CSS transitions
- **Accessibility (WCAG 2.1 compliant)**:
  - Keyboard support: Escape key to dismiss (`escapeAction` prop)
  - Focus trapping for modal-like center position (`trapFocus` prop)
  - Auto-focus first interactive element (`autoFocus` prop)
  - Proper ARIA attributes: `role`, `aria-label`, `aria-modal`, `aria-live`
  - Screen reader friendly with `aria-hidden` on decorative elements
- **useConsentBanner hook**: Headless hook for custom implementations
  - `status`: Current consent status (`pending`, `accepted`, `dismissed`)
  - `isVisible`: Banner visibility state
  - `accept()`, `dismiss()`, `reset()`: Control functions
  - `show()`, `hide()`: Manual visibility control
- **Storage options**: LocalStorage (default) with configurable key
- **Auto-accept on navigation**: `autoAcceptOnNavigate` prop for implicit consent
  - Supports Next.js App Router client-side navigation
  - Intercepts `history.pushState/replaceState` for SPA navigation detection
  - Defers state updates via `queueMicrotask` to avoid React commit phase conflicts
- **Manual mode**: `manual` prop to control banner visibility programmatically
- **Callbacks**: `onAccept`, `onDismiss`, `onChange` for consent state changes
- **SSR-safe**: Proper hydration handling with `useSyncExternalStore`
- **TypeScript**: Full type definitions included
- **Styling**: Tailwind CSS compatible, shadcn/ui ready, or bring your own styles

### Technical Details

- Built with tsup for ESM and CJS output
- Target: ES2020
- React 18+ peer dependency
- Zero runtime dependencies (React only)
