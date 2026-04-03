# Generate Audit Deck

Read `generator/SKILL-AUDIT.md` for the full workflow, then execute it.

Quick ref:
1. Research the client
2. Create `audits/<slug>.json` (template: `audits/_template.json`)
3. Run `node generate-audit.mjs audits/<slug>.json`
4. Verify output in browser
5. Add to dashboard `index.html`
6. Deploy to gh-pages

All reference files are in `generator/`:
- `SCHEMA.md` — JSON schema
- `tokens.css` — Design tokens
- `DESIGN-RULES.md` — Gradient borders, components, responsive
- `SKILL-QUOTE-DECK.md` — Quote deck variant
