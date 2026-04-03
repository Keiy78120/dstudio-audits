---
name: generate-audit
description: Generate a D-Studio audit deck from research data. Creates JSON config + premium HTML deck via generate-audit.mjs (Lightinderm quality). Use when user says "audit", "deck", or "presentation" for a brand.
---

# Generate D-Studio Audit Deck (v2 Premium)

## Repo
`~/Documents/Developer/dstudio/dstudio-audits` (ou le dossier du repo cloné)

## Output quality
Le générateur produit des decks qualité **Lightinderm** :
- Tailwind CDN + design tokens Figma (CSS custom properties)
- Gradient borders via mask-composite (gb-pill, gb-card, gb-accent)
- Double-frame stat cards (glassmorphism)
- Gap analysis avec colonnes green/red
- Opportunity cards avec glass shadows
- Proposition container avec badge overlap + items numérotés
- CTA button avec purple glow
- Particles, scroll progress, nav dots, fade-up animations
- Responsive mobile

## Workflow

### Step 1 — Research
Rechercher des infos sur le client :
- Nom, secteur, année de création
- Métriques clés (CA, employés, followers, produits)
- Site web actuel (stack, problèmes UX, gaps SEO)
- Concurrents / benchmarks
- Trouver une **hero image** sur Unsplash/Wikimedia liée au secteur
- Télécharger l'image dans `assets/heroes/<slug>.jpg`
- Si possible : screenshot du site client pour le slide benchmark

### Step 2 — Préparer les assets
```
<slug>/assets/
├── <client>-logo.svg    # Logo client (SVG recommandé)
├── hero-product.png     # Image hero produit (optionnel)
├── product-render.png   # Render produit entre proposition et CTA (optionnel)
├── screenshot.png       # Screenshot site pour benchmark (optionnel)
```

### Step 3 — Créer le JSON
Créer `audits/<slug>.json` en se basant sur `audits/_template.json` :

```json
{
  "slug": "client-name",
  "client": "Client Name",
  "date": "Avril 2026",
  "lang": "fr",
  "clientLogo": "assets/client-logo.svg",
  "clientColor": "rgba(74,222,128,0.6)",
  "heroImage": "../assets/heroes/client-name.jpg",
  "productRender": "assets/product-render.png",
  "benchmarkImage": "assets/screenshot.png",
  "slides": [...]
}
```

### Step 4 — Générer
```bash
cd ~/Documents/Developer/dstudio/dstudio-audits
node generate-audit.mjs audits/<slug>.json
```

Output : `<slug>/index.html`

### Step 5 — Vérifier
Ouvrir le fichier dans le navigateur et vérifier :
- ✅ Hero avec logo + tabs + titre + image (si fournie)
- ✅ Stat cards double-frame avec count-up animation
- ✅ Gap analysis green/red columns
- ✅ Opportunity cards (glass shadows)
- ✅ Benchmark layout (image + cards) si image fournie
- ✅ Proposition avec badge overlap + items numérotés + durées
- ✅ Product render entre sections (si fourni)
- ✅ CTA avec pricing cards
- ✅ Closing D-Studio avec logo + contact + CTA button
- ✅ Nav dots, scroll progress, particles, fade-up
- ✅ Responsive mobile (375px, 768px)

### Step 6 — Ajouter au dashboard
Ajouter une card dans `index.html` sous la bonne section.

### Step 7 — Déployer
```bash
git add audits/<slug>.json <slug>/ assets/heroes/<slug>.jpg index.html
git commit -m "feat(audit): add <client> audit deck"
git push origin gh-pages
```

## Types de slides

| Type | Description | Rendu |
|------|-------------|-------|
| `hero` | Intro (logo centré, tabs, titre, hero image 175%) | Plein écran |
| `stats` | Chiffres clés (double-frame glass cards, count-up) | Grid 2-4 cols |
| `gap` | Comparaison (green/red columns, gap-items glass) | 2 colonnes |
| `cards` | Opportunity cards (`col`) ou bench cards (`grid-*`) | Flexible |
| `benchmark` | Image screenshot + badge/titre/cards (NEW) | Side-by-side |
| `proposition` | Badge overlap + items numérotés + durées | Container |
| `cta` | Pricing (double-frame cards) | Grid 2 cols |
| `custom` | HTML libre | Libre |

## Ordre recommandé (7-8 slides)
hero → stats → gap → cards (opportunités) → benchmark → proposition → cta

Le closing D-Studio + product render sont auto-ajoutés.

## Highlights HTML dans les textes
- `<strong class='font-bold'>texte</strong>` — bold blanc
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

## Design system reference
- Tokens : `design-system/tokens.css`
- Rules : `~/.claude/rules/audit-deck-design.md`
- Schema : `docs/SCHEMA.md`
