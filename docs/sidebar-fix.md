# Sidebar Desktop/Mobile Fix

**Date**: 2026-03-13  
**Status**: ✅ Fixed

## Problem

The sidebar was behaving like a mobile overlay even on desktop screens. The component had a transition animation and state-based positioning that applied to all screen sizes.

## Root Cause

The previous implementation applied the mobile behavior (slide-in animation, state-based visibility) to all screen sizes:

```tsx
// ❌ Previous (broken)
<aside
  className={`
    fixed top-0 left-0 h-screen w-64 bg-surface border-r border-border z-40
    transition-transform duration-200 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
```

**Issues:**
1. `transition-transform` applied to all screen sizes
2. State-based transform `${isOpen ? ... : "-translate-x-full"}` applied to all sizes
3. `lg:translate-x-0` tried to override but transition still animated

## Solution

Separate mobile and desktop behaviors explicitly:

```tsx
// ✅ Fixed
<aside
  className={`
    fixed top-0 left-0 h-screen w-64 bg-surface border-r border-border
    lg:z-10 z-50
    lg:translate-x-0
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:transition-none transition-transform duration-200 ease-in-out
  `}
>
```

**Key Changes:**

1. **Responsive z-index**
   - Desktop: `lg:z-10` (lower, part of layout)
   - Mobile: `z-50` (higher, overlay behavior)

2. **Transform order**
   - `lg:translate-x-0` placed before mobile conditional
   - Ensures desktop always shows sidebar

3. **Disable transition on desktop**
   - Added `lg:transition-none`
   - Desktop sidebar has no animation
   - Mobile retains smooth slide-in

## Behavior Breakdown

### Desktop (lg breakpoint and above)
```
lg:translate-x-0     → Always visible, no transform
lg:transition-none   → No animation
lg:z-10             → Lower z-index (part of layout)
```

**Result**: Permanently visible, static sidebar

### Mobile (below lg breakpoint)
```
${isOpen ? "translate-x-0" : "-translate-x-full"}
transition-transform duration-200 ease-in-out
z-50
```

**Result**: Hidden by default, slides in when toggle clicked, overlays content

## Component Structure

```tsx
<>
  {/* Mobile overlay - lg:hidden ensures desktop doesn't show it */}
  {isOpen && <div className="... lg:hidden" />}

  {/* Mobile toggle - lg:hidden ensures desktop doesn't show it */}
  <button className="... lg:hidden" />

  {/* Sidebar - responsive behavior based on screen size */}
  <aside className="...">
    {/* Sidebar content */}
  </aside>
</>
```

## Testing Checklist

- ✅ Desktop: Sidebar permanently visible, no animation
- ✅ Desktop: No mobile toggle button visible
- ✅ Desktop: No overlay visible
- ✅ Desktop: Content area offset by 256px (`lg:pl-64`)
- ✅ Mobile: Sidebar hidden by default
- ✅ Mobile: Toggle button visible
- ✅ Mobile: Sidebar slides in smoothly when opened
- ✅ Mobile: Overlay appears when sidebar open
- ✅ Mobile: Clicking overlay closes sidebar
- ✅ Mobile: Clicking nav link closes sidebar

## AppShell Integration

The `AppShell` component correctly handles the content offset:

```tsx
<main className="lg:pl-64 min-h-screen">
  {children}
</main>
```

- Desktop: Content offset by 256px to accommodate fixed sidebar
- Mobile: Content takes full width

## CSS Specificity Order

Tailwind processes classes left-to-right, with responsive variants overriding base classes.

**Correct order for this pattern:**
```
lg:translate-x-0              ← Desktop override first
${conditional}                ← Mobile conditional
lg:transition-none transition ← Desktop removes, mobile keeps
```

This ensures desktop behavior takes precedence on large screens.

---

**Conclusion**: The sidebar now correctly behaves as a fixed navigation on desktop and a slide-in overlay on mobile, matching standard app shell patterns and the architecture requirements.
