---
name: generate-audit
description: Generate a D-Studio audit deck from research data. Creates JSON config + HTML deck via generate-audit.mjs. Use when user says "audit", "deck", or "presentation" for a brand.
---

# Generate D-Studio Audit Deck

## Repo
`~/dstudio-audits` (ou le dossier ou le repo a ete clone)

## Workflow

### Step 1 — Research
Rechercher des infos sur le client :
- Nom, secteur, annee de creation
- Metriques cles (CA, employes, followers, produits)
- Site web actuel (stack, problemes UX, gaps SEO)
- Concurrents / benchmarks
- Trouver une **hero image** sur Unsplash/Wikimedia liee au secteur
- Telecharger l'image dans `assets/heroes/<slug>.jpg`

### Step 2 — Creer le JSON
Creer `audits/<slug>.json` :

```json
{
  "slug": "client-name",
  "client": "Client Name",
  "date": "Mars 2026",
  "lang": "fr",
  "clientLogo": "https://www.google.com/s2/favicons?domain=client.com&sz=128",
  "clientColor": "rgba(R,G,B,0.6)",
  "heroImage": "../assets/heroes/client-name.jpg",
  "slides": [
    {
      "type": "hero",
      "label": "Client Name",
      "title": "Titre<br>percutant.",
      "body": "Accroche en 2-3 lignes.",
      "tags": ["Tag1", "Tag2", "Tag3"]
    },
    {
      "type": "stats",
      "label": "En chiffres",
      "title": "Le potentiel.",
      "grid": "grid-4",
      "stats": [
        { "value": "50k", "label": "Metric 1" },
        { "value": "200", "label": "Metric 2" },
        { "value": "#1", "label": "Metric 3" },
        { "value": "12M", "label": "Metric 4" }
      ]
    },
    {
      "type": "gap",
      "label": "Le gap",
      "title": "Ce qui existe vs ce qui devrait.",
      "columns": [
        {
          "title": "BENCHMARK / LEADER",
          "type": "good",
          "items": [
            "Point fort <strong style='color:#fff;'>highlight</strong>",
            "Autre point fort"
          ]
        },
        {
          "title": "CLIENT AUJOURD'HUI",
          "type": "bad",
          "items": [
            "Point faible <strong style='color:#fff;'>highlight</strong>",
            "<em style='color:rgba(248,113,113,0.7);'>Conclusion frappante</em>"
          ]
        }
      ]
    },
    {
      "type": "cards",
      "label": "Analyse",
      "title": "Constats detailles.",
      "grid": "grid-2",
      "cards": [
        { "title": "Constat 1", "body": "Description.", "highlight": "red" },
        { "title": "Constat 2", "body": "Description.", "highlight": "green" },
        { "title": "Constat 3", "body": "Description." },
        { "title": "Constat 4", "body": "Description." }
      ]
    },
    {
      "type": "proposition",
      "label": "Notre proposition",
      "title": "X chantiers. ROI mesurable.",
      "items": [
        { "title": "Chantier 1", "body": "Description courte", "duration": "3-6 sem" },
        { "title": "Chantier 2", "body": "Description courte", "duration": "4-8 sem" },
        { "title": "Chantier 3", "body": "Description courte", "duration": "Continu" }
      ]
    },
    {
      "type": "cta",
      "label": "Pour demarrer",
      "title": "Un audit.<br>X semaines.<br>Sans engagement.",
      "offers": [
        { "title": "Audit complet", "price": "5-8k", "details": "Duree - Livrables - ROI" },
        { "title": "Proof of Concept", "price": "15-25k", "details": "Duree - Prototype - Presentation" }
      ]
    }
  ]
}
```

### Step 3 — Generer
```bash
cd ~/dstudio-audits  # ou le chemin du repo
node generate-audit.mjs audits/<slug>.json
```

### Step 4 — Ajouter au dashboard
Ajouter une card dans `index.html` sous la bonne section.

### Step 5 — Deployer
```bash
git add audits/<slug>.json <slug>/index.html assets/heroes/<slug>.jpg index.html
git commit -m "feat(audit): add <client> audit deck"
git push origin gh-pages
```

## Types de slides

| Type | Description | Grids |
|------|-------------|-------|
| `hero` | Intro (logo, titre, tags, hero image) | — |
| `stats` | Chiffres cles (count-up anime) | grid-2/3/4 |
| `gap` | Comparaison 2 colonnes (good/bad) | grid-2 auto |
| `cards` | Grille de cartes avec highlights | col, grid-2/3/4 |
| `proposition` | Liste numerotee avec durees | — |
| `cta` | Pricing / offres | grid-2 auto |
| `custom` | HTML libre | — |

## Ordre recommande (7-8 slides)
hero → stats → gap → cards (analyse) → cards (benchmark) → proposition → cta

Un slide **D-Studio CTA** est auto-ajoute a la fin.

## Highlights dans le texte
- `<strong style='color:#fff;'>texte</strong>` — highlight blanc
- `<em style='color:rgba(248,113,113,0.7);'>texte</em>` — highlight rouge
- `<br>` — retour a la ligne dans les titres

## Couleurs accent par secteur
| Secteur | clientColor |
|---------|-------------|
| Tech/MedTech | `rgba(74,222,128,0.6)` (vert) |
| Luxe/Gastronomie | `rgba(212,175,55,0.6)` (or) |
| Aerien/Transport | `rgba(147,197,253,0.6)` (bleu ciel) |
| E-commerce | `rgba(251,191,36,0.6)` (ambre) |
| Automobile | `rgba(147,197,253,0.6)` (bleu) |

## Features incluses automatiquement
- Scroll progress bar (gradient en haut)
- Nav dots (droite, desktop only, cliquables)
- Animated number counters (count-up au scroll)
- Fade-up animations (IntersectionObserver)
- Hero split layout avec image
- Particle canvas background
- D-Studio CTA final avec shimmer button
- Print CSS pour export PDF
- Scroll snap (desktop)
- Design system D-Studio UI (glass cards, spring easing, stroke gradient)
