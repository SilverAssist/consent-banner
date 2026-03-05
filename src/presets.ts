/**
 * Preset configurations for common consent banner use cases.
 *
 * These presets provide ready-to-use configurations for typical scenarios.
 * Use them with the ConsentBanner component or as templates for customization.
 */

/**
 * Preset configuration type.
 */
export interface ConsentPreset {
  /** Unique storage key for this consent type */
  storageKey: string;
  /** Default message to display */
  message: string;
  /** Accept button text */
  acceptText: string;
  /** Dismiss button text (optional) */
  dismissText?: string;
  /** Link to privacy policy or more info (optional) */
  policyLink?: {
    text: string;
    href: string;
  };
}

/**
 * GDPR Cookie Consent preset.
 *
 * Standard message for cookie consent compliance with GDPR.
 */
export const COOKIE_CONSENT: ConsentPreset = {
  storageKey: "cookie-consent",
  message:
    "We use cookies to ensure that we give you the best experience on our website. If you continue to use this site we will assume that you are happy with it.",
  acceptText: "Accept",
  dismissText: "Decline",
  policyLink: {
    text: "Learn more",
    href: "/privacy-policy",
  },
};

/**
 * Privacy Policy Update preset.
 *
 * Notification for privacy policy changes.
 */
export const PRIVACY_POLICY_UPDATE: ConsentPreset = {
  storageKey: "privacy-policy-update-v1",
  message:
    "We have updated our Privacy Policy. Please review the changes to understand how we handle your data.",
  acceptText: "I understand",
  policyLink: {
    text: "View Privacy Policy",
    href: "/privacy-policy",
  },
};

/**
 * Terms of Service Update preset.
 *
 * Notification for terms of service changes.
 */
export const TERMS_OF_SERVICE_UPDATE: ConsentPreset = {
  storageKey: "tos-update-v1",
  message:
    "We have updated our Terms of Service. By continuing to use our service, you agree to the new terms.",
  acceptText: "I agree",
  policyLink: {
    text: "View Terms of Service",
    href: "/terms-of-service",
  },
};

/**
 * Essential Cookies Only preset.
 *
 * Minimal cookie notice for essential cookies only.
 */
export const ESSENTIAL_COOKIES: ConsentPreset = {
  storageKey: "essential-cookies",
  message:
    "This website uses essential cookies to ensure its proper operation. No tracking cookies are used.",
  acceptText: "OK",
};

/**
 * Analytics Opt-In preset.
 *
 * Request consent for analytics tracking.
 */
export const ANALYTICS_CONSENT: ConsentPreset = {
  storageKey: "analytics-consent",
  message:
    "We'd like to use analytics cookies to understand how you use our website and improve your experience. You can opt out at any time.",
  acceptText: "Allow analytics",
  dismissText: "No thanks",
  policyLink: {
    text: "Learn more",
    href: "/privacy-policy#analytics",
  },
};

/**
 * Marketing Consent preset.
 *
 * Request consent for marketing communications.
 */
export const MARKETING_CONSENT: ConsentPreset = {
  storageKey: "marketing-consent",
  message:
    "Would you like to receive personalized offers and updates? We'll never spam you.",
  acceptText: "Yes, keep me updated",
  dismissText: "No thanks",
  policyLink: {
    text: "Privacy Policy",
    href: "/privacy-policy#marketing",
  },
};

/**
 * Site Maintenance Notice preset.
 *
 * Inform users about scheduled maintenance.
 */
export const MAINTENANCE_NOTICE: ConsentPreset = {
  storageKey: "maintenance-notice-2024",
  message:
    "Scheduled maintenance: Our service will be temporarily unavailable on [DATE] from [TIME] to [TIME].",
  acceptText: "Got it",
};

/**
 * Age Verification preset.
 *
 * Verify user age for age-restricted content.
 */
export const AGE_VERIFICATION: ConsentPreset = {
  storageKey: "age-verified",
  message:
    "This website contains age-restricted content. By entering, you confirm that you are of legal age in your jurisdiction.",
  acceptText: "I am of legal age",
  dismissText: "Leave site",
};

/**
 * Beta Feature Notice preset.
 *
 * Inform users about beta features.
 */
export const BETA_NOTICE: ConsentPreset = {
  storageKey: "beta-notice-acknowledged",
  message:
    "You're using a beta version of our product. Some features may be incomplete or change without notice.",
  acceptText: "I understand",
  policyLink: {
    text: "Give feedback",
    href: "/feedback",
  },
};

/**
 * All available presets for convenience.
 */
export const PRESETS = {
  cookieConsent: COOKIE_CONSENT,
  privacyPolicyUpdate: PRIVACY_POLICY_UPDATE,
  termsOfServiceUpdate: TERMS_OF_SERVICE_UPDATE,
  essentialCookies: ESSENTIAL_COOKIES,
  analyticsConsent: ANALYTICS_CONSENT,
  marketingConsent: MARKETING_CONSENT,
  maintenanceNotice: MAINTENANCE_NOTICE,
  ageVerification: AGE_VERIFICATION,
  betaNotice: BETA_NOTICE,
} as const;

export type PresetName = keyof typeof PRESETS;
