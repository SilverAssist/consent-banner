# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-08-24

### Fixed

- **The compound API (`<ConsentBanner.Content>` etc.) resolved to `undefined` from any Server Component**, breaking hydration (`Minified React error #130`) — it only worked when the importing file was itself a client component, even though the README documents dot notation exclusively (40 times) and never mentions the named exports. No public API change; the documented usage simply starts working.

### Changed

- **npm publishing moved to trusted publishing (OIDC)** ([#5](https://github.com/SilverAssist/consent-banner/issues/5)). `publish.yml` no longer reads an `NPM_TOKEN` secret: it requests `id-token: write` and npm exchanges that OIDC token for publish rights against the trusted publisher registered for this package. Long-lived tokens are on a deprecation clock — from January 2027 2FA-bypass granular tokens lose direct publishing entirely. The publish job moves to Node 24 because trusted publishing requires npm >= 11.5.1 and Node 24 ships npm 11.x natively, where Node 22 would need a global npm upgrade step whose effect is not verifiable from the log. Since the repo and package are both public, publishing over OIDC also attests provenance automatically.
- Replaced `tsup` with `tsdown` as the build tool.
- Normalized the `license` field to its SPDX identifier.

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
