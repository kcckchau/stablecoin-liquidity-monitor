# Layout Structure

This document explains the app shell layout implementation (TASK 3).

## Overview

The app shell provides the foundational layout structure for the entire application, including:
- Fixed left sidebar navigation
- Main content area with header
- Responsive mobile behavior
- Reusable layout primitives

## Components

### AppShell (`src/components/layout/app-shell.tsx`)

The main layout wrapper that provides the application structure.

Features:
- Wraps the entire application
- Includes the Sidebar component
- Offsets main content area by sidebar width (desktop)
- Sets up the overall page structure

Usage:
```tsx
// Applied in src/app/layout.tsx
<AppShell>
  {children}
</AppShell>
```

### Sidebar (`src/components/layout/sidebar.tsx`)

Fixed left navigation sidebar with mobile support.

Features:
- Fixed position on desktop (256px wide)
- Collapsible on mobile with overlay
- Mobile toggle button
- Active route highlighting
- Brand/logo area
- Version footer

Navigation items:
- Overview (Dashboard)
- Liquidity
- Stablecoins
- Signals

Responsive behavior:
- Desktop (lg+): Fixed sidebar, always visible
- Mobile: Hidden by default, slides in when toggled

### Header (`src/components/layout/header.tsx`)

Page header component for dashboard sections.

Features:
- Page title and subtitle
- Optional action controls
- Last updated timestamp
- Responsive layout (title on left, controls on right)

Props:
- `title`: Page title (required)
- `subtitle`: Page description (optional)
- `actions`: React node for controls (optional)
- `lastUpdated`: Timestamp string (optional)

### Container (`src/components/layout/container.tsx`)

Main content container for consistent width and padding.

Features:
- Max width: 1600px
- Responsive horizontal padding
- Centers content

### Section (`src/components/layout/section.tsx`)

Content section wrapper for consistent spacing.

Features:
- Vertical spacing between sections
- Optional section title and description
- Consistent gap between section header and content

Props:
- `title`: Section heading (optional)
- `description`: Section description (optional)
- `className`: Additional classes (optional)

## Layout Hierarchy

```
<html>
  <body>
    <AppShell>
      <Sidebar />
      <main>
        <Header />
        <Container>
          <Section>
            {/* Page content */}
          </Section>
        </Container>
      </main>
    </AppShell>
  </body>
</html>
```

## Page Structure

Each page should follow this pattern:

```tsx
import { Header, Container, Section } from "@/components/layout";

export default function PageName() {
  return (
    <>
      <Header
        title="Page Title"
        subtitle="Page description"
        lastUpdated="2 hours ago"
      />

      <Container className="py-xl space-y-xl">
        <Section title="Section Name">
          {/* Content */}
        </Section>
      </Container>
    </>
  );
}
```

## Responsive Breakpoints

Using Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px (sidebar switches to fixed)
- `xl`: 1280px
- `2xl`: 1536px

## Spacing

Following the 4px base spacing system from design tokens:
- Section spacing: `space-y-xl` (32px)
- Container padding: `px-lg` (24px)
- Card padding: `p-lg` or `p-xl`

## Theme Integration

All layout components use semantic theme tokens:
- `bg-background`: App background
- `bg-surface`: Sidebar and header background
- `border-border`: Standard borders
- `text-foreground`: Primary text
- `text-foreground-muted`: Secondary text

## Mobile Behavior

### Sidebar
- Hidden by default on mobile
- Toggle button fixed in top-left
- Slides in from left when opened
- Backdrop overlay when open
- Closes on navigation or backdrop click

### Header
- Title and subtitle stack on very small screens
- Last updated timestamp hidden on mobile
- Actions remain visible (if critical)

### Container
- Reduces horizontal padding on mobile
- Maintains consistent max-width

## Future Enhancements

Potential additions (not part of TASK 3):
- Breadcrumb navigation
- Global search
- User menu
- Notifications
- Theme switcher
- Settings panel

## Notes

- Dashboard content sections are NOT implemented (TASK 4)
- Layout components are composition-based and reusable
- No business logic in layout components
- All pages use the same AppShell structure
- Placeholder pages created for all navigation items
