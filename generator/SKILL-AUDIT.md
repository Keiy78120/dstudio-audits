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
- Gradient borders via mask-composite (gb-pill, gb-card, gb-accent) — JAMAIS border:solid
- Double-frame stat cards (glassmorphism)
- Gap analysis avec colonnes green/red (pill items)
- Opportunity cards avec glass shadows (recommandations uniquement)
- Proposition container avec badge overlap + items numérotés
- Slides auto-adaptifs (`height: auto`) sauf hero (`100vh`)
- Responsive mobile avec spacing `12vh`, pseudo-elements radius synchronisés
- Particles, scroll progress, nav dots, fade-up animations

## Component Mapping (CRITIQUE — pas de répétitions)

Chaque section utilise LE BON composant :

| Section | Composant | Pourquoi |
|---------|-----------|----------|
| Chiffres clés | `stat-card` (double-frame) | Count-up, grid 2-4 cols |
| Analyse / Problèmes | `gap-card-green/red` + `gap-item` pills | Comparaison 2 colonnes (forces vs faiblesses) |
| Recommandations | `opp-card` (glass shadow) | 1 card par axe, titre + description détaillée |
| Benchmark | `bench-card` + image frame | Compact, image gauche + cards droite |
| Proposition | `prop-item` (numéroté + durée) | Items dans prop-container avec badge overlap |
| Pricing | `stat-card` variant pricing | Double-frame, prix en gros |

**NE PAS** utiliser `opp-card` pour des problèmes → utiliser `gap-cards`.
**NE PAS** utiliser `gap-cards` pour des recommandations → utiliser `opp-card`.
**NE PAS** dupliquer le même composant entre 2 sections adjacentes.

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
  "heroImage": "assets/hero-product.png",
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
- ✅ Hero avec logo + tabs + titre + image (100vh, overflow hidden)
- ✅ Stat cards double-frame avec count-up animation
- ✅ Gap analysis green/red columns avec gap-item pills
- ✅ Opp-cards pour les recommandations (pas pour les problèmes)
- ✅ Benchmark layout (image + bench-cards) si image fournie
- ✅ Proposition avec badge overlap + items numérotés + durées
- ✅ Product render entre sections (si fourni)
- ✅ Closing D-Studio avec logo + contact + CTA button
- ✅ Nav dots, scroll progress, particles, fade-up
- ✅ Pas de point final dans les titres h2
- ✅ Responsive mobile : sections espacées (12vh), border-radius + pseudo-elements synchronisés
- ✅ Hero image visible en mobile (slide garde 100vh)

### Step 6 — Ajouter au dashboard
Ajouter une card dans `index.html` sous la bonne section.

### Step 7 — Déployer
```bash
git add audits/<slug>.json <slug>/ assets/heroes/<slug>.jpg index.html
git commit -m "feat(audit): add <client> audit deck"
git push origin gh-pages
```

## Types de slides

| Type | Description | Composant |
|------|-------------|-----------|
| `hero` | Intro (logo centré, tabs, titre, hero image 175%) | `.slide-hero` (100vh) |
| `stats` | Chiffres clés (double-frame glass cards, count-up) | `stat-card-outer/inner` |
| `gap` | Comparaison forces/faiblesses (colonnes green/red) | `gap-card-green/red` + `gap-item` pills |
| `cards` | Recommandations (`col` → opp-card) ou grid (`grid-*` → bench-card) | `opp-card` ou `bench-card` |
| `benchmark` | Image screenshot + badge/titre/cards | `bench-card` + image frame |
| `proposition` | Badge overlap + items numérotés + durées | `prop-container` + `prop-item` |
| `cta` | Pricing (double-frame cards) — optionnel | `stat-card` variant pricing |
| `custom` | HTML libre | Libre |

## Ordre recommandé (11 slides) — TOUS les composants utilisés

| # | Slide | Composant | Badge |
|---|-------|-----------|-------|
| 1 | Hero | `.slide-hero` (100vh) — logo + tab-pills + titre + image 175% | — |
| 2 | Chiffres | `stat-card-outer/inner` (double-frame, count-up) | EN CHIFFRES |
| 3 | Contexte | Paragraphe intro + sous-section "Approche de l'audit" | CONTEXTE |
| 4 | Problématiques | `gap-card-green/red` + `gap-item` pills (2 colonnes) | PROBLÉMATIQUES |
| 5 | Reco 01 | `opp-card` × 3 (titre + sous-titre + description) | RECOMMANDATION 01 |
| 6 | Reco 02 | `opp-card` × 3 | RECOMMANDATION 02 |
| 7 | Reco 03 | `opp-card` × 2 | RECOMMANDATION 03 |
| 8 | Benchmark | `bench-card` × 2 + image frame (screenshot site) | BENCHMARK & GEO |
| 9 | Proposition | `prop-container` + `prop-item` numérotés + `duration-badge` | NOTRE PROPOSITION |
| 10 | Conclusion | Paragraphe de synthèse | CONCLUSION |
| 11 | Closing | Logo D-Studio + contact + `cta-button` (purple glow) | — |

**Product render** auto-inséré entre proposition et conclusion si `productRender` est défini.
**Pricing (cta)** optionnel — ajouter entre conclusion et closing si nécessaire.

### Composants utilisés par deck (checklist)
- [ ] `tab-pill` — hero nav tabs
- [ ] `badge` — labels de section (radius 16px)
- [ ] `stat-card-outer/inner` — chiffres clés (double-frame)
- [ ] `gap-card-green` + `gap-card-red` — analyse comparative
- [ ] `gap-badge` — labels colonnes gap
- [ ] `gap-item` + `gb-card` — items pills dans gap-cards
- [ ] `opp-card` — recommandations détaillées
- [ ] `bench-card` — benchmark / comparaison
- [ ] `prop-container` — container proposition (badge overlap)
- [ ] `prop-item` — items numérotés
- [ ] `prop-icon` + `number-gradient` — numéros proposition
- [ ] `duration-badge` — durées proposition
- [ ] `cta-button` + `gb-pill` — CTA closing

## Highlights HTML dans les textes
- `<strong class='font-bold'>texte</strong>` — bold blanc
- `<span class='font-medium text-[#ab5c5c]'>texte</span>` — highlight rouge (colonne bad)
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
- Tokens : `generator/tokens.css`
- Rules : `~/.claude/rules/audit-deck-design.md`
- Schema : `generator/SCHEMA.md`
- Generator : `generator/generate.mjs`
