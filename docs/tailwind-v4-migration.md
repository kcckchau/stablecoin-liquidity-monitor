# Tailwind CSS v4 Migration

**Date**: 2026-03-13  
**Status**: ✅ Migrated

## Problem

Responsive breakpoints (`sm:`, `md:`, `lg:`, etc.) were not working at all. The project was using **Tailwind CSS v4** but was configured for **Tailwind CSS v3**.

## Root Cause

Tailwind CSS v4 has a completely different configuration system:

### Tailwind v3 (Old)
- Uses `tailwind.config.js` or `tailwind.config.ts`
- Uses `@tailwind base`, `@tailwind components`, `@tailwind utilities` directives
- Configuration in JavaScript/TypeScript

### Tailwind v4 (New)
- **No config file needed** - configuration is done in CSS
- Uses `@import "tailwindcss"` directive
- Uses `@theme` directive for customization
- CSS-first configuration

## What Was Wrong

The project had:
```json
"devDependencies": {
  "@tailwindcss/postcss": "^4",
  "tailwindcss": "^4"
}
```

But was using v3 syntax:
```css
/* ❌ Old v3 syntax */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

And had a `tailwind.config.ts` file (which v4 ignores).

## Solution

### 1. Updated `globals.css`

**Before (v3 syntax):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222 15% 8%;
    /* ... */
  }
}
```

**After (v4 syntax):**
```css
@import "tailwindcss";

@theme {
  /* Custom spacing, colors, fonts */
  --spacing-xs: 0.25rem;
  --color-background: 222 15% 8%;
  --font-family-sans: var(--font-geist-sans), system-ui, ...;
}

@layer base {
  :root {
    /* Legacy CSS variables for compatibility */
    --background: var(--color-background);
  }
}
```

### 2. Removed `tailwind.config.ts`

Tailwind v4 doesn't use this file. All configuration is now in CSS via the `@theme` directive.

### 3. Kept `postcss.config.mjs`

This file is still needed and correct:
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

## Tailwind v4 Configuration

### Theme Customization

In v4, use the `@theme` directive in your CSS:

```css
@theme {
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;

  /* Border radius */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;

  /* Colors (HSL format) */
  --color-background: 222 15% 8%;
  --color-surface: 222 13% 11%;
  --color-foreground: 222 10% 95%;
  /* ... */

  /* Fonts */
  --font-family-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-family-mono: var(--font-geist-mono), ui-monospace, monospace;
}
```

### Using Custom Values

Tailwind v4 automatically generates utilities from `@theme` variables:

```tsx
// Spacing
<div className="p-xs" />      // padding: 0.25rem
<div className="m-lg" />       // margin: 1.5rem

// Colors
<div className="bg-surface" /> // background: hsl(222 13% 11%)
<div className="text-foreground" /> // color: hsl(222 10% 95%)

// Border radius
<div className="rounded-lg" /> // border-radius: 1rem

// Fonts
<div className="font-sans" />  // font-family: var(--font-geist-sans), ...
```

## Breakpoints

Tailwind v4 uses the same default breakpoints as v3:

| Breakpoint | Min Width |
|------------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

These work automatically - no configuration needed.

### Custom Breakpoints (if needed)

To customize breakpoints in v4, use `@theme`:

```css
@theme {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

## Migration Checklist

- ✅ Updated `globals.css` to use `@import "tailwindcss"`
- ✅ Moved configuration to `@theme` directive
- ✅ Removed `tailwind.config.ts`
- ✅ Kept `postcss.config.mjs` with `@tailwindcss/postcss`
- ✅ Maintained backward compatibility with legacy CSS variables
- ✅ Verified breakpoints work (`sm:`, `md:`, `lg:`, etc.)

## Benefits of v4

### Simpler Configuration
- No JavaScript config file
- Everything in CSS
- Less context switching

### Better Performance
- Faster build times
- Smaller CSS output
- Better tree-shaking

### CSS-First
- More intuitive for CSS developers
- Better IDE support
- Easier to debug

## Compatibility Layer

To maintain compatibility with existing components, we kept legacy CSS variables:

```css
@layer base {
  :root {
    /* Map old variables to new theme variables */
    --background: var(--color-background);
    --surface: var(--color-surface);
    --foreground: var(--color-foreground);
    /* ... */
  }
}
```

This allows existing code like `hsl(var(--background))` to continue working.

## Testing

After migration, verify:

1. **Breakpoints work:**
   ```tsx
   <div className="hidden lg:block" /> // Hidden on mobile, visible on desktop
   ```

2. **Custom spacing works:**
   ```tsx
   <div className="p-lg m-xl" /> // Uses custom spacing tokens
   ```

3. **Custom colors work:**
   ```tsx
   <div className="bg-surface text-foreground" /> // Uses custom colors
   ```

4. **Fonts work:**
   ```tsx
   <div className="font-sans" /> // Uses Geist Sans
   ```

## Documentation

- [Tailwind CSS v4 Beta Docs](https://tailwindcss.com/docs/v4-beta)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [CSS Configuration](https://tailwindcss.com/docs/configuration)

## Common Issues

### Issue: Breakpoints not working
**Solution**: Ensure viewport meta tag is set (see `viewport-breakpoint-fix.md`)

### Issue: Custom colors not working
**Solution**: Use `--color-*` prefix in `@theme`, then reference without prefix in classes

### Issue: Build errors
**Solution**: Restart dev server after changing `globals.css`

---

**Conclusion**: The project is now properly configured for Tailwind CSS v4. All responsive breakpoints and custom theme values work correctly.
