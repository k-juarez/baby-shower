---
name: Natalia's Honey Bee Registry
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#514532'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#847560'
  outline-variant: '#d6c4ac'
  surface-tint: '#7e5700'
  primary: '#7e5700'
  on-primary: '#ffffff'
  primary-container: '#ffb300'
  on-primary-container: '#6b4900'
  inverse-primary: '#ffba38'
  secondary: '#636037'
  on-secondary: '#ffffff'
  secondary-container: '#e7e1ae'
  on-secondary-container: '#67643b'
  tertiary: '#5e604d'
  on-tertiary: '#ffffff'
  tertiary-container: '#c2c3ac'
  on-tertiary-container: '#4f503e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdeac'
  primary-fixed-dim: '#ffba38'
  on-primary-fixed: '#281900'
  on-primary-fixed-variant: '#604100'
  secondary-fixed: '#eae4b1'
  secondary-fixed-dim: '#cdc897'
  on-secondary-fixed: '#1e1c00'
  on-secondary-fixed-variant: '#4b4822'
  tertiary-fixed: '#e4e4cc'
  tertiary-fixed-dim: '#c8c8b0'
  on-tertiary-fixed: '#1b1d0e'
  on-tertiary-fixed-variant: '#474836'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-lg:
    fontFamily: Quicksand
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Quicksand
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Quicksand
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style
The design system is centered around the arrival of Natalia, utilizing a "Little Honey Bee" theme that balances playfulness with sophisticated softness. The brand personality is **warm, festive, and deeply grateful**, aimed at family and friends. 

The visual style is a blend of **Soft Minimalism and Tactile Sweetness**. It prioritizes heavy whitespace to ensure the registry feels organized and calm, while using rounded geometries and organic textures to evoke a "tender" emotional response. The interface should feel as inviting as a nursery, avoiding sharp edges or aggressive transitions.

## Colors
The palette is inspired by the soft hues of honey and beeswax. 
- **Primary (Honey/Amber):** Used for call-to-action buttons, active states, and key accents. It provides the necessary "pop" against the lighter tones.
- **Secondary (Pastel Yellow):** Used for large surface areas like headers or featured cards.
- **Tertiary & Background (Beige/Cream):** These form the foundation of the UI, creating a warm, paper-like feel that is easier on the eyes than pure white.
- **Neutral (Soft Grey):** Reserved exclusively for body text and subtle borders to maintain a high level of legibility without the harshness of pure black.

## Typography
The typography strategy uses **Quicksand** for all expressive elements. Its rounded terminals perfectly mirror the "Little Honey Bee" theme. **Open Sans** is utilized for body text to ensure maximum readability for older family members who may be viewing the registry.

- **Titles:** Should be friendly and approachable. Use `display-lg` for the main "Baby Natalia" greeting.
- **Body:** Use `body-md` for item descriptions and "thank you" notes.
- **Hierarchy:** Ensure a clear distinction between item names (Quicksand) and item details (Open Sans).

## Layout & Spacing
The layout follows a **Fluid Grid** model with generous inner margins to emphasize the "clean and airy" requirement. 

- **Desktop:** A 12-column grid with a maximum container width of 1200px. Gift cards should span 3 or 4 columns.
- **Mobile:** A single-column flow with 24px side margins.
- **Spacing Rhythm:** Use a strict 8px base unit. Gift cards should have at least 24px of padding (md) to feel premium and uncrowded. Vertical sections (e.g., between "Baby Clothes" and "Nursery Decor") should use 80px (xl) to create clear mental breaks.

## Elevation & Depth
Depth is achieved through **Tonal Layers** and **Ambient Shadows** rather than harsh outlines.

- **Surface Levels:** The main background is Cream. Interactive cards sit on top of this in white or Very Light Beige.
- **Shadows:** Use extremely soft, diffused shadows with a slight amber tint (`rgba(255, 179, 0, 0.08)`) to make cards appear to "float" gently above the surface. 
- **Patterns:** Subtle, low-opacity honeycomb patterns (using `#F5F5DC`) can be used as background fills for section headers to add texture without clutter.

## Shapes
The shape language is dominated by **Rounded (level 2)** corners. 

- **Cards:** Use `rounded-lg` (1rem/16px) for registry item containers.
- **Buttons:** Use fully pill-shaped (3rem) buttons for "Reservar" (Reserve) to make them feel "squishy" and friendly.
- **Images:** All gift images must have a minimum of 12px border radius to maintain the soft aesthetic. No sharp 90-degree corners are permitted in the UI.

## Components
- **Gift Cards:** Each card features a high-quality photo, the item name in Quicksand, and a clear status label.
- **Status Labels (Chips):** 
    - *Disponible (Available):* Primary Honey background with dark text. 
    - *Reservado (Reserved):* Soft Sage Green background with dark green text, signaling a completed task.
- **Buttons:** Large, pill-shaped buttons. The primary button "Ver Detalle" uses the Honey color, while "Reservar" uses a slightly bolder version for visibility.
- **Progress Bar:** A "Registry Completion" bar styled like a honey-filled tube, using the Primary color for the fill.
- **Input Fields:** Soft beige backgrounds with subtle internal shadows (neomorphic touch) and 12px rounded corners.
- **Honeycomb Iconography:** Custom icons for categories (e.g., a diaper icon inside a hexagon) should be used to reinforce the "Abejitas" theme.