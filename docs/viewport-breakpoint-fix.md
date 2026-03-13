# Viewport & Breakpoint Fix

**Date**: 2026-03-13  
**Status**: ✅ Fixed

## Problem

The `lg:hidden` and other responsive breakpoint classes were not working properly. The mobile toggle button was showing on desktop, and the desktop sidebar wasn't displaying correctly.

## Root Cause

**Missing viewport meta tag** in the HTML head.

Without a proper viewport configuration, browsers don't respect CSS media queries correctly, causing:
- Mobile breakpoints to trigger on desktop
- Desktop breakpoints to not trigger when expected
- Responsive utilities like `lg:hidden`, `lg:block` to malfunction

## Solution

Added viewport configuration to Next.js metadata in `src/app/layout.tsx`:

```tsx
export const metadata: Metadata = {
  title: "Stablecoin Liquidity Monitor",
  description: "Crypto liquidity intelligence dashboard - Track macro liquidity conditions and stablecoin expansion",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};
```

### What This Does

- **`width: "device-width"`**: Sets viewport width to the device's actual width
- **`initialScale: 1`**: Prevents zoom on page load
- **`maximumScale: 1`**: Prevents user zoom (optional, for app-like experience)

This generates the following HTML meta tag:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

## Tailwind Breakpoints

Tailwind CSS uses these default breakpoints (which are now properly detected):

| Breakpoint | Min Width | Description |
|------------|-----------|-------------|
| `sm` | 640px | Small devices |
| `md` | 768px | Medium devices |
| `lg` | 1024px | Large devices (desktop) |
| `xl` | 1280px | Extra large |
| `2xl` | 1536px | 2X extra large |

### Our Usage

- **`lg:hidden`**: Hide on desktop (≥1024px), show on mobile
- **`lg:block`**: Show on desktop (≥1024px), hide on mobile
- **`lg:pl-64`**: Apply left padding on desktop only

## Impact on Sidebar

With the viewport fix, the sidebar now correctly:

### Desktop (≥1024px)
- ✅ Desktop sidebar visible (`lg:block`)
- ✅ Mobile toggle button hidden (`lg:hidden`)
- ✅ Mobile sidebar hidden (`lg:hidden`)
- ✅ Content offset by 256px (`lg:pl-64`)

### Mobile (<1024px)
- ✅ Desktop sidebar hidden (`hidden lg:block` → hidden)
- ✅ Mobile toggle button visible (`lg:hidden` → visible)
- ✅ Mobile sidebar slide-in works (`lg:hidden` → visible when open)
- ✅ No content offset (no `lg:pl-64` applied)

## Testing

### Before Fix
```
Desktop (1920px viewport):
- Mobile toggle button: ❌ Visible (should be hidden)
- Desktop sidebar: ❌ Hidden (should be visible)
- Breakpoint detection: ❌ Not working

Mobile (375px viewport):
- Mobile toggle button: ✅ Visible
- Desktop sidebar: ✅ Hidden
- Breakpoint detection: ❌ Inconsistent
```

### After Fix
```
Desktop (1920px viewport):
- Mobile toggle button: ✅ Hidden
- Desktop sidebar: ✅ Visible
- Breakpoint detection: ✅ Working

Mobile (375px viewport):
- Mobile toggle button: ✅ Visible
- Desktop sidebar: ✅ Hidden
- Breakpoint detection: ✅ Working
```

## Why This Matters

### Without Viewport Meta Tag
Browsers assume a desktop-width viewport (typically 980px) even on mobile devices. This causes:
- Mobile devices to render desktop layouts
- Media queries to not trigger correctly
- Responsive utilities to fail
- Poor mobile UX

### With Viewport Meta Tag
Browsers use the actual device width, enabling:
- Correct media query detection
- Proper responsive behavior
- Tailwind breakpoints working as expected
- Good mobile and desktop UX

## Related Files

- `src/app/layout.tsx` - Added viewport metadata
- `src/components/layout/sidebar.tsx` - Uses `lg:hidden` and `lg:block`
- `src/components/layout/app-shell.tsx` - Uses `lg:pl-64`
- `tailwind.config.ts` - Uses default Tailwind breakpoints

## Best Practices

### Always Include Viewport Meta Tag

For any responsive web application:

```tsx
// Next.js 13+ (App Router)
export const metadata: Metadata = {
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};
```

Or in HTML:
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Tailwind Responsive Design

With proper viewport configuration, use Tailwind's mobile-first approach:

```tsx
// ✅ Good: Mobile first, desktop override
className="block lg:hidden"  // Show on mobile, hide on desktop

// ✅ Good: Mobile first, desktop override
className="hidden lg:block"  // Hide on mobile, show on desktop

// ❌ Bad: Desktop first (harder to maintain)
className="lg:hidden block"  // Confusing order
```

## Verification

To verify breakpoints are working:

1. **Open browser DevTools**
2. **Toggle device toolbar** (Cmd+Shift+M on Mac)
3. **Test different viewport widths:**
   - 375px (mobile) - toggle button visible, desktop sidebar hidden
   - 768px (tablet) - toggle button visible, desktop sidebar hidden
   - 1024px (desktop) - toggle button hidden, desktop sidebar visible
   - 1920px (large desktop) - toggle button hidden, desktop sidebar visible

## Additional Notes

### Maximum Scale

We set `maximumScale: 1` to prevent user zoom. This is optional and can be removed if you want to allow zoom:

```tsx
viewport: {
  width: "device-width",
  initialScale: 1,
  // Remove maximumScale to allow zoom
},
```

### Accessibility Consideration

Preventing zoom (`maximumScale: 1`) can hurt accessibility for users who need to zoom. Consider:
- Only use for app-like experiences
- Ensure font sizes are readable without zoom
- Test with accessibility tools

For better accessibility, allow zoom:
```tsx
viewport: {
  width: "device-width",
  initialScale: 1,
  // No maximumScale - allows zoom
},
```

---

**Conclusion**: The viewport meta tag is now properly configured, enabling Tailwind breakpoints to work correctly across all devices. The sidebar now behaves as intended: persistent on desktop, toggleable on mobile.
