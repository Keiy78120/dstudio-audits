# Schema JSON — Audit Deck

## Root

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `slug` | string | oui | Identifiant URL (kebab-case) |
| `client` | string | oui | Nom du client affiché |
| `date` | string | oui | Date affichée dans le hero (ex: "Mars 2026") |
| `lang` | string | non | Langue HTML (défaut: "fr") |
| `clientLogo` | string | non | URL du logo client (Clearbit recommandé) |
| `clientColor` | string | non | Couleur CSS pour `--accent` (ex: `rgba(74,222,128,0.6)`) |
| `slides` | array | oui | Liste des slides |

## Slide types

### `hero` — Slide d'intro

```json
{
  "type": "hero",
  "label": "Nom du Client",
  "title": "Titre principal<br>sur deux lignes.",
  "body": "Accroche percutante.",
  "tags": ["Tag 1", "Tag 2"]
}
```

### `gap` — Comparaison deux colonnes

```json
{
  "type": "gap",
  "label": "Le gap",
  "title": "Ce qui existe vs ce qui devrait exister.",
  "columns": [
    {
      "title": "BENCHMARK",
      "type": "good",
      "items": ["Point fort <strong style='color:#fff;'>highlight</strong>"]
    },
    {
      "title": "CLIENT",
      "type": "bad",
      "items": ["Point faible"]
    }
  ]
}
```

### `cards` — Grille de cartes

```json
{
  "type": "cards",
  "label": "Section",
  "title": "Titre.",
  "grid": "grid-2",
  "cards": [
    {
      "title": "Titre carte",
      "body": "Description.",
      "highlight": "red"
    }
  ]
}
```

**`grid`** : `"col"` (vertical), `"grid-2"`, `"grid-3"`, `"grid-4"`
**`highlight`** : `"red"` ou `"green"` (optionnel)

### `stats` — Chiffres clés

```json
{
  "type": "stats",
  "label": "En chiffres",
  "title": "Le potentiel.",
  "grid": "grid-4",
  "stats": [
    { "value": "50", "label": "Brevets" },
    { "value": "52k", "label": "Instagram" }
  ]
}
```

### `proposition` — Liste numérotée

```json
{
  "type": "proposition",
  "label": "Notre proposition",
  "title": "X chantiers.",
  "items": [
    {
      "title": "Chantier 1",
      "body": "Description",
      "duration": "3-6 sem"
    }
  ]
}
```

### `cta` — Pricing / offres

```json
{
  "type": "cta",
  "label": "Pour démarrer",
  "title": "Un audit.<br>X semaines.",
  "offers": [
    {
      "title": "Audit complet",
      "price": "5-8k€",
      "details": "Durée · Livrables · ROI"
    }
  ]
}
```

### `custom` — HTML libre

```json
{
  "type": "custom",
  "label": "Section",
  "title": "Titre.",
  "html": "<div class='grid-2'>...</div>"
}
```

## Slide auto-ajouté

Un slide **D-Studio CTA** est automatiquement ajouté à la fin de chaque deck avec le logo SVG et un bouton vers dstudio.company.

## CSS classes disponibles dans `custom`

| Classe | Description |
|--------|-------------|
| `grid-2`, `grid-3`, `grid-4` | Grilles responsive |
| `col` | Flex column |
| `row` | Flex row |
| `flex-c` | Flex center |
| `card` | Carte glassmorphism |
| `card-title` | Titre de carte |
| `card-body` | Corps de carte |
| `tag-w`, `tag-g`, `tag-r` | Tags (white, green, red) |
| `list-item` | Item de liste |
| `dot`, `dot-g`, `dot-r` | Dots colorés |
| `stat-big` | Grand chiffre |
| `stat-label` | Label sous un chiffre |
| `progress-bar` + `progress-fill` | Barre de progression |
| `fragment fade-up` | Animation au scroll |

## Branding client

- `clientLogo` : affiché en grayscale dans le hero (Clearbit URL recommandé)
- `clientColor` : utilisé comme `--accent` pour les progress bars
- Le logo D-Studio SVG est toujours affiché dans le hero et le CTA final

## HTML dans les textes

Les champs `body` et `items` acceptent du HTML inline :
- `<strong style='color:#fff;'>texte</strong>` — highlight blanc
- `<em style='color:rgba(248,113,113,0.7);'>texte</em>` — highlight rouge
- `<br>` — retour à la ligne
