# Theme Usage Guide

This document explains how to use the design tokens in your components.

## Color System

### Background Layers

Use these for creating visual hierarchy:

```tsx
// App background (darkest)
<div className="bg-background">

// Card surface (slightly lighter)
<div className="bg-surface">

// Nested panels (muted)
<div className="bg-surface-muted">
```

### Text Colors

```tsx
// Primary text
<h1 className="text-foreground">

// Secondary text
<p className="text-foreground-muted">

// Subtle text (metadata, labels)
<span className="text-foreground-subtle">
```

### Borders

```tsx
// Standard border
<div className="border border-border">

// Subtle border
<div className="border border-border-subtle">
```

### Semantic Colors

Use semantic colors for data visualization and status indication:

```tsx
// Positive (improving metrics)
<div className="bg-positive-surface text-positive">
<div className="text-positive">+2.5%</div>

// Negative (declining metrics)
<div className="bg-negative-surface text-negative">
<div className="text-negative">-1.2%</div>

// Warning (caution)
<div className="bg-warning-surface text-warning">
<div className="text-warning">High volatility</div>

// Accent (highlights, active states)
<div className="bg-accent-surface text-accent">
<button className="bg-accent text-accent-foreground">
```

## Component Patterns

### Cards

```tsx
<div className="bg-surface border border-border rounded-lg p-lg">
  <h3 className="text-lg font-semibold text-foreground mb-md">Title</h3>
  <p className="text-foreground-muted">Content</p>
</div>
```

### Metric Display

```tsx
<div className="space-y-sm">
  <span className="text-sm font-medium text-foreground-muted">
    Total Supply
  </span>
  <p className="text-4xl font-bold metric-value text-foreground">
    $142.5B
  </p>
  <span className="text-positive text-sm">+2.3%</span>
</div>
```

### Tables

```tsx
<table className="w-full">
  <thead className="bg-surface-muted border-b border-border">
    <tr>
      <th className="text-foreground-muted text-sm font-medium">Header</th>
    </tr>
  </thead>
  <tbody className="bg-surface">
    <tr className="border-b border-border-subtle">
      <td className="text-foreground">Data</td>
    </tr>
  </tbody>
</table>
```

## Using Helper Functions

Import from `@/lib/design-tokens`:

```tsx
import { getChangeColor, getChangeClasses, SEMANTIC_COLORS } from "@/lib/design-tokens";

// Get semantic color based on value
const colorKey = getChangeColor(change); // "positive" | "negative" | "neutral"

// Get classes for a change value
const { text, bg, border } = getChangeClasses(change);
<div className={`${bg} ${text}`}>

// Direct access to semantic color classes
<div className={SEMANTIC_COLORS.positive.text}>
```

## Spacing

Use the 4px base spacing system:

```tsx
// Spacing utilities (xs, sm, md, lg, xl, 2xl)
<div className="p-md">         // 16px padding
<div className="space-y-sm">   // 8px vertical spacing
<div className="gap-lg">       // 24px gap

// Layout constants
import { LAYOUT } from "@/lib/design-tokens";

// Section spacing: 32px
<section className="space-y-[32px]">

// Card padding: 16-20px
<div className="p-md"> or <div className="p-[20px]">

// Grid gap: 16-24px
<div className="gap-md"> or <div className="gap-lg">
```

## Border Radius

```tsx
// Cards and panels
<div className="rounded-lg">   // 16px

// Buttons
<button className="rounded-sm"> // 8px

// Large containers
<div className="rounded-xl">    // 24px
```

## Chart Colors

For chart libraries:

```tsx
import { CHART_COLORS } from "@/lib/design-tokens";

// Use in chart configuration
const chartConfig = {
  colors: CHART_COLORS,
};
```

## Typography

```tsx
import { TYPOGRAPHY } from "@/lib/design-tokens";

// Page title
<h1 className={TYPOGRAPHY.PAGE_TITLE}>Dashboard</h1>

// Section title
<h2 className={TYPOGRAPHY.SECTION_TITLE}>Overview</h2>

// Metric value (includes tabular-nums)
<p className={TYPOGRAPHY.METRIC_VALUE}>$142.5B</p>

// Metric label
<span className={TYPOGRAPHY.METRIC_LABEL}>Total Supply</span>

// Caption / metadata
<span className={TYPOGRAPHY.CAPTION}>Last updated 2 hours ago</span>
```

## Best Practices

### ✅ Do

- Use semantic color tokens (`bg-surface`, `text-positive`)
- Reference spacing scale (`p-md`, `gap-lg`)
- Use helper functions for conditional styling
- Apply `.metric-value` class for numeric values
- Use `border-border` for consistent borders

### ❌ Don't

- Use arbitrary values unless absolutely necessary
- Use default Tailwind gray utilities (`gray-100`, `gray-800`)
- Mix semantic and arbitrary color values
- Create new spacing values outside the scale
- Use heavy shadows (prefer subtle borders)

## Dark Mode

The theme is dark-first by default. If you need to support light mode in the future:

```tsx
// The .light class will automatically switch the theme
<html className="dark"> // or "light"
```

## Component Examples

See existing components for reference:
- `src/components/cards/regime-card.tsx`
- `src/components/cards/metric-card.tsx`
- `src/components/signals/signal-summary.tsx`

All future components should follow these patterns.
