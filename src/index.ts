/**
 * Package barrel — deliberately NOT a client module.
 *
 * Everything browser-facing lives in ./client, which carries the "use client"
 * directive. This file re-exports it and composes the compound
 * `ConsentBanner.Content` API out of those *client references*.
 *
 * That composition is why this file must stay a server module. When the build
 * bundled ./client in here, Next replaced the whole module with client
 * references -- one per named export -- and properties attached to a function
 * did not survive: `ConsentBanner.Content` resolved to `undefined` from any
 * Server Component and hydration died with React error #130. The README
 * documents that dot notation 40 times, so the documented API was the broken
 * one. Composing here, from a module Next does not replace, fixes it without
 * changing the public API.
 *
 * The specifier below is the package self-reference rather than "./client":
 * `require()` resolves a directory index in CJS but ESM does not, so a relative
 * path would work in one format and silently break the other.
 */

import {
  ConsentBannerRoot,
  ConsentBannerContent,
  ConsentBannerActions,
  ConsentBannerAcceptButton,
  ConsentBannerDismissButton,
  ConsentBannerCloseButton,
  ConsentBannerLink,
} from "@silverassist/consent-banner/client";

/**
 * Compound consent banner. Usable as `<ConsentBanner>` with dot-notation
 * children (`<ConsentBanner.Content>`), or via the individually named exports
 * below.
 */
export const ConsentBanner = Object.assign(ConsentBannerRoot, {
  Content: ConsentBannerContent,
  Actions: ConsentBannerActions,
  AcceptButton: ConsentBannerAcceptButton,
  DismissButton: ConsentBannerDismissButton,
  CloseButton: ConsentBannerCloseButton,
  Link: ConsentBannerLink,
});

// Everything else is a straight re-export of the client entry.
export {
  ConsentBannerRoot,
  ConsentBannerContent,
  ConsentBannerActions,
  ConsentBannerAcceptButton,
  ConsentBannerDismissButton,
  ConsentBannerCloseButton,
  ConsentBannerLink,
  ConsentBannerContext,
  useConsentBannerContext,
  useConsentBanner,
  type ConsentBannerProps,
  type ContentProps,
  type ActionsProps,
  type BannerButtonProps,
  type CloseButtonProps,
  type LinkProps,
  type ConsentBannerContextValue,
  type UseConsentBannerOptions,
  type UseConsentBannerReturn,
  type ConsentStatus,
} from "@silverassist/consent-banner/client";

// Variant exports for customization
export {
  bannerVariants,
  contentVariants,
  actionsVariants,
  buttonVariants,
  type BannerVariants,
  type ContentVariants,
  type ActionsVariants,
  type ButtonVariants,
} from "./components";

// Utility exports
export { cn } from "./utils";
export {
  getStorageValue,
  setStorageValue,
  removeStorageValue,
  type StorageOptions,
  type StorageType,
} from "./utils";

// Preset exports
export {
  COOKIE_CONSENT,
  PRIVACY_POLICY_UPDATE,
  TERMS_OF_SERVICE_UPDATE,
  ESSENTIAL_COOKIES,
  ANALYTICS_CONSENT,
  MARKETING_CONSENT,
  MAINTENANCE_NOTICE,
  AGE_VERIFICATION,
  BETA_NOTICE,
  PRESETS,
  type ConsentPreset,
  type PresetName,
} from "./presets";
