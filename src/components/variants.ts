import { cva, type VariantProps } from "class-variance-authority";

/**
 * Banner container variants using class-variance-authority.
 * Compatible with Tailwind CSS v3 and v4.
 *
 * @example
 * ```tsx
 * <div className={bannerVariants({ position: "bottom", variant: "default" })} />
 * ```
 */
export const bannerVariants = cva(
  // Base styles - using standard Tailwind classes for v3/v4 compatibility
  [
    "fixed left-0 right-0 z-50",
    "flex items-center justify-between gap-4",
    "px-4 py-3 sm:px-6 sm:py-4",
    "shadow-lg",
    // Animation
    "transition-all duration-300 ease-in-out",
  ],
  {
    variants: {
      /**
       * Banner position on screen.
       */
      position: {
        top: "top-0",
        bottom: "bottom-0",
        center: [
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "max-w-lg rounded-lg",
        ],
      },
      /**
       * Visual variant of the banner.
       */
      variant: {
        default: [
          "bg-slate-900 text-white",
          "border-t border-slate-800",
        ],
        dark: [
          "bg-gray-950 text-white",
          "border-t border-gray-900",
        ],
        light: [
          "bg-white text-gray-900",
          "border-t border-gray-200",
        ],
        primary: [
          "bg-blue-600 text-white",
          "border-t border-blue-500",
        ],
        minimal: [
          "bg-gray-100 text-gray-800",
          "border-t border-gray-200",
          "shadow-sm",
        ],
      },
      /**
       * Banner size.
       */
      size: {
        sm: "py-2 text-sm",
        default: "py-3 text-base",
        lg: "py-4 text-lg",
      },
    },
    defaultVariants: {
      position: "bottom",
      variant: "default",
      size: "default",
    },
  },
);

/**
 * Content container variants.
 */
export const contentVariants = cva(
  "flex-1 text-sm sm:text-base",
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      align: "left",
    },
  },
);

/**
 * Actions container variants.
 */
export const actionsVariants = cva(
  "flex shrink-0 items-center gap-2",
  {
    variants: {
      layout: {
        row: "flex-row",
        column: "flex-col",
      },
    },
    defaultVariants: {
      layout: "row",
    },
  },
);

/**
 * Button variants for banner actions.
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-md px-4 py-2",
    "text-sm font-medium",
    "transition-colors duration-200",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      /**
       * Button visual variant.
       */
      variant: {
        primary: [
          "bg-white text-gray-900",
          "hover:bg-gray-100",
          "focus:ring-white",
        ],
        secondary: [
          "bg-transparent text-current",
          "border border-current",
          "hover:bg-white/10",
          "focus:ring-white",
        ],
        ghost: [
          "bg-transparent text-current",
          "hover:bg-white/10",
          "focus:ring-white",
        ],
        link: [
          "bg-transparent text-current underline",
          "hover:no-underline",
          "px-1 py-0",
        ],
      },
      /**
       * Button size.
       */
      size: {
        sm: "px-3 py-1.5 text-xs",
        default: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

// Type exports for variants
export type BannerVariants = VariantProps<typeof bannerVariants>;
export type ContentVariants = VariantProps<typeof contentVariants>;
export type ActionsVariants = VariantProps<typeof actionsVariants>;
export type ButtonVariants = VariantProps<typeof buttonVariants>;
