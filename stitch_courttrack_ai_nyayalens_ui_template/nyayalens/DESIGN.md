---
name: NyayaLens
colors:
  surface: '#fbf9fa'
  surface-dim: '#dbd9db'
  surface-bright: '#fbf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f4'
  surface-container: '#efedef'
  surface-container-high: '#e9e7e9'
  surface-container-highest: '#e4e2e3'
  on-surface: '#1b1c1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#303032'
  inverse-on-surface: '#f2f0f2'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4f6073'
  primary: '#041627'
  on-primary: '#ffffff'
  primary-container: '#1a2b3c'
  on-primary-container: '#8192a7'
  inverse-primary: '#b7c8de'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#1e1300'
  on-tertiary: '#ffffff'
  tertiary-container: '#372700'
  on-tertiary-container: '#b88900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4fb'
  primary-fixed-dim: '#b7c8de'
  on-primary-fixed: '#0b1d2d'
  on-primary-fixed-variant: '#38485a'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#f8bd2a'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#fbf9fa'
  on-background: '#1b1c1d'
  surface-variant: '#e4e2e3'
typography:
  display-serif:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-serif:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  summary-body:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  data-header:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.5'
  data-body:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin: 48px
---

## Brand & Style

This design system is built on the pillars of **Authority, Precision, and Clarity**. It is a professional-grade environment tailored for legal practitioners and government officials who require a high-density information environment that remains cognitively accessible. 

The aesthetic follows a **Modern Corporate Minimalism** approach. It avoids the "playful" trends of consumer SaaS in favor of a rigid, structured interface that commands respect. The UI prioritizes content over container, using subtle depth to define functional areas without distracting from the data. The atmosphere is one of a "digital courtroom"—quiet, organized, and focused.

- **Target Audience:** Lawyers, judges, legal researchers, and policy makers.
- **Emotional Response:** Trustworthy, objective, efficient, and serious.
- **Key Principles:** Information hierarchy, human-centered AI transparency, and zero-clutter layouts.

## Colors

The palette is anchored by **Deep Navy (#1A2B3C)**, used to establish immediate institutional authority. This is contrasted against a **Crisp White (#FFFFFF)** canvas to ensure maximum legibility and a sense of "legal paper" clarity.

- **Primary (Navy):** Used for headers, primary navigation, and high-level structural elements.
- **Secondary (White):** The primary background color for documents and data views.
- **Urgent Crimson (#D32F2F):** Reserved strictly for critical alerts, conflicting precedents, or missed deadlines.
- **Focused Amber (#FBC02D):** Used for warnings, highlighted citations, and "Human-in-the-loop" AI suggestions.
- **Neutrals:** A range of cool grays (from #E2E8F0 to #475569) are used for borders and secondary metadata to maintain a clean hierarchy.

## Typography

This design system utilizes a dual-font strategy to differentiate between **Information (Data)** and **Narrative (Legal Content)**.

- **Newsreader (Serif):** Employed for case summaries, legal opinions, and long-form narrative text. It provides the intellectual and traditional feel necessary for legal documents.
- **Inter (Sans-Serif):** Used for the functional UI, data tables, labels, and system-generated metrics. Its neutral, utilitarian nature ensures clarity at small sizes.

Hierarchy is enforced through strict vertical rhythm. All caps should be used sparingly for labels to provide structural "anchors" in high-density views.

## Layout & Spacing

The layout utilizes a **Fixed Grid** model for centralized content (like legal briefs) and a **Fluid Sidebar** model for research tools and navigation. 

- **Grid:** A 12-column system with a 24px gutter.
- **Rhythm:** A 4px baseline grid ensures that all elements—from text lines to button heights—align perfectly, creating a sense of mathematical order.
- **Density:** High density is encouraged for data tables, while "Reading Mode" views for case summaries utilize wide margins (80px+) to focus the user's attention.

## Elevation & Depth

To maintain a "serious" tone, this design system avoids heavy drop shadows and floating elements. Depth is communicated through **Tonal Layers** and **Low-Contrast Outlines**.

1. **Surface Level (0):** The main background (#F8F9FA).
2. **Card Level (1):** Crisp white (#FFFFFF) with a 1px border (#E2E8F0).
3. **Elevated Level (2):** Used for active modals or focused panels. A very soft, 8px blur shadow with 5% opacity, tinted with the primary Navy.

Shadows should never feel "fuzzy" or decorative; they are strictly functional tools to indicate stack order.

## Shapes

The shape language is architectural and sharp. Circular elements are avoided to prevent the UI from looking "soft." 

- **Standard Radius:** 4px for buttons, input fields, and small cards.
- **Large Radius:** 8px for major container sections.
- **Interactive Elements:** Maintain crisp 90-degree corners for structural components like vertical sidebars and header bars.

## Components

### Buttons
Primary buttons use the Deep Navy (#1A2B3C) with white text. Secondary buttons use a 1px Navy border with Navy text. State changes (hover/active) should be subtle shifts in luminosity, not color.

### Input Fields
Fields must have a clear 1px border. The active state is indicated by a Navy border and a subtle inner shadow. Labeling is always persistent; never rely on placeholder text alone.

### Data Tables
Tables are the heart of the system. Use "Zebra-striping" with a very light gray (#F1F5F9). Headers are Inter Bold, 12px, All-caps. Row height should be compact (32px-40px) for maximum data visibility.

### AI Intelligence Chips
A specialized component for "Human-Centered AI" clarity. These use the Focused Amber (#FBC02D) for "Confidence Scores" or "Suggested Citations." They must always be accompanied by an info icon that explains the AI's reasoning on hover.

### Legal Brief Cards
Cards containing Newsreader (Serif) summaries. They feature a left-accent border (4px) in Navy to denote "Official Record" status.