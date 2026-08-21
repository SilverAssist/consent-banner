/**
 * Client entry point — everything that needs the browser.
 *
 * This module is what carries the "use client" directive in the build. Keeping
 * it a separate entry, rather than folding it into the root barrel, is what
 * lets the compound `ConsentBanner.Content` API work from a Server Component:
 * the barrel composes that object out of *client references* while itself
 * staying a server module. Bundling the two together strips the compound's
 * properties (see src/index.ts).
 *
 * Consumers may import from here directly, but the root barrel re-exports
 * everything, so `@silverassist/consent-banner` remains the documented entry.
 */

export {
  ConsentBanner as ConsentBannerRootComponent,
  ConsentBannerRoot,
  ConsentBannerContent,
  ConsentBannerActions,
  ConsentBannerAcceptButton,
  ConsentBannerDismissButton,
  ConsentBannerCloseButton,
  ConsentBannerLink,
  type ConsentBannerProps,
  type ContentProps,
  type ActionsProps,
  type BannerButtonProps,
  type CloseButtonProps,
  type LinkProps,
} from "./components";

export {
  ConsentBannerContext,
  useConsentBannerContext,
  type ConsentBannerContextValue,
} from "./components";

export {
  useConsentBanner,
  type UseConsentBannerOptions,
  type UseConsentBannerReturn,
  type ConsentStatus,
} from "./hooks";
