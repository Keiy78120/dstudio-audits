# D-Studio Audit Decks

Générateur de decks d'audit au format Reveal.js, conçu pour être utilisé par des agents IA (Milo, REX, Claude Code) ou manuellement.

## Stack

- **Generator** : `generate-audit.mjs` (Node.js, zero deps)
- **Frontend** : Reveal.js 5.1.0 (CDN), scroll mode, Inter font
- **Dashboard** : `index.html` (static, GitHub Pages)
- **Config** : JSON files in `audits/`

## Générer un audit

```bash
# Depuis la racine du projet
node generate-audit.mjs audits/lightinderm.json

# Avec output custom
node generate-audit.mjs audits/lightinderm.json --out custom-path/index.html
```

Le fichier généré est un HTML standalone (CSS + JS embarqués, Reveal.js en CDN).

## Régénérer tous les decks

```bash
for f in audits/*.json; do
  [[ $(basename "$f") == _template.json ]] && continue
  node generate-audit.mjs "$f"
done
```

## Déployer

Le repo est configuré pour GitHub Pages sur la branche `gh-pages`.

```bash
git add -A && git commit -m "chore: regenerate decks"
git push origin gh-pages
```

Les decks sont accessibles sur `https://<user>.github.io/dstudio-audits/<slug>/`.

## Workflow AI (Milo / REX)

1. **Recherche** : L'agent recherche des informations sur le client (site web, réseaux sociaux, concurrents)
2. **JSON** : L'agent crée un fichier `audits/<slug>.json` en suivant le schéma (voir `docs/SCHEMA.md`)
3. **Generate** : `node generate-audit.mjs audits/<slug>.json`
4. **Review** : Vérifier le deck en local (`open <slug>/index.html`)
5. **Dashboard** : Ajouter manuellement la carte dans `index.html`
6. **Push** : Commit + push sur `gh-pages`

## Structure du projet

```
dstudio-audits/
├── generate-audit.mjs    # Générateur principal
├── index.html            # Dashboard
├── audits/
│   ├── _template.json    # Template JSON de référence
│   ├── lightinderm.json
│   ├── prunier.json
│   ├── lacompagnie.json
│   ├── ohlala.json
│   ├── stellantis.json
│   └── rexos.json
├── lightinderm/index.html  # Deck généré
├── prunier/index.html
├── lacompagnie/index.html
├── ohlala/index.html
├── stellantis/index.html
├── rexos/index.html
└── docs/
    ├── README.md           # Ce fichier
    └── SCHEMA.md           # Format JSON complet
```
