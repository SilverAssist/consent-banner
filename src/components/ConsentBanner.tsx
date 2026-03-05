import React, {
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  useConsentBanner,
  type UseConsentBannerOptions,
  type UseConsentBannerReturn,
} from "../hooks/useConsentBanner";
import { cn } from "../utils/cn";
import { ConsentBannerContext } from "./context";
import {
  actionsVariants,
  bannerVariants,
  buttonVariants,
  contentVariants,
  type ActionsVariants,
  type BannerVariants,
  type ButtonVariants,
  type ContentVariants,
} from "./variants";

// ============================================================================
// ConsentBanner Root Component
// ============================================================================

/**
 * Props for the ConsentBanner root component.
 */
export interface ConsentBannerProps
  extends UseConsentBannerOptions,
    BannerVariants {
  /**
   * Banner content. Can be:
   * - React nodes (compound components)
   * - Render function for full control
   */
  children:
    | ReactNode
    | ((props: UseConsentBannerReturn) => ReactNode);

  /**
   * Additional CSS classes for the banner container.
   */
  className?: string;

  /**
   * CSS classes for the inner container (e.g., "container mx-auto px-4").
   * When provided, wraps the content in a container div with these classes.
   * Useful for centering content within the full-width banner.
   * @default "container mx-auto flex items-center justify-between gap-4 px-4"
   */
  containerClassName?: string;

  /**
   * Whether to disable the default container wrapper.
   * Set to true to render children directly without a container div.
   * @default false
   */
  disableContainer?: boolean;

  /**
   * ARIA role for the banner.
   * @default "alertdialog"
   */
  role?: "alert" | "alertdialog" | "dialog" | "status";

  /**
   * Action to perform when Escape key is pressed.
   * - "dismiss": Persist dismissal to storage
   * - "hide": Hide without persisting
   * - "none": Disable Escape key handling
   * @default "dismiss"
   */
  escapeAction?: "dismiss" | "hide" | "none";

  /**
   * Whether to trap focus within the banner (recommended for center/modal position).
   * @default false for top/bottom positions, true for center position
   */
  trapFocus?: boolean;

  /**
   * Whether to auto-focus the first interactive element when the banner appears.
   * @default true
   */
  autoFocus?: boolean;

  /**
   * ARIA label for screen readers.
   */
  "aria-label"?: string;
}

/**
 * ConsentBanner - A flexible, accessible consent banner component.
 *
 * Supports compound component pattern for composition:
 * ```tsx
 * <ConsentBanner storageKey="cookie-consent">
 *   <ConsentBanner.Content>
 *     We use cookies to improve your experience.
 *   </ConsentBanner.Content>
 *   <ConsentBanner.Actions>
 *     <ConsentBanner.AcceptButton>Accept</ConsentBanner.AcceptButton>
 *   </ConsentBanner.Actions>
 * </ConsentBanner>
 * ```
 *
 * Or with render prop for full control:
 * ```tsx
 * <ConsentBanner storageKey="cookie-consent">
 *   {({ accept, dismiss }) => (
 *     <div>Custom UI</div>
 *   )}
 * </ConsentBanner>
 * ```
 */
function ConsentBannerRoot({
  children,
  className,
  containerClassName,
  disableContainer = false,
  position,
  variant,
  size,
  role = "alertdialog",
  "aria-label": ariaLabel = "Consent notice",
  escapeAction = "dismiss",
  trapFocus,
  autoFocus = true,
  ...hookOptions
}: ConsentBannerProps): React.ReactElement | null {
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerState = useConsentBanner(hookOptions);

  // Default trapFocus to true for center position (modal-like)
  const shouldTrapFocus = trapFocus ?? position === "center";

  // Handle Escape key press
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && escapeAction !== "none") {
        event.preventDefault();
        if (escapeAction === "dismiss") {
          bannerState.dismiss();
        } else {
          bannerState.hide();
        }
      }

      // Focus trapping for Tab key
      if (shouldTrapFocus && event.key === "Tab" && bannerRef.current) {
        const focusableElements = bannerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [escapeAction, shouldTrapFocus, bannerState],
  );

  // Set up keyboard event listener
  useEffect(() => {
    if (!bannerState.isVisible) return;

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [bannerState.isVisible, handleKeyDown]);

  // Auto-focus first interactive element on mount
  useEffect(() => {
    if (!autoFocus || !bannerState.isVisible || !bannerRef.current) return;

    // Use requestAnimationFrame to ensure DOM is ready
    const frameId = requestAnimationFrame(() => {
      const firstFocusable = bannerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      firstFocusable?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [autoFocus, bannerState.isVisible]);

  const contextValue = useMemo(
    () => ({
      ...bannerState,
      variants: { position, variant, size },
    }),
    [bannerState, position, variant, size],
  );

  // Don't render if not visible
  if (!bannerState.isVisible) {
    return null;
  }

  // Support render prop pattern
  const rawContent =
    typeof children === "function" ? children(bannerState) : children;

  // Default container classes for centering and layout
  const defaultContainerClasses =
    "container mx-auto flex items-center justify-between gap-4 px-4";

  // Wrap content in container unless explicitly disabled
  const content = disableContainer ? (
    rawContent
  ) : (
    <div className={cn(defaultContainerClasses, containerClassName)}>
      {rawContent}
    </div>
  );

  return (
    <ConsentBannerContext.Provider value={contextValue}>
      <div
        ref={bannerRef}
        role={role}
        aria-label={ariaLabel}
        aria-modal={shouldTrapFocus ? "true" : "false"}
        aria-live="polite"
        tabIndex={-1}
        className={cn(bannerVariants({ position, variant, size }), className)}
      >
        {content}
      </div>
    </ConsentBannerContext.Provider>
  );
}

// ============================================================================
// ConsentBanner.Content
// ============================================================================

/**
 * Props for the Content sub-component.
 */
export interface ContentProps extends ContentVariants {
  children: ReactNode;
  className?: string;
}

/**
 * Content container for the banner message.
 */
function Content({
  children,
  className,
  align,
}: ContentProps): React.ReactElement {
  return (
    <div className={cn(contentVariants({ align }), className)}>{children}</div>
  );
}

// ============================================================================
// ConsentBanner.Actions
// ============================================================================

/**
 * Props for the Actions sub-component.
 */
export interface ActionsProps extends ActionsVariants {
  children: ReactNode;
  className?: string;
}

/**
 * Container for banner action buttons.
 */
function Actions({
  children,
  className,
  layout,
}: ActionsProps): React.ReactElement {
  return (
    <div className={cn(actionsVariants({ layout }), className)}>{children}</div>
  );
}

// ============================================================================
// ConsentBanner.AcceptButton
// ============================================================================

/**
 * Props for button sub-components.
 */
export interface BannerButtonProps
  extends ButtonVariants,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  children: ReactNode;
  /**
   * Additional click handler (called after state update).
   */
  onClick?: () => void;
}

/**
 * Accept button that marks consent as accepted.
 */
function AcceptButton({
  children,
  className,
  variant = "primary",
  size,
  onClick,
  ...props
}: BannerButtonProps): React.ReactElement {
  const { accept } = useConsentBannerContextSafe();

  const handleClick = (): void => {
    accept();
    onClick?.();
  };

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================================================
// ConsentBanner.DismissButton
// ============================================================================

/**
 * Dismiss button that hides the banner without accepting.
 */
function DismissButton({
  children,
  className,
  variant = "secondary",
  size,
  onClick,
  ...props
}: BannerButtonProps): React.ReactElement {
  const { dismiss } = useConsentBannerContextSafe();

  const handleClick = (): void => {
    dismiss();
    onClick?.();
  };

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

// ============================================================================
// ConsentBanner.CloseButton
// ============================================================================

/**
 * Props for the close button.
 */
export interface CloseButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /**
   * Whether clicking close should dismiss (persist) or just hide (temporary).
   * @default "hide"
   */
  action?: "hide" | "dismiss";
  className?: string;
  /**
   * Additional click handler.
   */
  onClick?: () => void;
}

/**
 * Close/X button for the banner.
 */
function CloseButton({
  action = "hide",
  className,
  onClick,
  ...props
}: CloseButtonProps): React.ReactElement {
  const { hide, dismiss } = useConsentBannerContextSafe();

  const handleClick = (): void => {
    if (action === "dismiss") {
      dismiss();
    } else {
      hide();
    }
    onClick?.();
  };

  return (
    <button
      type="button"
      aria-label="Close"
      className={cn(
        "ml-2 rounded p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

// ============================================================================
// ConsentBanner.Link
// ============================================================================

/**
 * Props for the Link sub-component.
 */
export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  className?: string;
}

/**
 * Styled link for use within banner content.
 */
function Link({
  children,
  className,
  ...props
}: LinkProps): React.ReactElement {
  return (
    <a
      className={cn("underline hover:no-underline", className)}
      {...props}
    >
      {children}
    </a>
  );
}

// ============================================================================
// Helper hook with graceful fallback for standalone button usage
// ============================================================================

function useConsentBannerContextSafe(): {
  accept: () => void;
  dismiss: () => void;
  hide: () => void;
} {
  const context = useContext(ConsentBannerContext);

  if (!context) {
    // Return no-op functions if used outside context
    // This allows buttons to be used standalone (though not recommended)
    return {
      accept: () => {
        console.warn("AcceptButton used outside ConsentBanner context");
      },
      dismiss: () => {
        console.warn("DismissButton used outside ConsentBanner context");
      },
      hide: () => {
        console.warn("CloseButton used outside ConsentBanner context");
      },
    };
  }

  return context;
}

// ============================================================================
// Compound Component Assembly
// ============================================================================

/**
 * ConsentBanner compound component with all sub-components.
 */
export const ConsentBanner = Object.assign(ConsentBannerRoot, {
  Content,
  Actions,
  AcceptButton,
  DismissButton,
  CloseButton,
  Link,
});

// Export sub-components individually for flexibility
export {
  ConsentBannerRoot,
  Content as ConsentBannerContent,
  Actions as ConsentBannerActions,
  AcceptButton as ConsentBannerAcceptButton,
  DismissButton as ConsentBannerDismissButton,
  CloseButton as ConsentBannerCloseButton,
  Link as ConsentBannerLink,
};
