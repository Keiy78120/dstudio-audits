# D-Studio Audit Deck Generator — Skill Package

## Installation (2 minutes)

### 1. Cloner le repo
```bash
git clone https://github.com/Keiy78120/dstudio-audits.git ~/dstudio-audits
```

### 2. Installer le skill Claude Code
```bash
cp -r skill-package/generate-audit ~/.claude/skills/generate-audit
```

### 3. Tester
```bash
cd ~/dstudio-audits
node generate-audit.mjs audits/lightinderm.json
open lightinderm/index.html
```

## Utilisation

Dis simplement a Claude :
```
Crée un audit deck pour [NOM DE L'ENTREPRISE]
```

Ou invoque le skill directement :
```
/generate-audit
```

Claude va :
1. Rechercher des infos sur l'entreprise
2. Creer le JSON dans `audits/<slug>.json`
3. Generer le deck HTML
4. Te montrer le resultat

## Deploiement

```bash
git add -A && git commit -m "feat(audit): add <client>" && git push origin gh-pages
```

Le deck sera live sur : `https://keiy78120.github.io/dstudio-audits/<slug>/`
