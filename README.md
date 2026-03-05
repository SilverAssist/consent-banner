# @silverassist/consent-banner

A flexible, accessible consent banner component for React. Perfect for GDPR cookie consent, privacy policy updates, and other user notifications.

[![npm version](https://img.shields.io/npm/v/@silverassist/consent-banner)](https://www.npmjs.com/package/@silverassist/consent-banner)
[![License](https://img.shields.io/badge/license-PolyForm%20Noncommercial-blue)](LICENSE)

## Features

- 🎨 **shadcn/ui Pattern** - Composable compound components with CVA variants
- 🔧 **Fully Customizable** - Override styles, messages, and behavior
- ♿ **Accessible** - WCAG compliant with proper ARIA attributes
- 📱 **Responsive** - Mobile-first design
- 🎯 **TypeScript** - Full type safety
- 🌈 **Tailwind CSS v3 & v4** - Works with both versions
- 💾 **Persistent Storage** - localStorage, sessionStorage, or cookies
- 🔌 **Headless Mode** - Bring your own UI with render props
- 📦 **Presets** - Ready-to-use configurations for common use cases

## Installation

```bash
npm install @silverassist/consent-banner
# or
yarn add @silverassist/consent-banner
# or
pnpm add @silverassist/consent-banner
```

## Quick Start

### Basic Usage (GDPR Cookie Consent)

```tsx
import { ConsentBanner, COOKIE_CONSENT } from "@silverassist/consent-banner";

export function CookieConsent() {
  return (
    <ConsentBanner
      storageKey={COOKIE_CONSENT.storageKey}
      onAccept={() => {
        // Enable analytics, tracking, etc.
        enableAnalytics();
      }}
    >
      <ConsentBanner.Content>
        {COOKIE_CONSENT.message}
      </ConsentBanner.Content>
      <ConsentBanner.Actions>
        <ConsentBanner.AcceptButton>
          {COOKIE_CONSENT.acceptText}
        </ConsentBanner.AcceptButton>
      </ConsentBanner.Actions>
    </ConsentBanner>
  );
}
```

### With Custom Message

```tsx
import { ConsentBanner } from "@silverassist/consent-banner";

export function CookieConsent() {
  return (
    <ConsentBanner
      storageKey="cookie-consent"
      position="bottom"
      variant="default"
    >
      <ConsentBanner.Content>
        We use cookies to ensure that we give you the best experience on our
        website. If you continue to use this site we will assume that you are
        happy with it.{" "}
        <ConsentBanner.Link href="/privacy-policy">
          Learn more
        </ConsentBanner.Link>
      </ConsentBanner.Content>
      <ConsentBanner.Actions>
        <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
        <ConsentBanner.DismissButton variant="secondary">
          Decline
        </ConsentBanner.DismissButton>
      </ConsentBanner.Actions>
    </ConsentBanner>
  );
}
```

### In Next.js App Router

```tsx
// app/layout.tsx
import { ConsentBanner } from "@silverassist/consent-banner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ConsentBanner storageKey="cookie-consent">
          <ConsentBanner.Content>
            We use cookies to improve your experience.
          </ConsentBanner.Content>
          <ConsentBanner.Actions>
            <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
          </ConsentBanner.Actions>
        </ConsentBanner>
      </body>
    </html>
  );
}
```

## API Reference

### ConsentBanner Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `storageKey` | `string` | required | Unique key for storing consent state |
| `position` | `"top" \| "bottom"` | `"bottom"` | Banner position on screen |
| `variant` | `"default" \| "light" \| "primary" \| "minimal"` | `"default"` | Visual variant |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Banner size |
| `type` | `"localStorage" \| "sessionStorage" \| "cookie"` | `"localStorage"` | Storage type |
| `expiryDays` | `number` | `365` | Cookie expiry (only for cookie storage) |
| `manual` | `boolean` | `false` | Disable auto-show on mount |
| `onAccept` | `() => void` | - | Called when user accepts |
| `onDismiss` | `() => void` | - | Called when user dismisses |
| `onChange` | `(status: ConsentStatus) => void` | - | Called on any status change |
| `className` | `string` | - | Additional CSS classes |
| `role` | `"alert" \| "alertdialog" \| "dialog" \| "status"` | `"alertdialog"` | ARIA role |

### Sub-Components

#### ConsentBanner.Content

Container for the message content.

```tsx
<ConsentBanner.Content align="left">
  Your message here
</ConsentBanner.Content>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `"left" \| "center" \| "right"` | `"left"` | Text alignment |
| `className` | `string` | - | Additional CSS classes |

#### ConsentBanner.Actions

Container for action buttons.

```tsx
<ConsentBanner.Actions layout="row">
  {/* buttons */}
</ConsentBanner.Actions>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `"row" \| "column"` | `"row"` | Button layout direction |
| `className` | `string` | - | Additional CSS classes |

#### ConsentBanner.AcceptButton

Button that marks consent as accepted.

```tsx
<ConsentBanner.AcceptButton variant="primary" size="default">
  Accept
</ConsentBanner.AcceptButton>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "link"` | `"primary"` | Button variant |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | Button size |
| `onClick` | `() => void` | - | Additional click handler |

#### ConsentBanner.DismissButton

Button that dismisses without accepting.

```tsx
<ConsentBanner.DismissButton variant="secondary">
  Decline
</ConsentBanner.DismissButton>
```

(Same props as AcceptButton)

#### ConsentBanner.CloseButton

X button for closing the banner.

```tsx
<ConsentBanner.CloseButton action="hide" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `action` | `"hide" \| "dismiss"` | `"hide"` | What happens on click |

#### ConsentBanner.Link

Styled link for use within content.

```tsx
<ConsentBanner.Link href="/privacy-policy">
  Privacy Policy
</ConsentBanner.Link>
```

### useConsentBanner Hook

For programmatic control:

```tsx
import { useConsentBanner } from "@silverassist/consent-banner";

function MyComponent() {
  const {
    status,      // "pending" | "accepted" | "dismissed"
    isVisible,   // boolean
    accept,      // () => void
    dismiss,     // () => void
    reset,       // () => void - clear consent, show again
    show,        // () => void - manually show
    hide,        // () => void - manually hide (temporary)
  } = useConsentBanner({
    storageKey: "my-consent",
    onAccept: () => console.log("Accepted!"),
  });

  // Custom logic...
}
```

### Render Prop Pattern

For full control over the UI:

```tsx
<ConsentBanner storageKey="cookie-consent">
  {({ accept, dismiss, status, isVisible }) => (
    <div className="my-custom-banner">
      <p>Status: {status}</p>
      <button onClick={accept}>Accept</button>
      <button onClick={dismiss}>Decline</button>
    </div>
  )}
</ConsentBanner>
```

## Presets

Ready-to-use configurations:

```tsx
import {
  COOKIE_CONSENT,
  PRIVACY_POLICY_UPDATE,
  TERMS_OF_SERVICE_UPDATE,
  ESSENTIAL_COOKIES,
  ANALYTICS_CONSENT,
  MARKETING_CONSENT,
  AGE_VERIFICATION,
  BETA_NOTICE,
} from "@silverassist/consent-banner";

// Use preset values
<ConsentBanner storageKey={ANALYTICS_CONSENT.storageKey}>
  <ConsentBanner.Content>
    {ANALYTICS_CONSENT.message}
  </ConsentBanner.Content>
  <ConsentBanner.Actions>
    <ConsentBanner.AcceptButton>
      {ANALYTICS_CONSENT.acceptText}
    </ConsentBanner.AcceptButton>
    <ConsentBanner.DismissButton>
      {ANALYTICS_CONSENT.dismissText}
    </ConsentBanner.DismissButton>
  </ConsentBanner.Actions>
</ConsentBanner>
```

## Styling

### With Tailwind CSS

The component uses Tailwind CSS classes by default. Works with both v3 and v4.

```tsx
// Custom className overrides
<ConsentBanner
  storageKey="consent"
  className="bg-brand-primary text-white"
>
  {/* ... */}
</ConsentBanner>
```

### Without Tailwind CSS

Import the optional CSS file:

```tsx
import "@silverassist/consent-banner/styles";
```

### CSS Custom Properties

Override design tokens:

```css
:root {
  --consent-banner-bg: #1a1a1a;
  --consent-banner-text: #ffffff;
  --consent-banner-btn-bg: #3b82f6;
  --consent-banner-btn-text: #ffffff;
}
```

### Custom Variants with CVA

```tsx
import { bannerVariants, cn } from "@silverassist/consent-banner";

// Create custom variant
const customBanner = cn(
  bannerVariants({ position: "bottom", variant: "default" }),
  "my-custom-classes"
);
```

## Accessibility

- Uses `role="alertdialog"` for screen reader announcement
- `aria-live="polite"` for non-intrusive updates
- Proper focus management
- Keyboard accessible buttons
- Respects `prefers-reduced-motion`

## Browser Support

- Chrome 111+
- Firefox 111+
- Safari 16.4+
- Edge 111+

## TypeScript

Full type definitions included. Key types:

```tsx
import type {
  ConsentBannerProps,
  ConsentStatus,
  UseConsentBannerOptions,
  UseConsentBannerReturn,
  ConsentPreset,
  BannerVariants,
  ButtonVariants,
} from "@silverassist/consent-banner";
```

## License

PolyForm Noncommercial License 1.0.0

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

