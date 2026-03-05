import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import {
  getStorageValue,
  removeStorageValue,
  setStorageValue,
  type StorageOptions,
} from "../utils/storage";

/**
 * Consent status values.
 */
export type ConsentStatus = "pending" | "accepted" | "dismissed";

/**
 * Options for the useConsentBanner hook.
 */
export interface UseConsentBannerOptions extends StorageOptions {
  /**
   * Unique key for storing consent state.
   * Different banners should use different keys.
   * @example "cookie-consent", "privacy-policy-v2"
   */
  storageKey: string;

  /**
   * Called when user accepts the banner.
   */
  onAccept?: () => void;

  /**
   * Called when user dismisses the banner.
   */
  onDismiss?: () => void;

  /**
   * Called when consent status changes.
   */
  onChange?: (status: ConsentStatus) => void;

  /**
   * If true, banner won't auto-show. Manual control only.
   * @default false
   */
  manual?: boolean;

  /**
   * If true, automatically accepts consent when user navigates away
   * without explicitly responding. Useful for "continued use implies consent".
   * @default false
   */
  autoAcceptOnNavigate?: boolean;
}

/**
 * Return value of useConsentBanner hook.
 */
export interface UseConsentBannerReturn {
  /** Current consent status */
  status: ConsentStatus;
  /** Whether the banner should be visible */
  isVisible: boolean;
  /** Accept the consent */
  accept: () => void;
  /** Dismiss without accepting */
  dismiss: () => void;
  /** Reset consent state (show banner again) */
  reset: () => void;
  /** Manually show the banner */
  show: () => void;
  /** Manually hide the banner */
  hide: () => void;
}

// Storage value constants
const ACCEPTED_VALUE = "accepted";
const DISMISSED_VALUE = "dismissed";

// Store for managing visibility state (separate from consent)
const visibilityStore = new Map<string, boolean>();
const visibilityListeners = new Map<string, Set<() => void>>();

function getVisibility(key: string): boolean {
  return visibilityStore.get(key) ?? false;
}

function setVisibility(key: string, visible: boolean): void {
  visibilityStore.set(key, visible);
  const listeners = visibilityListeners.get(key);
  if (listeners) {
    listeners.forEach((listener) => listener());
  }
}

function subscribeVisibility(key: string, callback: () => void): () => void {
  let listeners = visibilityListeners.get(key);
  if (!listeners) {
    listeners = new Set();
    visibilityListeners.set(key, listeners);
  }
  listeners.add(callback);
  return () => listeners!.delete(callback);
}

/**
 * Clears all visibility state. For testing purposes only.
 * @internal
 */
export function __clearVisibilityStore(): void {
  visibilityStore.clear();
  visibilityListeners.clear();
}

/**
 * Hook for managing consent banner state.
 *
 * Uses localStorage (default) to persist consent decisions.
 * SSR-safe - returns "pending" status during server render.
 *
 * @example
 * ```tsx
 * const { isVisible, accept, dismiss } = useConsentBanner({
 *   storageKey: "cookie-consent",
 *   onAccept: () => enableAnalytics(),
 * });
 * ```
 */
export function useConsentBanner(
  options: UseConsentBannerOptions,
): UseConsentBannerReturn {
  const {
    storageKey,
    onAccept,
    onDismiss,
    onChange,
    manual = false,
    autoAcceptOnNavigate = false,
    ...storageOptions
  } = options;

  // Use ref for storage options to avoid effect re-runs on every render
  const storageOptionsRef = useRef(storageOptions);
  storageOptionsRef.current = storageOptions;

  // Get consent status from storage (SSR-safe)
  const status = useSyncExternalStore(
    useCallback(() => {
      // No-op subscribe since localStorage doesn't have events across tabs in this impl
      return () => {};
    }, []),
    // Client snapshot
    () => getConsentStatus(storageKey, storageOptionsRef.current),
    // Server snapshot
    () => "pending" as ConsentStatus,
  );

  // Track visibility separately
  const isVisible = useSyncExternalStore(
    useCallback(
      (callback) => subscribeVisibility(storageKey, callback),
      [storageKey],
    ),
    () => getVisibility(storageKey),
    () => false,
  );

  // Auto-show banner on mount if consent is pending and not manual
  // Check storage directly to avoid hydration timing issues with useSyncExternalStore
  useEffect(() => {
    if (!manual) {
      const currentStatus = getConsentStatus(
        storageKey,
        storageOptionsRef.current,
      );
      if (currentStatus === "pending") {
        setVisibility(storageKey, true);
      }
    }
  }, [manual, storageKey]);

  // Auto-accept on navigation if enabled and still pending
  // Detects both traditional navigation (unmount) and SPA navigation (history events)
  useEffect(() => {
    if (!autoAcceptOnNavigate) {
      return;
    }

    // Track if cleanup has run to prevent double-saves
    let hasNavigated = false;

    // Handler for SPA navigation (intercepts history.pushState/replaceState)
    // Uses queueMicrotask to defer state updates and avoid React commit phase conflicts
    const handleNavigation = () => {
      if (hasNavigated) return;

      const currentStatus = getConsentStatus(
        storageKey,
        storageOptionsRef.current,
      );
      if (currentStatus === "pending") {
        hasNavigated = true;
        // Defer state updates to avoid "useInsertionEffect must not schedule updates" error
        queueMicrotask(() => {
          setStorageValue(
            storageKey,
            ACCEPTED_VALUE,
            storageOptionsRef.current,
          );
          setVisibility(storageKey, false);
        });
      }
    };

    // Intercept history.pushState to detect Next.js client-side navigation
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    history.pushState = function (...args) {
      handleNavigation();
      return originalPushState(...args);
    };

    history.replaceState = function (...args) {
      handleNavigation();
      return originalReplaceState(...args);
    };

    // Also listen for popstate (back/forward navigation)
    window.addEventListener("popstate", handleNavigation);

    return () => {
      // Restore original methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", handleNavigation);

      // Component unmount also counts as navigation (only if not already navigated)
      if (!hasNavigated) {
        const currentStatus = getConsentStatus(
          storageKey,
          storageOptionsRef.current,
        );
        if (currentStatus === "pending") {
          setStorageValue(
            storageKey,
            ACCEPTED_VALUE,
            storageOptionsRef.current,
          );
          setVisibility(storageKey, false);
        }
      }
    };
  }, [autoAcceptOnNavigate, storageKey]);

  const accept = useCallback(() => {
    setStorageValue(storageKey, ACCEPTED_VALUE, storageOptionsRef.current);
    setVisibility(storageKey, false);
    onAccept?.();
    onChange?.("accepted");
  }, [storageKey, onAccept, onChange]);

  const dismiss = useCallback(() => {
    setStorageValue(storageKey, DISMISSED_VALUE, storageOptionsRef.current);
    setVisibility(storageKey, false);
    onDismiss?.();
    onChange?.("dismissed");
  }, [storageKey, onDismiss, onChange]);

  const reset = useCallback(() => {
    removeStorageValue(storageKey, storageOptionsRef.current);
    setVisibility(storageKey, true);
    onChange?.("pending");
  }, [storageKey, onChange]);

  const show = useCallback(() => {
    setVisibility(storageKey, true);
  }, [storageKey]);

  const hide = useCallback(() => {
    setVisibility(storageKey, false);
  }, [storageKey]);

  return {
    status,
    isVisible,
    accept,
    dismiss,
    reset,
    show,
    hide,
  };
}

/**
 * Gets the consent status from storage.
 */
function getConsentStatus(key: string, options: StorageOptions): ConsentStatus {
  const value = getStorageValue(key, options);

  if (value === ACCEPTED_VALUE) {
    return "accepted";
  }

  if (value === DISMISSED_VALUE) {
    return "dismissed";
  }

  return "pending";
}
