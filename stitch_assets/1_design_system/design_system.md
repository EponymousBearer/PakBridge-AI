---
name: PakBridge AI Design System
colors:
  surface: '#0f131f'
  surface-dim: '#0f131f'
  surface-bright: '#353946'
  surface-container-lowest: '#0a0e1a'
  surface-container-low: '#171b28'
  surface-container: '#1b1f2c'
  surface-container-high: '#262a37'
  surface-container-highest: '#313442'
  on-surface: '#dfe2f3'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#dfe2f3'
  inverse-on-surface: '#2c303d'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002387'
  primary-container: '#2d5bff'
  on-primary-container: '#efefff'
  inverse-primary: '#104af0'
  secondary: '#ddfcff'
  on-secondary: '#00363a'
  secondary-container: '#00f1fe'
  on-secondary-container: '#006a70'
  tertiary: '#ffb4aa'
  on-tertiary: '#690003'
  tertiary-container: '#d71a18'
  on-tertiary-container: '#ffece9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001355'
  on-primary-fixed-variant: '#0035bd'
  secondary-fixed: '#74f5ff'
  secondary-fixed-dim: '#00dbe7'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f54'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#930005'
  background: '#0f131f'
  on-background: '#dfe2f3'
  surface-variant: '#313442'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 4px
  stack-md: 12px
  stack-lg: 24px
---

## Brand & Style
This design system is engineered for high-stakes crisis intelligence, blending the structural reliability of Material 3 with a cutting-edge, futuristic aesthetic. The visual narrative centers on **"Calm Authority"**—providing a steady hand through AI-driven insights during volatile situations. 

The style is **Modern Glassmorphism** set against a **Deep Navy** void. It utilizes translucent layers to represent the depth of data, while "Neon Cyan" and "Electric Blue" accents simulate the glow of active neural networks. The interface must feel like a high-end command center: precise, responsive, and unmistakably intelligent. 

Targeting government officials, NGOs, and emergency responders, the UI avoids clutter, favoring high-contrast information density and subtle motion to indicate "agentic" background processing.

## Colors
The palette is dominated by **Deep Navy (#0A0E1A)** to ensure maximum contrast and reduce eye strain during long-form monitoring. 

- **Primary (Electric Blue):** Used for primary actions, active states, and brand presence.
- **Secondary (Neon Cyan):** Reserved for AI-agent signatures, data visualizations, and "active thought" indicators.
- **Severity Tokens:** 
  - **Critical:** A high-vibrancy Emergency Red for immediate life-safety threats.
  - **Warning:** A warm Amber for emerging situations.
  - **Info:** Electric Blue for general updates.
  - **Safe:** A crisp Emerald for resolved or stable zones.

Surface colors should use semi-transparent variants of the neutral palette to allow background blurs to bleed through, creating the "glass" effect.

## Typography
The system uses **Hanken Grotesk** for headlines to provide a sharp, contemporary tech feel, while **Inter** handles all functional and body text for its world-class legibility in high-density data environments.

- **Scale:** Use a strict hierarchical scale. Display sizes are reserved for critical metrics (e.g., "Active Floods: 12").
- **Readability:** Body text uses a slightly increased line-height (1.6x) to ensure clarity during fast-paced reading.
- **Micro-copy:** Labels should be uppercase with slight letter-spacing to distinguish them from interactive elements.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **The 8px Rule:** All spacing between elements must be a multiple of 8px to maintain mathematical harmony.
- **Density:** In "Intelligence Dashboards," use a compact density (8px gutters). In "Briefing Modes," use a relaxed density (24px gutters) to allow the AI narrative to breathe.
- **Safe Areas:** Maintain a minimum 24px outer margin on all mobile views to prevent touch-interference at the edges of glass containers.

## Elevation & Depth
Depth is conveyed through **Glassmorphism and Tonal Layering** rather than traditional heavy shadows.

- **Surface 0 (Background):** Deep Navy (#0A0E1A).
- **Surface 1 (Base Cards):** Semi-transparent Navy (80% opacity) with a 1px inner border (10% White) and a 16px Backdrop Blur.
- **Surface 2 (Floating Modals):** Semi-transparent Navy (90% opacity) with a subtle "Electric Blue" outer glow (0px 4px 20px, 15% opacity).
- **Agentic Layer:** Elements controlled by AI agents should feature a soft "Neon Cyan" breathing animation (pulse) to signify active processing.

## Shapes
The shape language is **Refined & Rounded**. 

- **Cards/Containers:** Use 1rem (16px) corner radius to soften the technical nature of the data.
- **Buttons:** Small buttons use 0.5rem (8px), while primary call-to-action buttons use a full pill-shape (3rem) for maximum visibility and "Google-level" approachability.
- **Form Inputs:** Use a 0.5rem (8px) radius to maintain a structural, professional feel.

## Components
- **Glass Cards:** The signature container. Features a 1px "Light Leak" stroke on the top and left edges to simulate light hitting glass.
- **Glowing Status Pills:** Small indicators for severity. They should include a CSS `box-shadow: 0 0 8px [color]` to create a luminous effect that feels like a physical LED.
- **Workflow Indicators:** Horizontal steps connected by "Electric Blue" lines. Active steps should have a "Neon Cyan" glow.
- **Primary Buttons:** High-contrast Electric Blue backgrounds with White text. Hover states should introduce a "Neon Cyan" outer glow.
- **Input Fields:** Darker than the card background with a 1px border that turns "Electric Blue" on focus. 
- **AI Chat/Agent Bubbles:** Distinguished by a subtle gradient background (Electric Blue to Deep Navy) to separate AI logic from user input.