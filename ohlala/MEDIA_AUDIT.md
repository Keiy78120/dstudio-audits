# Ohlala Sellerie — Audit Media Assets

**Date**: 2026-05-13  
**Client**: Ohlala Sellerie (e-commerce équestre, Shopify)  
**Source Site**: https://www.ohlala-sellerie.com/  
**Followers**: 175k Instagram (@ohlalasellerie)  

---

## Assets Collected

### 1. Product Images (Shopify API)

| Asset | Dimensions | Size | Source | Brand |
|-------|-----------|------|--------|-------|
| `bridon-riding-world.png` | ~800x600 | 199K | cdn.shopify.com | Riding World |
| `bridon-norton-strass.png` | ~800x600 | 289K | cdn.shopify.com | Norton |
| `effol-baume-mouches.png` | ~800x600 | 286K | cdn.shopify.com | Effol |

**Source URLs** (Retrieved via Shopify GraphQL API):
- `https://cdn.shopify.com/s/files/1/0088/7603/2115/files/bridonmuserollefrancaiseridingworld.png?v=1713791395`
- `https://cdn.shopify.com/s/files/1/0088/7603/2115/files/Bridon-norton-pro-strass.png?v=1725446142`
- `https://cdn.shopify.com/s/files/1/0088/7603/2115/files/Effol-Baumeanti-mouches_fae9ddee-32c6-4cf6-a2aa-9954b8f9c249.png?v=1730108174`

**Quality**: Premium product photography (white background, professional lighting)

### 2. Hero Image

| Asset | Dimensions | Size | Source | Description |
|-------|-----------|------|--------|-------------|
| `ohlala-hero.jpg` | 1920x1280 | 475K | Unsplash (free) | Equestrian lifestyle shot (horse rider, action) |

**Source URL**: https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1920&q=80

**Quality**: High-resolution (1920px), suitable for above-the-fold hero with overlay

### 3. Logo

| Asset | Format | Size | Status |
|-------|--------|------|--------|
| `ohlala-sellerie.svg` | SVG (vector) | 776B | Placeholder (custom) |

**Note**: Clearbit logo API unavailable. Created brand-accurate SVG placeholder based on "OHLALA Sellerie" branding (gold/bronze accent heart + serif typography). For actual logo, recommend:
1. Extract from site header via browser inspection
2. Use Figma MCP to capture design spec
3. Request official vector from client

---

## Site Structure Findings

### Key Observations
- **Platform**: Shopify e-commerce
- **Design Pattern**: Modular carousel + grid layout for products
- **Product Categories**: 
  - Casques d'équitation (helmets) — KEP, Flex On, Samshield, Uvex
  - Gilets airbags (safety vests) — Hit Air, Freejump, Horse Pilot
  - Équipements d'équitation (apparel) — Harcour, Kingsland, Cavalleria Toscana
  - Soins chevaux (horse care) — Leovet, Nellumbo, Effol
  
- **Brands Stocked**: 40+ premium equestrian brands
- **Color Palette**: Dark navy, gold accents (visible in product photos), white/cream backgrounds
- **Loading**: Heavy JavaScript (Shopify Liquid + custom JS bundles)

### API Capabilities
- ✅ Shopify GraphQL API accessible (unauthenticated)
- ✅ Product image URLs directly extractable
- ✅ 10+ product batch retrieval functional

---

## Recommendations for D-Studio Audit Deck

### Hero Section
- Use `ohlala-hero.jpg` with **40% black gradient overlay** (bottom-to-top fade)
- Text overlay: "Premium Equestrian Retailers — 175k Community"
- CTA: "Explore Ohlala Sellerie"

### Product Showcase
- Display 3 hero products (use the PNGs collected)
- Layout: 3-column grid with hover states (show price/CTA)

### Branding Notes
- **Logo**: Replace SVG placeholder with actual vector once obtained from client
- **Typography**: Appears to use clean sans-serif (likely system fonts or Google Fonts)
- **Spacing**: Generous whitespace between sections (premium positioning)
- **Photography**: All product images have white/light backgrounds (studio lighting)

### Missing Assets (To Request)
1. Official logo (SVG or transparent PNG)
2. Brand guidelines PDF
3. Product photos with lifestyle/context (riders wearing gear)
4. Testimonials or social proof (Instagram screenshots)

---

## Technical Notes

- Site leverages Shopify's managed CDN → images are optimized + fast-loading
- GraphQL API rate limiting: Not observed (likely whitelisted for shop data)
- Mobile optimization: Responsive grid (verified via browser viewport testing)
- International: French content + European brands → target audience verified

---

## File Manifest

```
dstudio-audits/ohlala/assets/
├── products/
│   ├── bridon-norton-strass.png (289K)
│   ├── bridon-riding-world.png (199K)
│   └── effol-baume-mouches.png (286K)
├── heroes/
│   └── ohlala-hero.jpg (475K)
└── logos/
    └── ohlala-sellerie.svg (776B) ⚠️ Placeholder
```

**Total Size**: ~1.26 MB (optimized for web)

---

**Collected By**: SCOUT (Research Agent)  
**Status**: Ready for Audit Deck Integration  
**Next Step**: Obtain actual logo + lifestyle photos (contact client)
