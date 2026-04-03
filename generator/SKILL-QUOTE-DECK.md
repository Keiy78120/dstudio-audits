# Generate Quote Deck from Figma

Generate or update a D-Studio audit/quote deck HTML page from Figma designs.

## Trigger
User says "generate quote deck", "generate audit", "nouveau deck", or provides a Figma Quotes URL.

## Design Token System (DENNY)

### Colors
```css
:root {
  --bg-primary: #000000;
  --bg-card: #141415;                        /* card-12 token */
  --bg-card-glass: rgba(24,24,26,0.58);      /* GLAS-DS-INNE */
  --bg-card-muted: rgba(28,28,30,0.43);
  --bg-elevated: #202020;
  --text-primary: #FFFFFF;
  --text-heading: #EFEFEF;
  --text-heading-alt: #E6E6F1;
  --text-secondary: #C7C7CC;
  --text-muted: #A3A3AE;
  --text-nav: #E5E5E5;                       /* SELCT-DSR */
  --radius-pill: 40px;
  --radius-card: 33px;
  --radius-inner: 21px;
  --radius-badge: 16px;
  --radius-tag: 14px;
}
```

### ZERO SOLID BORDERS — ABSOLUTE RULE
DENNY never uses `border: solid`. ALL borders are gradient borders via mask-composite.

### Gradient Border Variants

| Token | Gradient | Usage |
|-------|----------|-------|
| **FRAME-GRA** | `180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%` | Container outer frames (prop-container, gap-cards, stat-cards) |
| **gb-pill** | `157deg, rgba(255,255,255,0.40) 2.12%, rgba(255,255,255,0) 39%, rgba(255,255,255,0) 54.33%, rgba(255,255,255,0.10) 93.02%` | Pills (badges, tabs, gap-badges, duration-badge, CTA) |
| **gb-card** | `159deg, rgba(255,255,255,0.05) 1.69%, rgba(255,255,255,0.50) 37.46%, rgba(255,255,255,0.01) 88.2%` | Cards inner (prop-item, gap-item, opp-card, bench-card) |
| **gb-accent** | `152deg, rgba(255,255,255,0.65) 32.68%, rgba(255,255,255,0) 98.12%` | Accent elements (prop-icon, number text) |

### Implementation Pattern
```css
.component { border: none; position: relative; }
.component::before {
  content: ''; position: absolute; inset: 0;
  border-radius: inherit; padding: 1px;
  background: /* gradient from table above */;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
```

## Component Library

### Badge / Tab-Pill / Gap-Badge (all same size)
- `padding: 9px 18px`, `font-size: 15px`, `line-height: 20px`, `border-radius: 40px`
- Background: `#141415`
- Border: gb-pill gradient
- Mobile: `padding: 7px 14px`, `font-size: 13px`

### Stat Card (double-frame)
- Outer: `border-radius: 33px`, `padding: 12px`, glass bg + FRAME-GRA border
- Inner: `border-radius: 21px`, dark gradient bg
- Equal height across all cards (use grid)
- Mobile: 2x2 grid, outer `24px`, inner `18px`

### Gap Card (green/red columns)
- FRAME-GRA border (top-fade)
- `flex-1` + `items-stretch` for equal height
- Gap-badge overlaps top border (`margin-bottom: -16px`, `z-index: 10`)

### Opportunity Card
- Glass bg + inner shadow
- gb-card border

### Proposition Container
- FRAME-GRA border (top-fade)
- Badge overlaps top border (outside container, `margin-bottom: -20px`)
- Title + items inside container
- `padding: 60px 40px 20px`

### Proposition Item
- gb-card border (159deg bright mid-stroke)
- Icon (56x56) with GLASS-DENNY shadow
- Number with gb-accent text gradient
- Duration badge absolute top-right

### Pricing Card (reuses stat-card)
- Same as stat card with `padding: 21px 65px` inner

### CTA Button
- gb-pill gradient border
- Purple glow shadows
- `border-radius: 40px`

## Layout Rules

### Figma → Browser Scale
Figma = 1920px, browser viewport = ~1440px. Ratio ≈ 0.75.
- Titles: 60px → 42-48px
- Body text: 20px → 15-16px
- Stats: 60px → 38px
- Spacing: scale by ~75%

### Badge Positioning
Badges that label a container STRADDLE its top border (half in, half out).
```html
<div style="position:relative; z-index:2; margin-bottom:-20px;">
  <div class="badge">LABEL</div>
</div>
<div class="container">...</div>
```

### Product Images Between Sections
- `margin-top: negative` to overlap previous section
- Fade overlay bottom: `linear-gradient(to top, #000, transparent)`
- Mobile: hide or reduce to 60%

### Border Radius Proportionality
When scaling components, `inner-radius = outer-radius - padding - 2px`.
Pseudo-elements MUST also receive updated border-radius.

## Responsive (768px)
1. Grid 4→2 columns (`grid-cols-2 md:grid-cols-4`)
2. Decorative images → `display: none`
3. Side-by-side → vertical stack
4. Scroll snap: `proximity` desktop, `none` mobile
5. Font: -25%, Padding: -30%
6. Test 375px + 390px

## Workflow
1. User provides Figma URL or client brief
2. Fetch design context via `get_design_context` for each section
3. **CRITICAL**: Compare Figma screenshot vs Figma code export — borders in export are WRONG (flattened to solid)
4. Build HTML using the components above
5. Apply correct gradient borders from the token table
6. Test responsive at 768px and 375px
7. Deploy to gh-pages
