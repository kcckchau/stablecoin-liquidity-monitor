# UI Specification

## Design Personality

Dark theme  
Calm institutional style  
Macro intelligence dashboard

The interface should feel closer to a **macro research terminal** than a crypto trading dashboard.

Avoid:
- crypto neon colors
- glassmorphism
- overly rounded UI
- flashy gradients
- decorative UI elements

Reference style:
- Vercel dashboard
- Linear
- macro research terminals

Visual design should prioritize **data clarity and hierarchy** over visual decoration.

---

# Dashboard Layout

The dashboard should communicate the liquidity regime quickly.

Users should understand the current macro liquidity condition within a few seconds.

Section order should follow this hierarchy:

1. Header
2. Regime Summary Hero
3. Metrics Row
4. Primary Charts
5. Supporting Panels
6. Table (optional)

The table should appear near the bottom and serve as supporting detail.

---

# Header

Purpose:
Provide dashboard identity and simple controls.

Contents:
- page title
- subtitle
- last updated timestamp
- optional timeframe selector
- optional refresh control

Title example:
Stablecoin Liquidity Monitor

Subtitle example:
Track macro liquidity conditions and stablecoin expansion.

Layout:
- title and subtitle on the left
- controls on the right

---

# Regime Summary Hero

This is the most important element on the dashboard.

It should clearly communicate:

- current liquidity regime
- regime score or status
- short explanation
- supporting signals

Example content:

Current Regime: Risk-On  
Liquidity conditions improving as stablecoin supply expands.

Supporting bullets:
- Stablecoin supply increasing
- RRP draining
- TGA pressure stable

This section should be visually more prominent than regular cards.

---

# Metrics Row

Purpose:
Provide quick snapshot metrics.

Layout:
4 cards on desktop  
2x2 on tablet  
stacked on mobile

Suggested metrics:
- Total Stablecoin Supply
- 7D Stablecoin Change
- Net Exchange Flow
- Liquidity Score

Metric cards should include:
- title
- value
- change indicator
- optional subtitle

Values must be easy to scan.

---

# Primary Charts

These are the main analytical visuals.

Only two primary charts should appear.

Suggested charts:
- Stablecoin Supply Trend
- Macro Liquidity Trend

Layout:
Side-by-side on desktop  
Stacked on smaller screens

Charts should be large enough to clearly show trends.

---

# Supporting Panels

These provide additional signals supporting the regime view.

Show between **2 and 4 panels**.

Examples:
- Signal summary
- RRP trend
- TGA trend
- Stablecoin breakdown

Supporting panels should not visually dominate the primary charts.

---

# Table (Optional)

The table provides supporting detail.

Example usage:
- top stablecoins
- supply breakdown
- recent changes

Rules:
- keep column count small
- avoid dense data tables
- maintain simple formatting

---

# Sidebar

The sidebar provides product structure.

Desktop:
fixed left sidebar

Mobile:
collapsible or hidden

Contents may include:
- Overview
- Liquidity
- Stablecoins
- Signals

Sidebar should remain minimal.

---

# Layout Principles

The dashboard should feel:

- analytical
- structured
- calm
- professional

Avoid:

- cluttered layouts
- excessive UI decoration
- overly complex interactions

Hierarchy should be created using:

- spacing
- typography
- surface contrast

Design tokens defined in `design-tokens.md` should be used for all styling.
