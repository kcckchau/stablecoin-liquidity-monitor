# Color Palette Reference

Visual reference for the Stablecoin Liquidity Monitor color system.

## Background Layers

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `background` | `222 15% 8%` | App background (very dark neutral) |
| `surface` | `222 13% 11%` | Card surface (slightly lighter) |
| `surface-muted` | `222 12% 14%` | Nested panels (muted) |

**Visual Hierarchy:** `background` → `surface` → `surface-muted`

## Borders

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `border` | `222 10% 20%` | Standard border (low contrast) |
| `border-subtle` | `222 10% 16%` | Subtle border (even lower contrast) |

## Text / Foreground

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `foreground` | `222 10% 95%` | Primary text (near-white) |
| `foreground-muted` | `222 8% 65%` | Secondary text (muted gray) |
| `foreground-subtle` | `222 8% 50%` | Metadata/labels (subtle gray) |

## Semantic Colors

### Positive (Improving Metrics)

| Token | HSL Value |
|-------|-----------|
| `positive` | `142 45% 45%` (muted green) |
| `positive-foreground` | `142 45% 95%` |
| `positive-surface` | `142 35% 15%` |

### Negative (Declining Metrics)

| Token | HSL Value |
|-------|-----------|
| `negative` | `0 45% 50%` (muted red) |
| `negative-foreground` | `0 45% 95%` |
| `negative-surface` | `0 35% 15%` |

### Warning (Caution Signals)

| Token | HSL Value |
|-------|-----------|
| `warning` | `38 92% 50%` (amber) |
| `warning-foreground` | `38 92% 10%` |
| `warning-surface` | `38 50% 15%` |

### Accent (Highlights / Active)

| Token | HSL Value |
|-------|-----------|
| `accent` | `210 70% 55%` (cool blue) |
| `accent-foreground` | `210 70% 98%` |
| `accent-surface` | `210 50% 15%` |

## Chart Colors

Designed for data visualization:

| Chart | HSL Value | Color |
|-------|-----------|-------|
| `chart-1` | `210 70% 55%` | Cool Blue (primary) |
| `chart-2` | `142 45% 45%` | Green (secondary) |
| `chart-3` | `38 92% 50%` | Amber (tertiary) |
| `chart-4` | `280 55% 55%` | Purple (quaternary) |
| `chart-5` | `0 45% 50%` | Red (quinary) |

## Usage Examples

### Card with Positive Metric

```tsx
<div className="bg-surface border border-border rounded-lg p-lg">
  <p className="text-foreground-muted text-sm">Net Flow</p>
  <p className="text-foreground text-3xl font-bold">$50M</p>
  <p className="text-positive text-sm">+12.5%</p>
</div>
```

### Warning Badge

```tsx
<div className="bg-warning-surface text-warning px-md py-sm rounded-md">
  <span className="text-sm font-medium">High Volatility</span>
</div>
```

### Accent Button

```tsx
<button className="bg-accent text-accent-foreground px-lg py-md rounded-sm">
  View Details
</button>
```

## Design Principles

### Contrast

All color combinations meet WCAG AA contrast requirements for dashboard readability.

### Analytical Feel

- Muted, professional colors
- No neon or overly saturated colors
- Calm, institutional aesthetic

### Semantic Consistency

- Green = positive/improving
- Red = negative/declining
- Amber = warning/caution
- Blue = accent/highlight

### Subtle Elevation

Hierarchy is created through:
- Surface contrast (not shadows)
- Spacing
- Typography
- Subtle borders

## HSL Benefits

We use HSL (Hue, Saturation, Lightness) for:
- Easy color manipulation
- Consistent lightness across variants
- Better theme switching support
- Accessible contrast control

## Accessibility

All text/background combinations have been tested for:
- WCAG AA compliance (minimum 4.5:1 for normal text)
- WCAG AAA compliance for critical metrics
- Color-blind friendly palette
- High contrast for data readability
