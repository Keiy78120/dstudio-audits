# Fleet — Router modeles vers Mac/PC local

## Objectif
Quand ton Mac ou PC est allume, Milo (VPS) peut router certaines requetes vers les modeles locaux (Ollama sur Mac/PC) au lieu de consommer des tokens Claude/OpenAI. Quand les machines sont eteintes, Milo reste sur les providers cloud.

## Architecture cible

```
┌──────────────┐     Tailscale      ┌──────────────┐
│  VPS Milo    │◄──────────────────►│  Mac Kevin   │
│  (OpenClaw)  │     100.x.x.x     │  (Ollama)    │
│              │                     │  qwen3, etc  │
└──────┬───────┘                     └──────────────┘
       │            Tailscale      ┌──────────────┐
       └───────────────────────────►│  PC Kevin    │
                    100.x.x.x      │  (Ollama)    │
                                    │  GPU, etc    │
                                    └──────────────┘
```

## Pre-requis

### Deja fait
- [x] Tailscale installe sur VPS
- [x] Tailscale installe sur Mac

### A faire
- [ ] Tailscale sur PC Windows
- [ ] Ollama installe sur Mac (`brew install ollama`)
- [ ] Ollama installe sur PC
- [ ] Ollama expose sur Tailscale IP (pas juste localhost)
- [ ] Wake-on-LAN configure sur PC (BIOS + carte reseau)
- [ ] Script WoL sur VPS pour reveiller le PC

## Config Ollama pour fleet

Sur Mac et PC, Ollama doit ecouter sur l'IP Tailscale :
```bash
# Mac — dans ~/.zshrc ou LaunchAgent
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# Ou plus securise — seulement Tailscale
OLLAMA_HOST=100.x.x.x:11434 ollama serve
```

## Config OpenClaw — Provider local

Ajouter dans `openclaw.json` de Milo :
```json
{
  "models": {
    "providers": {
      "mac-ollama": {
        "baseUrl": "http://100.x.x.x:11434/v1",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen3:32b",
            "name": "Qwen3 32B (Mac local)",
            "reasoning": true,
            "input": ["text"],
            "cost": { "input": 0, "output": 0 },
            "contextWindow": 128000,
            "maxTokens": 8192
          }
        ]
      },
      "pc-ollama": {
        "baseUrl": "http://100.y.y.y:11434/v1",
        "api": "openai-completions",
        "models": [
          {
            "id": "qwen3:72b",
            "name": "Qwen3 72B (PC GPU)",
            "reasoning": true,
            "input": ["text"],
            "cost": { "input": 0, "output": 0 },
            "contextWindow": 128000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
```

## Routing intelligent

### Option A — Fallback chain
Mettre les modeles locaux dans les fallbacks :
```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-haiku-4-5",
        "fallbacks": [
          "mac-ollama/qwen3:32b",
          "pc-ollama/qwen3:72b",
          "google/gemini-2.5-flash"
        ]
      }
    }
  }
}
```
Probleme : ne s'active QUE si Claude echoue.

### Option B — Heartbeat sur local (economise les tokens Claude)
```json
{
  "heartbeat": {
    "model": "mac-ollama/qwen3:32b"
  }
}
```
Les heartbeats (toutes les 30min) tournent en local = 0 token Claude.
Mais si le Mac est eteint, le heartbeat echoue.

### Option C — Agent-specific routing
Certains agents utilisent le local, d'autres Claude :
```json
{
  "agents": {
    "list": [
      {
        "id": "research",
        "model": "mac-ollama/qwen3:32b"
      },
      {
        "id": "main",
        "model": { "primary": "anthropic/claude-sonnet-4-6" }
      }
    ]
  }
}
```

### Option D — LiteLLM Router (le plus puissant)
LiteLLM comme proxy entre Milo et tous les providers :
```
Milo → LiteLLM (sur VPS) → Claude API / Ollama Mac / Ollama PC / OpenAI
```
LiteLLM gere :
- Health checks (machine on/off)
- Load balancing
- Cost tracking
- Retry + fallback automatique
- Rate limiting

Config LiteLLM :
```yaml
model_list:
  - model_name: smart
    litellm_params:
      model: anthropic/claude-haiku-4-5
      api_key: os.environ/ANTHROPIC_API_KEY
  - model_name: smart
    litellm_params:
      model: ollama/qwen3:32b
      api_base: http://100.x.x.x:11434
  - model_name: heavy
    litellm_params:
      model: anthropic/claude-sonnet-4-6
  - model_name: heavy
    litellm_params:
      model: ollama/qwen3:72b
      api_base: http://100.y.y.y:11434

router_settings:
  routing_strategy: "least-busy"
  enable_pre_call_checks: true
  fallbacks:
    - smart: [heavy]
```

## Wake-on-LAN

### Setup PC Windows
1. BIOS : activer Wake-on-LAN
2. Windows : Proprietes carte reseau → Wake on Magic Packet = Enabled
3. Noter l'adresse MAC du PC

### Script WoL sur VPS
```bash
# installer
apt install wakeonlan

# reveiller le PC
wakeonlan -i 100.y.y.y AA:BB:CC:DD:EE:FF

# ou via Tailscale subnet
wakeonlan -i 192.168.1.255 AA:BB:CC:DD:EE:FF
```

### Skill OpenClaw pour WoL
Milo pourrait avoir un skill :
- "Reveille le PC" → envoie WoL magic packet
- Attend 60s
- Verifie que Ollama repond sur 100.y.y.y:11434
- Route les requetes vers le PC

## Acces necessaires pour setup

| Machine | Acces | Pour quoi |
|---------|-------|-----------|
| VPS | root SSH (deja) | Config OpenClaw, LiteLLM, WoL |
| Mac | local (deja) | Ollama, Tailscale IP |
| PC | RDP ou physique | Tailscale install, Ollama, BIOS WoL, MAC address |

## Etapes

1. **Tailscale sur PC** — installer, login, noter l'IP 100.y.y.y
2. **Ollama sur les 2 machines** — `OLLAMA_HOST=0.0.0.0` + pull les modeles
3. **Test connectivite** — depuis VPS : `curl http://100.x.x.x:11434/api/tags`
4. **Ajouter providers** dans `openclaw.json` de Milo
5. **WoL** — noter MAC du PC, installer wakeonlan sur VPS, tester
6. **Optionnel** : LiteLLM sur VPS comme proxy intelligent
