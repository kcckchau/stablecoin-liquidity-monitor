# Font System Setup - Geist

**Date**: 2026-03-13  
**Status**: ✅ Configured

## Problem

The dashboard was rendering with a serif fallback font instead of a modern sans-serif font suitable for an analytical dashboard.

## Solution

Implemented Geist Sans and Geist Mono fonts from Vercel's `geist` package.

### Why Geist?

Geist is Vercel's font family designed for:
- Modern UI/dashboard applications
- Excellent readability at all sizes
- Professional, clean appearance
- Optimized for digital interfaces
- Similar aesthetic to Linear, Vercel Dashboard, and other modern SaaS products

---

## Implementation

### 1. Package Installation

Added `geist` to dependencies:

```json
"dependencies": {
  "geist": "^1.7.0",
  ...
}
```

**Installation command:**
```bash
npm install geist
```

### 2. Layout Configuration

Updated `src/app/layout.tsx` to import and apply Geist fonts:

```tsx
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

**Key changes:**
- Imported `GeistSans` and `GeistMono` from `geist/font`
- Applied CSS variables via `GeistSans.variable` and `GeistMono.variable`
- Added `font-sans` class to body to use Geist Sans as default
- Kept `antialiased` for smooth font rendering

### 3. Tailwind Configuration

Updated `tailwind.config.ts` to reference Geist CSS variables:

```ts
fontFamily: {
  sans: [
    'var(--font-geist-sans)',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'var(--font-geist-mono)',
    'ui-monospace',
    'SFMono-Regular',
    'SF Mono',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace',
  ],
}
```

**Font stack strategy:**
1. **Primary**: Geist Sans/Mono via CSS variables
2. **Fallback**: System fonts for instant rendering during load
3. **Universal**: Standard cross-platform fonts

### 4. Fixed Tailwind Config Error

Fixed TypeScript error with `darkMode` configuration:

```ts
// ❌ Before (TypeScript error)
darkMode: ["class"],

// ✅ After (correct)
darkMode: "class",
```

---

## CSS Variables Applied

The Geist font package automatically creates these CSS variables:

```css
:root {
  --font-geist-sans: 'Geist Sans', system-ui, sans-serif;
  --font-geist-mono: 'Geist Mono', monospace;
}
```

These are applied via the `.variable` classes in the body element.

---

## Usage Throughout App

### Default Font (Sans)

All text uses Geist Sans by default via `font-sans` on body:

```tsx
<body className="font-sans antialiased">
```

### Monospace Font

Use `font-mono` for code, metrics, or tabular data:

```tsx
<code className="font-mono">API_KEY</code>
<span className="font-mono tabular-nums">1,234.56</span>
```

### Existing Components

All existing components automatically inherit Geist Sans:
- Headers
- Sidebar navigation
- Metric cards
- Chart labels
- Body text

No component changes needed - font applies globally.

---

## Font Loading Strategy

### Next.js Font Optimization

The `geist` package uses Next.js's built-in font optimization:

1. **Self-hosted**: Fonts served from your domain (no external requests)
2. **Automatic subsetting**: Only loads characters you use
3. **Preloaded**: Critical fonts preloaded for performance
4. **Zero layout shift**: Font metrics calculated to prevent CLS

### Performance Benefits

- ✅ No FOUT (Flash of Unstyled Text)
- ✅ No FOIT (Flash of Invisible Text)
- ✅ No external font CDN requests
- ✅ Optimized file sizes
- ✅ Cached with your app bundle

---

## Visual Characteristics

### Geist Sans
- **Style**: Geometric sans-serif
- **Weight range**: 100-900
- **Character**: Clean, modern, professional
- **Best for**: UI text, headings, body copy
- **Readability**: Excellent at all sizes

### Geist Mono
- **Style**: Monospaced
- **Weight range**: 100-900
- **Character**: Technical, precise
- **Best for**: Code, metrics, tabular data
- **Readability**: Clear character distinction

---

## Comparison to Previous Setup

| Aspect | Before | After |
|--------|--------|-------|
| Primary font | System fonts only | Geist Sans |
| Monospace | System monospace | Geist Mono |
| Loading | Instant (system) | Optimized (self-hosted) |
| Appearance | Generic | Modern, branded |
| Consistency | Varies by OS | Consistent across platforms |

---

## Design Alignment

The Geist font family aligns with the project's design goals:

### ✅ Institutional Dashboard Style
- Professional, not playful
- Clean and analytical
- Suitable for data-heavy interfaces

### ✅ Reference Inspirations
- **Vercel Dashboard**: Uses Geist natively
- **Linear**: Similar geometric sans aesthetic
- **Macro research terminals**: Professional typography

### ✅ Avoids
- ❌ Decorative or display fonts
- ❌ Overly rounded or casual fonts
- ❌ Fonts that compete with data

---

## Testing Checklist

After installation (`npm install`), verify:

- ✅ Dashboard text renders in Geist Sans
- ✅ No serif fonts visible
- ✅ Headers use Geist Sans (bold weights)
- ✅ Sidebar navigation uses Geist Sans
- ✅ Metric values render clearly
- ✅ No layout shift on page load
- ✅ Font loads quickly (self-hosted)

---

## Troubleshooting

### If fonts don't load:

1. **Check package installation:**
   ```bash
   npm list geist
   ```

2. **Verify CSS variables in browser DevTools:**
   ```css
   body {
     font-family: var(--font-geist-sans), system-ui, sans-serif;
   }
   ```

3. **Check body classes:**
   ```html
   <body class="font-sans antialiased">
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

### If TypeScript errors:

Ensure `geist` types are recognized:
```bash
npm install --save-dev @types/node
```

---

## Future Enhancements

Potential font-related improvements:

1. **Variable font features**: Explore OpenType features
2. **Font weight scale**: Define semantic weight tokens
3. **Line height scale**: Optimize for different content types
4. **Letter spacing**: Fine-tune for large headings

---

**Conclusion**: The app now uses Geist Sans as the primary font, providing a modern, professional appearance consistent with leading dashboard applications like Vercel and Linear.
