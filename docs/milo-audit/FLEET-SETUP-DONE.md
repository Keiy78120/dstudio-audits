# Fleet Setup — Résultat (18 mars 2026)

## Ce qui a été fait

### Phase 1 — Providers Ollama ✅
- `mac-ollama` : 3 modèles (qwen3-coder:30b, qwen3.5:9b, gpt-oss:20b)
- `pc-ollama` : 2 modèles (qwen3:30b, qwen3-coder:30b)
- Aliases : mac-coder, mac-fast, mac-oss, pc-qwen, pc-coder
- Fallback chain : Claude → Mac Ollama → PC Ollama → Gemini → Mistral → GLM free

### Phase 1b — CLI Backend Claude Code ✅
- `claude-mac` : SSH via Tailscale vers `/Users/keiy/.local/bin/claude`
- Milo peut exec Claude Code CLI (Opus/Sonnet) sur le Mac de Kevin
- Usage : refactoring lourd multi-fichiers, tests locaux

### SSH Setup ✅
- Clé ED25519 générée dans le container Milo
- Clé ajoutée à `~/.ssh/authorized_keys` sur le Mac
- `known_hosts` configuré (pas de prompt)
- Test : `ssh keiy@100.112.24.122 claude --version` → OK (2.1.78)

### Heartbeat ✅
- Modèle : `mac-ollama/qwen3.5:9b` (gratuit, rapide)
- Intervalle : 30min
- Garde le Mac "éveillé" + 0 token Claude

### SOUL.md mis à jour ✅
- Section Fleet ajoutée (IPs, modèles, capacités)
- Stratégie de routing par tâche documentée
- Subagents delegation table
- Rappel mémoire critique

## Machines connectées

| Machine | IP Tailscale | SSH | Ollama | Claude CLI | Exec |
|---------|-------------|-----|--------|------------|------|
| Mac | 100.112.24.122 | ✅ | ✅ | ✅ (Max) | ✅ |
| PC | 100.91.130.59 | ❌ | ✅ | ❌ | ❌ |
| VPS Milo | 100.120.120.123 | — | — | — | — |

## Modèles disponibles

| Alias | Provider | Modèle | Coût | Usage |
|-------|----------|--------|------|-------|
| haiku | Anthropic | claude-haiku-4-5 | OAuth Pro | Conversation, qualité |
| sonnet | Anthropic | claude-sonnet-4-6 | OAuth Pro | Code, raisonnement |
| opus | Anthropic | claude-opus-4-6 | OAuth Pro | Tâches complexes |
| mac-coder | Mac Ollama | qwen3-coder:30b | Gratuit | Code, review |
| mac-fast | Mac Ollama | qwen3.5:9b | Gratuit | Résumé, heartbeat |
| mac-oss | Mac Ollama | gpt-oss:20b | Gratuit | Général |
| pc-qwen | PC Ollama | qwen3:30b | Gratuit | Raisonnement lourd |
| pc-coder | PC Ollama | qwen3-coder:30b | Gratuit | Code GPU |
| claude-mac | CLI Backend | Claude Code (Mac) | Claude Max | Refactoring multi-fichiers |

## Sécurité
- Tout le trafic passe par Tailscale (chiffré WireGuard)
- SSH par clé ED25519 uniquement (pas de mot de passe)
- PC : Ollama seulement, pas de SSH/exec
- Mac : exec via SSH avec clé, Claude CLI en bypassPermissions
