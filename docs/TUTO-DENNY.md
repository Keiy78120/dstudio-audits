# Guide Figma — DENNY

> Ce guide existe parce que tes fichiers Figma ne sont pas exploitables en l'etat.
> L'objectif : que chaque handoff soit dev-ready, et que Claude Code puisse reproduire ton design pixel-perfect sans deviner.

---

## 1. Plugins a installer MAINTENANT

Ouvre Figma, va dans Community > Plugins, installe ces 6 plugins. Ca prend 2 minutes.

| Plugin | Lien | Pourquoi | Gratuit |
|--------|------|----------|---------|
| **Figma Autoname** | [figma.com/community/plugin/1160642826057169962](https://www.figma.com/community/plugin/1160642826057169962) | Renomme automatiquement tous les layers avec des noms semantiques | Oui |
| **Design Lint** | [figma.com/community/plugin/801195587640428208](https://www.figma.com/community/plugin/801195587640428208) | Detecte les styles manquants, les tailles inconsistantes, les tokens non definis | Oui |
| **ComponentQA** | [componentqa.com](https://componentqa.com) | Score de sante de ton fichier — objectif : > 80% | Freemium |
| **Clean Document** | [figma.com/community/plugin/767379019764649932](https://www.figma.com/community/plugin/767379019764649932) | Supprime les layers caches, vides, inutiles en 1 clic | Oui |
| **Batch AutoLayout** | [figma.com/community/plugin/1050770379926525483](https://www.figma.com/community/plugin/1050770379926525483) | Ajoute Auto Layout sur plusieurs frames en meme temps | Oui |
| **Tokens Studio** | [figma.com/community/plugin/843461159747178978](https://www.figma.com/community/plugin/843461159747178978) | Gestion de design tokens au format W3C (couleurs, spacing, typo) | Oui |

---

## 2. Checklist OBLIGATOIRE avant chaque handoff

**Ces 10 points sont non-negociables.** Si un seul est rouge, le fichier n'est pas livrable.

| # | Action | Comment verifier |
|---|--------|-----------------|
| 1 | **Lancer Figma Autoname** | 0 layers nommes "Frame 42", "Group 7", "Rectangle 12" |
| 2 | **Lancer Design Lint** | 0 erreurs dans le rapport |
| 3 | **Auto Layout sur TOUS les conteneurs** | Selectionner chaque frame parent → Shift+A. Aucune position absolue sauf cas justifie (image de fond, overlay) |
| 4 | **Variables Figma creees** | Couleurs, spacing, radius, typo — tout doit etre une variable, pas une valeur en dur |
| 5 | **Composants pour tout element repete** | Cards, badges, boutons, icones = composants. Si tu as copie-colle un element 2+ fois, c'est un composant |
| 6 | **Variants avec etats** | Chaque composant interactif a ses variants : default, hover, active, disabled |
| 7 | **Convention slash pour composants** | `Button/Primary/Large`, `Card/Stat/Default`, `Badge/Tag/Active` — pas "btn1", "card copie 3" |
| 8 | **Noms semantiques sur TOUS les layers** | `hero-section`, `stat-card-brevets`, `cta-pricing-grid` — pas "Frame 234", "-", "dddd" |
| 9 | **Clean Document lance** | Layers caches supprimes, groupes vides nettoyes |
| 10 | **Marquer "Ready for Dev"** | Dans Dev Mode, marquer la page comme prete |

### Raccourci mental

```
Autoname → Lint → Auto Layout → Variables → Composants → Variants → Noms slash → Noms layers → Clean → Ready
```

Ca prend 15-20 minutes. Ca economise 3-4 heures cote dev.

---

## 3. Setup Claude Code sur ton Mac

Tu as Claude Code installe. Voici comment connecter Figma.

### Installer le MCP Figma (une seule fois)

```bash
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
```

### Authentifier

1. Ouvre Claude Code
2. Tape `/mcp`
3. Selectionne `figma`
4. Suis le lien d'authentification

### Commande d'audit avant handoff

Avant de livrer un fichier, demande a Claude :

```
Audite mon fichier Figma https://www.figma.com/design/XXXXX/Mon-Fichier
et dis-moi ce qui n'est pas pret pour le dev.
```

Claude va analyser :
- Les noms de layers (generiques vs semantiques)
- La presence d'Auto Layout
- Les variables definies (ou absentes)
- Les composants (ou leur absence)
- La structure globale

**Corrige ce que Claude remonte AVANT de livrer.** Pas apres.

---

## 4. Workflow ideal : Designer → Dev

```
1. CREER le design (comme d'habitude)

2. AVANT de livrer (15-20 min) :
   a. Figma Autoname         → 1 clic, 30 sec
   b. Revue manuelle         → renommer les layers critiques avec des noms metier
   c. Design Lint             → checker, corriger chaque erreur
   d. Clean Document          → 1 clic, supprimer les dechets
   e. Auto Layout partout     → Shift+A sur chaque conteneur
   f. Creer les variables     → couleurs, spacing, radius, typo
   g. Componentiser           → tout element repete = composant avec variants

3. AUDIT Claude Code :
   "Audite mon fichier Figma [URL] et dis-moi ce qui manque"

4. CORRIGER les points remontes

5. MARQUER Ready for Dev dans Dev Mode

6. LIVRER le lien Figma
```

### Ce qui change pour toi

| Avant | Apres |
|-------|-------|
| Tu livres un fichier brut | Tu livres un fichier audite et nettoye |
| Kevin passe 3h a compenser | Kevin lance Claude et c'est pixel-perfect en 30 min |
| Le client recoit un resultat approximatif | Le client recoit exactement ce que tu as dessine |

---

## 5. Les erreurs concretes du fichier Quotes

Voici ce qui a ete trouve dans ton dernier fichier. Ce n'est pas pour pointer du doigt — c'est pour que ca ne se reproduise plus.

| Erreur | Ce qui a ete trouve | Ce qui aurait du etre fait |
|--------|---------------------|---------------------------|
| **Slides nommees "4", "5", "6"** | Noms generiques, impossibles a identifier | `SLIDE-OPPORTUNITIES`, `SLIDE-BENCHMARK`, `SLIDE-PROPOSITION` |
| **25+ layers nommes "-"** | Un tiret seul, aucune info | `item-brevets`, `card-refonte-premium`, `list-gap-analysis` |
| **0 variables Figma** | Toutes les valeurs en dur (hex, px) | `color/bg-primary`, `color/text-heading`, `spacing/md`, `radius/card` |
| **0 composants** | Tout est duplique en raw frames | `Badge/Tag`, `Card/Stat`, `ListItem/Gap` componentises avec variants |
| **Pas d'Auto Layout** | Positions absolues partout | Flexbox natif Figma (Shift+A) sur chaque conteneur |
| **Variable "dddd"** | Nom de test oublie dans le fichier | `effect/shadow-card` ou supprime si inutile |
| **Aucun etat sur les boutons** | Un seul bouton statique | Variants : default, hover, active, disabled |
| **Pas de grille/spacing coherent** | Ecarts visuels estimes a l'oeil | Variables spacing : 8, 16, 24, 32, 48, 64 |

---

## 6. Resultat attendu vs resultat actuel

### Ce qui s'est passe avec le fichier Quotes

Rex (Claude Code de Kevin) a du :
- **Renommer 139 layers manuellement** via l'API Figma — parce qu'aucun layer n'avait de nom exploitable
- **Deviner les tokens** — pas de variables definies, donc les couleurs/spacing ont ete approximes
- **Compenser l'absence d'Auto Layout** — les positions absolues ne se traduisent pas en code responsive
- **Interpreter la structure** — sans composants ni convention de nommage, chaque element est une boite noire

### Le resultat

Le deck genere n'est **pas pixel-perfect**. Pas parce que l'outil est mauvais, mais parce que le fichier source ne contenait pas les informations necessaires.

### Ce qui se passe avec un fichier propre

Quand le fichier Figma est bien structure :
- Claude lit les noms semantiques → sait exactement quoi generer
- Claude lit les variables → utilise les bons tokens (couleurs, spacing, radius)
- Claude lit l'Auto Layout → genere du code responsive natif
- Claude lit les composants → reutilise les patterns au lieu de dupliquer

**Resultat : pixel-perfect, en 30 minutes au lieu de 4 heures.**

---

## 7. Impact sur le business D-Studio

Soyons directs sur les chiffres :

| Impact | Detail |
|--------|--------|
| **3-4h de travail perdues** | Rex a passe ce temps a renommer, deviner, compenser — au lieu de generer |
| **Resultat client degrade** | Le deck n'est pas pixel-perfect → le client voit un ecart entre le design et le livrable |
| **Automatisation bloquee** | D-Studio veut automatiser la generation de decks. Si le design n'est pas structure, l'automatisation est impossible |
| **Cout en tokens** | Chaque correction manuelle via Claude Opus coute des tokens a ~$15/M input. Un fichier propre = 5x moins de tokens |
| **Scalabilite** | Un designer qui livre des fichiers propres permet de traiter 3x plus de clients dans le meme temps |

### La regle simple

> **15 minutes de cleanup Figma = 3 heures economisees cote dev + un resultat pixel-perfect pour le client.**

Ce n'est pas optionnel. C'est la base du workflow D-Studio.

---

## 8. Reference rapide — Nommage

### Layers

| Mauvais | Bon |
|---------|-----|
| Frame 234 | `hero-section` |
| Group 7 | `stat-grid` |
| Rectangle 12 | `card-background` |
| - | `item-brevets-description` |
| Text | `heading-slide-title` |
| dddd | (supprimer ou renommer) |

### Composants (convention slash)

```
Button/Primary/Large
Button/Primary/Small
Button/Secondary/Large
Card/Stat/Default
Card/Stat/Highlighted
Badge/Tag/Active
Badge/Tag/Inactive
Icon/Arrow/Right
Icon/Check/Default
```

### Variables Figma

```
Couleurs :
  color/bg-primary
  color/bg-secondary
  color/bg-surface
  color/text-heading
  color/text-body
  color/text-muted
  color/accent-primary
  color/accent-secondary

Spacing :
  spacing/xs    → 4
  spacing/sm    → 8
  spacing/md    → 16
  spacing/lg    → 24
  spacing/xl    → 32
  spacing/2xl   → 48
  spacing/3xl   → 64

Radius :
  radius/sm     → 4
  radius/md     → 8
  radius/lg     → 12
  radius/xl     → 16
  radius/full   → 9999

Typography :
  font/heading-xl
  font/heading-lg
  font/heading-md
  font/body-lg
  font/body-md
  font/body-sm
  font/caption
```

---

## 9. Questions frequentes

**"Ca prend trop de temps de tout renommer"**
→ Figma Autoname fait 90% du travail en 1 clic. Les 10% restants (noms metier) prennent 5 minutes.

**"Je ne sais pas quoi mettre comme variable"**
→ Regarde la section 8. Copie cette structure. Adapte les valeurs au projet.

**"Auto Layout casse mon design"**
→ Non. Auto Layout respecte ton design ET le rend responsive. Si ca "casse", c'est que les elements etaient mal positionnes au depart. Corrige la structure, pas le symptome.

**"Les composants c'est complique"**
→ Si tu as copie-colle un element, selectionne-le, Ctrl+Alt+K (Create Component). C'est tout. Les variants viennent apres, une fois le reflexe pris.

**"Le client ne voit pas la difference"**
→ Le client voit un deck pixel-perfect vs un deck approximatif. La difference est visible. Et cote D-Studio, ca fait la difference entre un projet rentable et un projet qui perd de l'argent en corrections.

---

## Resume

1. **Installe les 6 plugins** (2 minutes, une seule fois)
2. **Applique la checklist des 10 points** avant chaque livraison (15-20 minutes)
3. **Utilise Claude Code pour auditer** ton fichier avant de livrer
4. **Corrige** ce qui est remonte
5. **Livre** un fichier Ready for Dev

Le fichier propre, c'est ton job. Le code pixel-perfect, c'est le job de Claude. Les deux dependent l'un de l'autre.
