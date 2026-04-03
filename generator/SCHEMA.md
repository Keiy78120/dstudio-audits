# Schema JSON — Audit Deck v2 (Premium)

## Root

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `slug` | string | oui | Identifiant URL (kebab-case) |
| `client` | string | oui | Nom du client affiché |
| `date` | string | oui | Date affichée (ex: "Avril 2026") |
| `lang` | string | non | Langue HTML (défaut: "fr") |
| `clientLogo` | string | non | Chemin/URL logo client (SVG recommandé, affiché dans hero) |
| `clientColor` | string | non | Couleur CSS pour accents (ex: `rgba(74,222,128,0.6)`) |
| `heroImage` | string | non | Image hero produit (175% height, fade overlay) |
| `productRender` | string | non | Image produit entre proposition et CTA (avec fade) |
| `benchmarkImage` | string | non | Screenshot site pour slide benchmark (fallback global) |
| `slides` | array | oui | Liste des slides |

## Slide types

### `hero` — Slide d'intro (plein écran)

Logo client centré, nav tabs, titre + subtitle, hero image en background.

```json
{
  "type": "hero",
  "title": "Titre principal<br>sur deux lignes.",
  "body": "Accroche percutante.",
  "tags": ["Tag 1", "Tag 2"]
}
```

### `stats` — Chiffres clés (double-frame cards)

Cards glassmorphism avec outer glow + inner gradient.

```json
{
  "type": "stats",
  "label": "En chiffres",
  "title": "Le potentiel est là.",
  "stats": [
    { "value": "50", "label": "Brevets" },
    { "value": "52k", "label": "Instagram" }
  ]
}
```

Les valeurs numériques sont animées (count-up au scroll).

### `gap` — Analyse comparative (deux colonnes)

Colonnes green/red avec gradient backgrounds et gap-items glass.

```json
{
  "type": "gap",
  "label": "Le gap",
  "title": "Ce qui existe vs ce qui devrait exister.",
  "columns": [
    {
      "title": "BENCHMARK",
      "type": "good",
      "items": ["<strong class='font-bold'>Point fort</strong> avec détails"]
    },
    {
      "title": "CLIENT",
      "type": "bad",
      "items": ["Point faible — <strong class='font-bold'>conséquence</strong>"]
    }
  ]
}
```

### `cards` — Grille de cartes

Deux variantes selon `grid` :
- `"col"` → Opportunity cards (centrés, glass shadows, full-width max 819px)
- `"grid-2"` / `"grid-3"` → Bench cards (compacts, alignés gauche)

```json
{
  "type": "cards",
  "label": "Opportunités",
  "title": "3 axes.",
  "grid": "col",
  "cards": [
    { "title": "Titre", "body": "Description." }
  ]
}
```

### `benchmark` — Layout image + cartes (NOUVEAU)

Image screenshot à gauche, badge + titre + cartes à droite.

```json
{
  "type": "benchmark",
  "label": "Benchmark & GEO",
  "title": "Où se positionner.",
  "image": "assets/screenshot.png",
  "cards": [
    { "title": "GEO", "body": "Description." },
    { "title": "Benchmark : Concurrent", "body": "Description." }
  ]
}
```

L'image a un cadre avec gradient border (mask-composite). Hidden sur mobile.

### `proposition` — Liste numérotée avec durées

Badge overlapping le container, items numérotés (01, 02...) avec icônes glass.

```json
{
  "type": "proposition",
  "label": "Notre proposition",
  "title": "4 chantiers.",
  "items": [
    { "title": "Chantier", "body": "Description", "duration": "3-6 sem" }
  ]
}
```

### `cta` — Pricing / offres (double-frame cards)

Mêmes stat-card-outer/inner que les stats, avec prix en gros.

```json
{
  "type": "cta",
  "label": "Pour démarrer",
  "title": "Un audit.<br>X semaines.",
  "offers": [
    { "title": "Audit complet", "price": "5-8k€", "details": "Durée · Livrables" }
  ]
}
```

### `custom` — HTML libre

```json
{
  "type": "custom",
  "label": "Section",
  "title": "Titre.",
  "html": "<div>...</div>"
}
```

## Slide auto-ajouté

Un slide **Closing D-Studio** est automatiquement ajouté (logo SVG, contact, CTA button).

Si `productRender` est défini, une image produit avec fade est insérée entre proposition et CTA.

## HTML dans les textes

Les champs `body`, `items`, `title` acceptent du HTML inline :
- `<strong class='font-bold'>texte</strong>` — highlight bold
- `<span class='font-medium text-[#ab5c5c]'>texte</span>` — highlight rouge
- `<br>` — retour à la ligne

## Couleurs accent par secteur

| Secteur | clientColor |
|---------|-------------|
| Tech/MedTech | `rgba(74,222,128,0.6)` (vert) |
| Luxe/Gastronomie | `rgba(212,175,55,0.6)` (or) |
| Aérien/Transport | `rgba(147,197,253,0.6)` (bleu ciel) |
| E-commerce | `rgba(251,191,36,0.6)` (ambre) |
| Automobile | `rgba(147,197,253,0.6)` (bleu) |

## Ordre recommandé (7-8 slides)

hero → stats → gap → cards (opportunités, col) → benchmark → proposition → cta

## Features automatiques

- Tailwind CDN pour layout
- Design tokens Figma (CSS custom properties)
- Gradient borders (gb-pill, gb-card, gb-accent) via mask-composite
- Double-frame stat cards (glassmorphism)
- Scroll snap (desktop), scroll progress bar
- Nav dots (desktop, cliquables)
- Fade-up animations (IntersectionObserver)
- Particle canvas background
- Counter animation (count-up au scroll)
- Product render avec fade entre sections
- Responsive mobile (768px breakpoint)
- D-Studio CTA final avec purple glow button
