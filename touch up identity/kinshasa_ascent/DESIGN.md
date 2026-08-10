---
name: Kinshasa Ascent
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777e'
  outline-variant: '#c5c6cd'
  surface-tint: '#515f78'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0d1c32'
  on-primary-container: '#76849f'
  inverse-primary: '#b9c7e4'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1c'
  on-tertiary-container: '#838484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b9c7e4'
  on-primary-fixed: '#0d1c32'
  on-primary-fixed-variant: '#39475f'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is built on the philosophy of "L'identité avant la réussite" (Identity before success). It balances the gravity of self-discovery with the energy of entrepreneurial achievement. The visual style is **Corporate Modern with a Soulful Edge**, blending structured professional layouts with organic, high-contrast accents.

The aesthetic targets young change-makers in Kinshasa, evoking a sense of prestige that is earned through character rather than just status. It utilizes heavy whitespace to suggest clarity of mind, paired with bold typographic statements that command attention and inspire action.

## Colors

The palette is anchored by **Deep Navy (#0A192F)**, representing "Identity"—depth, grounding, and the internal foundation. This is contrasted by **Sunset Gold (#F59E0B)**, representing "Success"—growth, energy, and the outward radiance of one’s purpose.

- **Primary (Deep Navy):** Used for surfaces, heavy headings, and primary brand moments to establish authority and depth.
- **Secondary (Sunset Gold):** Used sparingly for high-impact calls to action, highlights, and status indicators.
- **Neutrals:** A range of cool slates are used for secondary text and borders to maintain a professional, clean environment.
- **Backgrounds:** Primarily off-white or very light slate to ensure the Deep Navy and Gold pop with maximum vibrance.

## Typography

This design system uses a dual-font approach to reflect the theme of identity and precision. 

**Montserrat** is used for all major headlines to provide a bold, geometric, and aspirational feel. It should be set with tighter letter-spacing for large display sizes to create a "premium editorial" look.

**Inter** serves as the primary body face, chosen for its exceptional readability and neutral, professional tone. 

**JetBrains Mono** is introduced as a utility label font. Its monospaced nature adds a technical, modern "builder" aesthetic, used for metadata, dates, and small eyebrow headers to reinforce the idea of the "process" behind success.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a rigid 8px baseline rhythm. 

- **Desktop:** 12-column grid with generous 64px outer margins to create a sense of "prestige" and breathing room. 
- **Mobile:** 4-column grid with 20px margins. 
- **Rhythm:** Vertical spacing should be aggressive. Sections should be separated by large padding blocks (80px - 120px) to allow each "identity" pillar to stand alone.
- **Alignment:** Use a mix of centered typography for inspirational quotes and left-aligned layouts for functional information.

## Elevation & Depth

To maintain a clean and professional look, this design system avoids heavy shadows. Instead, it utilizes **Tonal Layers** and **Soft Ambient Occlusion**.

- **Surface Tiers:** Use subtle shifts in background color (e.g., White to Light Slate) to define sections.
- **Shadows:** When necessary (such as on primary cards or buttons), use very large, highly diffused shadows with a slight Deep Navy tint (#0A192F at 5-8% opacity). 
- **Glassmorphism:** Use sparingly for navigation overlays or modal backdrops—blur radius should be high (20px+) with a 70% opacity white fill to maintain "clarity."

## Shapes

The shape language is **Soft and Disciplined**. Elements use a 0.25rem (4px) base radius. This minimal rounding maintains a sharp, professional "architectural" feel while removing the harshness of raw 90-degree corners. 

Buttons and input fields should strictly adhere to the `rounded-sm` or `rounded-md` scales. Circular shapes are reserved exclusively for avatars or icon containers to create a focal point against the structured grid.

## Components

- **Buttons:** Primary buttons are Deep Navy with white text. Hover states shift to Sunset Gold to symbolize the "spark" of action. Use `label-caps` for button text to maintain a modern, disciplined look.
- **Cards:** Use white backgrounds with 1px light slate borders. On hover, apply the soft navy-tinted shadow and a subtle gold top-border (2px) to indicate "growth."
- **Input Fields:** Minimalist design with only a bottom-border or a very light 4-sided border. Focus states transition the border color to Deep Navy.
- **Chips/Badges:** Use JetBrains Mono for text. Backgrounds should be low-saturation Navy (10% opacity) with Navy text, except for "Success" states which use Sunset Gold.
- **Progress Indicators:** Linear, thin bars using Sunset Gold to visualize the "Journey of Becoming." 
- **Signature Component (The Quote Block):** Large Montserrat display text, left-aligned, with a vertical Sunset Gold accent line to highlight key event mantras.