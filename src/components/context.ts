import { createContext, useContext } from "react";
import type { UseConsentBannerReturn } from "../hooks/useConsentBanner";
import type { BannerVariants } from "./variants";

/**
 * Context value for the ConsentBanner compound component.
 */
export interface ConsentBannerContextValue extends UseConsentBannerReturn {
  /** Variant props passed to the root banner */
  variants: BannerVariants;
}

/**
 * Context for sharing state between ConsentBanner compound components.
 */
export const ConsentBannerContext =
  createContext<ConsentBannerContextValue | null>(null);

/**
 * Hook to access ConsentBanner context.
 * Must be used within a ConsentBanner component.
 *
 * @throws Error if used outside of ConsentBanner
 */
export function useConsentBannerContext(): ConsentBannerContextValue {
  const context = useContext(ConsentBannerContext);

  if (!context) {
    throw new Error(
      "useConsentBannerContext must be used within a ConsentBanner component",
    );
  }

  return context;
}
