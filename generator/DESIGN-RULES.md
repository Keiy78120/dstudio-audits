# Audit Deck Design System Rules (DENNY Designer)

## ZERO SOLID BORDERS (ABSOLUTE RULE)

Le designer D-Studio (DENNY) ne met JAMAIS de `border: solid` — TOUJOURS `background: linear-gradient` via mask-composite.
**Avant d'écrire `border:` dans un composant audit, STOP et utiliser le pattern gradient border.**
**Si le gradient exact n'est pas connu, DEMANDER à Kevin ou fetcher depuis Figma MCP avant d'improviser.**

### EXCEPTION : Badges section title
Les badges (labels de section comme "CONTEXTE", "PROBLÉMATIQUES", "RECOMMANDATIONS") utilisent un `border: solid` :
```css
.badge {
  border-radius: 16px; /* --radius-badge, PAS --radius-pill (40px) */
  border: 1px solid rgba(255,255,255,0.40); /* FRAME-GRA solid, pas gradient */
  background: #141415; /* --bg-card */
}
```
Les nav tabs (hero) gardent `border-radius: 40px` + gradient border via mask-composite.

## Gradient Borders — Figma Token Mapping

DENNY utilise des tokens nommés dans Figma. Chaque composant a sa propre variante de gradient border. Ne JAMAIS deviner — toujours vérifier dans Figma.

### FRAME-GRA — Containers outer (prop-container, gap-card-green/red, stat-card-outer)
Top-fade vertical, subtil :
```css
background: linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%);
```

### gb-pill (157deg) — Pills (badges, tabs, gap-badges, duration-badge, CTA)
Diagonal subtil, coins lumineux haut-gauche et bas-droite :
```css
background: linear-gradient(157deg, rgba(255,255,255,0.40) 2.12%, rgba(255,255,255,0) 39%, rgba(255,255,255,0) 54.33%, rgba(255,255,255,0.10) 93.02%);
```

### gb-card (159deg) — Cards inner (gap-item, opp-card, bench-card) — NOT prop-item
**prop-item uses FRAME-GRA (subtle top-fade), not gb-card.**
Diagonal avec stroke brillant au milieu :
```css
background: linear-gradient(159deg, rgba(255,255,255,0.05) 1.69%, rgba(255,255,255,0.50) 37.46%, rgba(255,255,255,0.01) 88.2%);
```

### gb-accent (152deg) — Accent (prop-icon number text, icon frames)
Forte luminosité haut-gauche, fade vers bas-droite :
```css
background: linear-gradient(152deg, rgba(255,255,255,0.65) 32.68%, rgba(255,255,255,0) 98.12%);
```

### Implementation (mask-composite)
```css
.component { border: none; position: relative; }
.component::before {
  content: ''; position: absolute; inset: 0;
  border-radius: inherit; padding: 1px;
  background: /* variant from above */;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
```

### Exception
Images avec cadre photo physique (benchmark product-usage) : `border: solid` autorisé.

## Proactive Gradient Fetching (CRITICAL)

Quand un nouveau composant Figma est implémenté :
1. TOUJOURS vérifier les "Couleurs des bordures" dans l'inspecteur Figma
2. Si c'est "Lineaire dégradé" → c'est un gradient border, pas solid
3. Les valeurs exportées par Figma-to-code (ex: `border: rgba(255,255,255,0.4)`) sont FAUSSES — Figma flatten les gradients en solid dans l'export
4. **Rappeler à Kevin** de fournir les gradient values si elles ne sont pas visibles dans le MCP export
5. Fetcher via `get_design_context` ET inspecter le screenshot pour valider visuellement

## Badge Positioning on Containers

Le badge chevauche le bord supérieur du container (mi-dedans, mi-dehors) :
```html
<!-- Badge overlapping container border -->
<div style="position:relative; z-index:2; margin-bottom:-20px;">
  <div class="badge">LABEL</div>
</div>
<div class="container">
  <!-- content -->
</div>
```
Le badge n'est PAS positionné à l'intérieur du container avec du padding — il straddle le border.

## Border Radius Proportionality (CRITICAL)

Quand on réduit un composant (responsive), les border-radius outer/inner DOIVENT rester proportionnels.
Règle : `inner-radius = outer-radius - padding - 2px`
Les pseudo-elements (`::before`, `::after`) DOIVENT aussi recevoir le border-radius mis à jour.

- Desktop : outer `33px`, inner `21px`, padding `12px`
- Mobile : outer `24px`, inner `18px`, padding `8px`
- JAMAIS : outer `33px`, inner `14px` → disproportionné

## Component Size Consistency

Tous les pill-shaped components (badges, tabs, gap-badges) = mêmes dimensions :
- Desktop : `padding: 9px 18px`, `font-size: 15px`, `line-height: 20px`, `border-radius: 24px` (--radius-pill)
- Mobile : `padding: 7px 14px`, `font-size: 13px`

## Figma → Browser Scale

Figma 1920px → browser ~1440px. Ratio = 0.75.
- Titres 60px → 42-48px browser
- Textes 20px → 15-16px
- Stats 60px → 38px
- Spacing : ~75%

## Hero Product Image (CRITICAL)

L'image hero produit n'est PAS un simple `object-contain`. Dans Figma :
- Container avec `overflow: hidden` et `flex: 1` (remplit l'espace restant)
- Image positionnée `absolute`, **175% de la hauteur** du container, ~106% largeur
- Fade overlay : `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 50%, #000 100%)` sur les 40% inférieurs
- Le fade évite une coupure nette au bas de la section

```html
<div class="relative overflow-hidden" style="flex:1;">
  <img style="position:absolute; height:175%; left:-3%; top:0; width:106%; max-width:none; object-fit:cover;" />
  <div style="position:absolute; bottom:0; left:0; right:0; height:40%; background:linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 50%, #000 100%); pointer-events:none; z-index:1;"></div>
</div>
```

## Benchmark Screenshot Frame

- L'image screenshot du site doit remplir la frame en `object-cover` sans browser chrome visible
- Frame border : `padding: 8px`, `border-radius: 28px`, gradient border via mask-composite
- Section `overflow: visible` (pas hidden) sinon la frame se coupe quand décalée
- Le badge + titre sont dans la colonne texte à droite, PAS centrés au-dessus

## Product Images Between Sections

Les images produit (render) se placent entre les sections avec :
- `margin-top: negative` pour chevaucher la section précédente
- Fade overlay en bas (`linear-gradient(to top, #000 0%, transparent 100%)`) pour transition douce
- Responsive : `max-w-[80%]` desktop, masquer ou réduire sur mobile

## Responsive Mobile (768px)

1. Grilles 4 colonnes → 2x2 (`grid-cols-2 md:grid-cols-4`)
2. Images décoratives → `display: none` ou max-width 60%
3. Side-by-side → stack vertical (`flex-col`)
4. Scroll snap → `proximity` desktop, `none` mobile
5. Font sizes : -25%, Padding : -30%
6. TESTER sur viewport 375px et 390px

## Design Tokens

```css
:root {
  --bg-primary: #000000;
  --bg-card: #141415;
  --bg-card-glass: rgba(24,24,26,0.58);
  --bg-card-muted: rgba(28,28,30,0.43);
  --text-primary: #FFFFFF;
  --text-heading: #EFEFEF;
  --text-heading-alt: #E6E6F1;
  --text-secondary: #C7C7CC;
  --text-muted: #A3A3AE;
  --text-nav: #E5E5E5;
  --radius-pill: 24px;
  --radius-card: 33px;
  --radius-inner: 21px;
  --radius-badge: 16px;
  --radius-tag: 14px;
}
```

## Figma Token Names (reference)

| Figma Token | CSS Mapping | Usage |
|-------------|-------------|-------|
| FRAME-GRA | gb-pill gradient | Pill border gradient |
| ICON FRAME | gb-accent | Icon container glass |
| ICON-1 | number-gradient | Number text gradient |
| GLAS-DS-INNE | bg-card-glass | Card inner glass bg |
| GLASS-DENNY | prop-icon box-shadow | Icon glass effect |
| BACK-2 | text-shadow | Duration badge shadow |
| menu-back | duration-badge shadow | Menu/tag shadow |
| card-12 | --bg-card (#141415) | Card backgrounds |
| SELCT-DSR | --text-nav (#E5E5E5) | Nav text color |
