# Plan Fleet Milo — Mis à jour 18 mars 2026

## FAIT dans cette session

### Audit Decks D-Studio
- [x] Template generator rewrite (SVG logo, scroll natif, IntersectionObserver)
- [x] D-Studio UI tokens (glass, spring easing, stroke gradient)
- [x] Hero images locales (Peugeot e-208 Wikimedia, caviar, avion, cheval, skincare)
- [x] 6 decks enrichis (7-8 slides chacun) + CTA shimmer + counter animation
- [x] Scroll progress bar + nav dots + gradient dividers
- [x] Stellantis + REX OS convertis en JSON
- [x] Dashboard SVG + glass nav
- [x] Docs (README, SCHEMA, skill generate-audit)
- [x] Deploye sur GitHub Pages
- [x] Skill copie sur VPS Milo + package designer pour Denny

### Milo OpenClaw Audit + Fixes
- [x] Opus cacheRetention -> long
- [x] Heartbeat -> claude-haiku-4-5 (garde cache Claude chaud)
- [x] reserveTokensFloor -> 50000
- [x] memoryFlush.softThresholdTokens -> 6000
- [x] tools.profile -> full
- [x] contextPruning.ttl -> 1h
- [x] Embeddings Gemini -> OpenAI text-embedding-3-small (fiable, pas cher)

### Fleet Setup
- [x] Providers mac-ollama + pc-ollama (5 modeles locaux)
- [x] SSH Milo -> Mac (cle ED25519, tested OK)
- [x] CLI backend claude-mac (Claude Code CLI via SSH Tailscale)
- [x] Fallback chain : Haiku -> Mac Ollama -> PC Ollama -> Gemini -> Mistral -> GLM
- [x] SOUL.md enrichi (fleet, routing, subagents, memoire)
- [x] REX memory synced vers Milo workspace

### Infra
- [x] claude-setup repo prive GitHub (51 skills, 11 rules, 11 docs)
- [x] restore.sh + sync.sh scripts
- [x] La Sauce Barber dossier projet (SPEC, TECH, PRICING, BRAND)

## RESTE A FAIRE

### Priorite 1 — Prochaine session
- [ ] Multi-account Claude Pro + Max (2 setup-tokens, failover sur rate limit)
  - `openclaw models auth setup-token --provider anthropic --profile pro`
  - `openclaw models auth setup-token --provider anthropic --profile max`
  - `openclaw models auth order set --provider anthropic pro,max`
  - Attention bugs connus : #20316, #30030, #19249
- [ ] Node pairing Mac (openclaw node run sur Mac -> screenshots, canvas, device)
- [ ] WoL PC (adresse MAC, wakeonlan sur VPS, skill Milo /wake-pc)
- [ ] GitClaw backup (auto-commit workspace Milo -> GitHub prive)

### Priorite 2
- [ ] Monitoring cron : check contexte Milo, force /new si > 150k tokens
- [ ] Sync REX -> Milo periodique (cron rsync)
- [ ] Pull qwen3.5:27b sur Mac si 24GB RAM dispo
- [ ] La Sauce Barber : scaffold Next.js + Stripe + Convex
- [ ] Tester cli backend claude-mac en production

### Priorite 3
- [ ] LiteLLM router sur VPS (routing intelligent avec health checks)
- [ ] Dashboard admin Milo usage (tokens/jour, modele, cout)
- [ ] context1m sur Opus (si besoin longues sessions)
- [ ] Audit decks : 3D card tilt, score bars, mobile nav dots bottom

## Config Milo finale

```
Primary: anthropic/claude-haiku-4-5 (OAuth Pro)
Fallbacks: mac-ollama/qwen3-coder:30b -> pc-ollama/qwen3:30b -> gemini-flash -> mistral-small -> glm-free
CLI: claude-mac (Claude Code Opus/Sonnet via SSH Mac)
Heartbeat: claude-haiku-4-5 (30min, cache warm)
Embeddings: OpenAI text-embedding-3-small (primary), Gemini (fallback)
Compaction: floor 50k, memory flush 6k
Context pruning: cache-ttl 1h
Tools: full profile
```

## Machines

| Machine | Tailscale | Ollama | SSH | Claude CLI | Status |
|---------|-----------|--------|-----|------------|--------|
| Mac | 100.112.24.122 | qwen3-coder:30b, qwen3.5:9b, gpt-oss:20b | OK | OK (Max) | Online |
| PC | 100.91.130.59 | qwen3:30b, qwen3-coder:30b | Non | Non | Online |
| VPS Milo | 100.120.120.123 | — | — | — | Always on |
| VPS Garry | 100.86.167.118 | — | — | — | Always on |
