# Milo — Protection Memoire (ne jamais perdre)

## Architecture memoire actuelle
- **Fichiers source** : `~/.openclaw/workspace/memory/` (Markdown = source de verite)
- **MEMORY.md** : memoire long-terme curee
- **memory/YYYY-MM-DD.md** : logs quotidiens (auto-charge J et J-1)
- **SQLite embeddings** : `~/.openclaw/memory/main.sqlite` (index vectoriel)
- **Provider embeddings** : Gemini (`gemini-embedding-001`)
- **Session memory** : experimentale, activee (`sources: ["memory", "sessions"]`)

## Config memoire actuelle (Milo)
```json
"memorySearch": {
  "enabled": true,
  "sources": ["memory", "sessions"],
  "provider": "gemini",
  "model": "gemini-embedding-001",
  "store": {
    "path": "~/.openclaw/memory/main.sqlite",
    "vector": { "enabled": true }
  },
  "query": {
    "maxResults": 6,
    "hybrid": {
      "enabled": true,
      "vectorWeight": 0.7,
      "textWeight": 0.3,
      "candidateMultiplier": 4,
      "temporalDecay": { "enabled": true, "halfLifeDays": 30 }
    }
  },
  "cache": { "enabled": true, "maxEntries": 50000 }
}
```

## Ce qui protege la memoire

| Protection | Status | Details |
|-----------|--------|---------|
| Memory flush pre-compaction | OK | `softThresholdTokens: 6000` — ecrit en memoire AVANT compaction |
| Fichiers Markdown = source de verite | OK | RAM ephemere, disque permanent |
| Hybrid search (vector + BM25) | OK | Retrouve les souvenirs meme avec paraphrases |
| Temporal decay 30j | OK | Les vieux souvenirs restent accessibles mais ponderes |
| Embedding cache 50k entries | OK | Pas de re-embedding inutile |

## Ce qui manque (a implementer)

### 1. GitClaw (backup workspace auto vers GitHub)
```bash
# Skill qui auto-commit/push le workspace
# Protege contre crash disque / perte VPS
```
Ref: https://github.com/openclaw/openclaw/discussions/5809

### 2. Backup cron du SQLite
```bash
# Ajouter un cron dans le container
0 */6 * * * cp ~/.openclaw/memory/main.sqlite ~/.openclaw/backups/memory-$(date +%Y%m%d-%H%M).sqlite
```

### 3. Sync workspace vers Mac
```bash
# rsync periodique VPS → Mac via Tailscale
rsync -az root@milo-vps:~/.openclaw/workspace/ ~/milo-workspace-backup/
```
