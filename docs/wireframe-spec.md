# Dashboard Wireframe Specification

## Page Goal

The dashboard should allow users to understand the current liquidity regime quickly.

Users should understand the macro liquidity condition within a few seconds.

---

# Page Structure

The dashboard should follow this section order:

1. Header
2. Regime Summary Hero
3. Metrics Row
4. Primary Charts
5. Supporting Panels
6. Table (optional)

The regime summary should be the most visually prominent section.

---

# Header

Purpose:
Provide dashboard identity and basic controls.

Contents:
- page title
- subtitle
- last updated timestamp
- optional timeframe selector

Layout:
single horizontal row

---

# Regime Summary Hero

Purpose:
Clearly communicate the current liquidity regime.

Content:
- regime label
- regime score
- short explanation
- supporting bullet points

Example:

Current Regime: Risk-On

Liquidity conditions improving as stablecoin supply expands.

Supporting signals:
- stablecoin supply increasing
- RRP draining
- TGA stable

This section should appear as a wide hero panel.

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
- 7D Supply Change
- Net Exchange Flow
- Liquidity Score

Each card should contain:
- title
- value
- change indicator

---

# Primary Charts

Purpose:
Show the main liquidity trends.

Only **two primary charts** should be displayed.

Suggested charts:
- Stablecoin Supply Trend
- Macro Liquidity Trend

Layout:
side-by-side on desktop

Charts should be large and easy to read.

---

# Supporting Panels

Purpose:
Provide additional context signals.

Display **2–4 supporting panels**.

Examples:
- Signal summary
- RRP trend
- TGA trend
- Stablecoin breakdown

Supporting panels should not dominate the layout.

---

# Table (Optional)

Purpose:
Provide detailed supporting data.

Example:
- stablecoin breakdown
- supply distribution
- recent changes

The table should appear near the bottom of the dashboard.

---

# Layout Principles

The dashboard should feel:

- analytical
- structured
- calm
- professional

Avoid cluttered layouts and excessive visual decoration.

Hierarchy should be created using:

- spacing
- typography
- surface contrast

Design tokens from `design-tokens.md` must be used.
