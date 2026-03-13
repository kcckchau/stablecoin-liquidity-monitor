/**
 * Design Tokens Reference
 * 
 * This file provides TypeScript constants for design tokens that need to be referenced in JS/TS.
 * For CSS-based tokens (colors, spacing), prefer using Tailwind utility classes.
 */

/**
 * Spacing Scale (4px base)
 * Use these constants when programmatic spacing is needed
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

/**
 * Layout Constants from Design Tokens
 */
export const LAYOUT = {
  SECTION_SPACING: 32,
  CARD_PADDING_MIN: 16,
  CARD_PADDING_MAX: 20,
  GRID_GAP_MIN: 16,
  GRID_GAP_MAX: 24,
} as const;

/**
 * Border Radius Values
 */
export const RADIUS = {
  SM: 8,   // Buttons
  MD: 12,  // Default
  LG: 16,  // Cards/Panels
  XL: 24,  // Large containers
} as const;

/**
 * Semantic Color Class Mapping
 * Helper for conditional styling
 */
export const SEMANTIC_COLORS = {
  positive: {
    bg: "bg-positive-surface",
    text: "text-positive",
    border: "border-positive",
  },
  negative: {
    bg: "bg-negative-surface",
    text: "text-negative",
    border: "border-negative",
  },
  warning: {
    bg: "bg-warning-surface",
    text: "text-warning",
    border: "border-warning",
  },
  accent: {
    bg: "bg-accent-surface",
    text: "text-accent",
    border: "border-accent",
  },
  neutral: {
    bg: "bg-surface-muted",
    text: "text-foreground-muted",
    border: "border",
  },
} as const;

/**
 * Typography Scale
 * For programmatic font size calculations
 */
export const TYPOGRAPHY = {
  PAGE_TITLE: "text-3xl font-bold",
  SECTION_TITLE: "text-xl font-semibold",
  CARD_TITLE: "text-lg font-semibold",
  METRIC_VALUE: "text-4xl font-bold metric-value",
  METRIC_LABEL: "text-sm font-medium text-foreground-muted",
  BODY: "text-base",
  CAPTION: "text-sm text-foreground-subtle",
} as const;

/**
 * Chart Color Palette
 * Use these for chart libraries that need color arrays
 */
export const CHART_COLORS = [
  "hsl(var(--chart-1))", // Cool blue
  "hsl(var(--chart-2))", // Green
  "hsl(var(--chart-3))", // Amber
  "hsl(var(--chart-4))", // Purple
  "hsl(var(--chart-5))", // Red
] as const;

/**
 * Helper function to get semantic color based on value change
 */
export function getChangeColor(value: number): keyof typeof SEMANTIC_COLORS {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

/**
 * Helper function to get color classes for a change value
 */
export function getChangeClasses(value: number) {
  const colorKey = getChangeColor(value);
  return {
    text: SEMANTIC_COLORS[colorKey].text,
    bg: SEMANTIC_COLORS[colorKey].bg,
    border: SEMANTIC_COLORS[colorKey].border,
  };
}
