// Main component exports
export {
  ConsentBanner,
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

// Context exports
export {
  ConsentBannerContext,
  useConsentBannerContext,
  type ConsentBannerContextValue,
} from "./components";

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

// Hook exports
export {
  useConsentBanner,
  type UseConsentBannerOptions,
  type UseConsentBannerReturn,
  type ConsentStatus,
} from "./hooks";

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
