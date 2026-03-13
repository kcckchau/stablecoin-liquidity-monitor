# Design Tokens

This document defines the visual design tokens used across the Stablecoin Liquidity Monitor dashboard.

These tokens ensure visual consistency and prevent ad-hoc styling decisions.

All UI components should follow these tokens.

---

# Color System

Dark-first design.

The dashboard should feel analytical, calm, and institutional.

Avoid flashy gradients and crypto neon colors.

## Background Layers

App Background  
very dark neutral

Card Surface  
slightly lighter neutral

Muted Surface  
used for nested panels or secondary containers

Border  
low contrast gray

---

## Text Colors

Primary Text  
near-white

Secondary Text  
muted gray

Subtle Text  
used for metadata and labels

---

## Semantic Colors

Positive  
used for improving metrics  
muted green

Negative  
used for declining metrics  
muted red

Warning  
used for caution signals  
amber

Accent  
used for highlights or active elements  
cool blue

Accent colors should be used sparingly.

---

# Spacing Scale

Use a **4px base spacing system**.

Spacing tokens:

| Token | Size |
|------|------|
xs | 4px
sm | 8px
md | 16px
lg | 24px
xl | 32px
2xl | 48px

---

## Layout Spacing Rules

Section spacing  
32px

Card padding  
16–20px

Grid gap  
16–24px

Avoid overly tight layouts.

Charts should have enough breathing room.

---

# Typography

The dashboard should prioritize clarity and data readability.

## Hierarchy

Page Title  
large, bold

Section Title  
medium weight

Metric Value  
large and prominent

Body Text  
regular weight

Caption / Metadata  
small and muted

---

## Typography Rules

Avoid excessive font size variation.

Prefer consistent scale for readability.

Numbers in metric cards should be easy to scan.

---

# Border Radius

Use moderate rounding.

Cards  
rounded-xl

Buttons  
rounded-lg

Panels  
rounded-xl

Avoid overly rounded shapes.

---

# Elevation

Prefer **subtle borders instead of heavy shadows**.

Hierarchy should be created using:

- spacing
- surface contrast
- typography

Avoid large drop shadows.

---

# Component Surface Rules

Cards should use the card surface background.

Nested panels may use muted surfaces.

Tables should use simple borders and minimal decoration.

Charts should sit inside consistent panel containers.

---

# Density Guidelines

The dashboard should feel:

- analytical
- structured
- calm
- premium

Avoid:

- cluttered layouts
- overly empty marketing-style spacing
- decorative elements that distract from data

Data readability should always take priority.

---

# Token Usage Rule

All UI components should reference these tokens.

Avoid introducing new colors, spacing scales, or border styles unless the design tokens are updated.
