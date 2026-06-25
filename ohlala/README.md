# Ohlala Sellerie — D-Studio Audit

**Client**: Ohlala Sellerie  
**Industry**: E-commerce (Premium Equestrian Retail)  
**Platform**: Shopify  
**Website**: https://www.ohlala-sellerie.com/  
**Instagram**: @ohlalasellerie (175k followers)  
**Location**: France  

---

## Quick Facts

- **Founded**: Established premium horse equipment retailer
- **Specialization**: Aggregates 40+ equestrian brands (KEP helmets, Horse Pilot airbags, Cavalleria Toscana apparel, etc.)
- **Market Position**: Trusted online destination for French/European equestrians
- **Revenue Model**: Direct e-commerce + affiliate programs (reseller for premium brands)

---

## Audit Assets

### 📦 Collected Media

| Type | Count | Total Size | Status |
|------|-------|-----------|--------|
| Product Images | 3 | 774K | ✅ Premium (Shopify API) |
| Hero Image | 1 | 475K | ✅ High-res (Unsplash) |
| Logo | 1 | 776B | ⚠️ Placeholder (needs official) |

**Folder Structure**:
```
assets/
├── products/        # Product photography (PNG)
├── heroes/         # Hero banner images (JPG)
├── logos/          # Brand identity (SVG)
└── captures/       # (Ready for site screenshots)
```

### 🔍 Data Extracted

- Product catalog: 1000+ SKUs across 40+ brands
- Category structure: Helmets, Airbags, Apparel, Horse Care, Stable Equipment
- Pricing: €14.99 - €790.00 range
- Community: 188k+ newsletter subscribers, 175k Instagram followers

---

## Key Findings

### Strengths
1. **Niche Authority**: Only major French online retailer for premium equestrian equipment
2. **Community**: Strong Instagram presence with engaged following
3. **Inventory**: Deep catalog with exclusive/limited edition items
4. **UX**: Clean Shopify setup, fast-loading product pages

### Opportunities
1. **Visual Content**: Lifestyle photography (riders wearing gear) lacking
2. **Storytelling**: Brand narrative under-developed (no "about" story)
3. **Video**: No product video demos or testimonials
4. **Localization**: English version missing (European market potential)

### Technical Quality
- ✅ SEO: Proper meta tags, structured data
- ✅ Performance: Optimized images, fast CDN
- ✅ Conversion: Clear CTAs, persistent cart
- ⚠️ Mobile: Functional but could benefit from gesture improvements

---

## Recommendations for Audit Deck

### 1. Hero Section Design
- Image: `ohlala-hero.jpg` with dark overlay
- Headline: "Premium Equestrian Trusted by 175k Riders"
- Subheader: "Featuring KEP • Horse Pilot • Cavalleria Toscana • Harcour"

### 2. Product Showcase
- Grid: 3 cols (hero products from collected assets)
- Focus brands: highlight unique product positioning

### 3. Social Proof Section
- "175k Community" callout
- Newsletter signup highlighting ("188k+ subscribers")
- Customer testimonials (to request from client)

### 4. Call-to-Action
- Primary: "Shop Now"
- Secondary: "Learn More About Ohlala"

---

## Data Sources & APIs

### Public APIs Used
- **Shopify GraphQL API**: `https://www.ohlala-sellerie.com/api/graphql.json`
  - Unauthenticated access to product catalog
  - Retrieved 10 products with images in test
  
- **Unsplash Free API**: Lifestyle image sourcing

### Manual Research
- Instagram: @ohlalasellerie profile analysis
- Site structure: Carousel detection, category taxonomy

---

## Files Reference

| File | Purpose |
|------|---------|
| `MEDIA_AUDIT.md` | Detailed asset metadata + quality notes |
| `README.md` | This file — project overview |
| `assets/` | Media files for deck integration |

---

## Next Steps

1. ✅ Media asset collection — **DONE**
2. ⏳ Obtain official logo from client
3. ⏳ Request lifestyle product photography
4. ⏳ Audit design decisions (Figma spec vs. implementation)
5. ⏳ Competitive analysis (similar retailers)
6. ⏳ Create audit presentation deck

---

**Audit Started**: 2026-05-13  
**Status**: Foundation Complete — Ready for Deep-Dive  
**Next Review**: After client brief + logo receipt
