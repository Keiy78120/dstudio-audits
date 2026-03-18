#!/usr/bin/env node

/**
 * D-Studio Audit Deck Generator (AI-first)
 *
 * Generates a complete Reveal.js HTML audit deck from a JSON config file.
 * Designed to be called by AI agents (Milo, REX, Claude Code).
 *
 * Usage:
 *   node generate-audit.mjs audits/stellantis.json
 *   node generate-audit.mjs audits/stellantis.json --out stellantis/index.html
 *
 * JSON config format: see audits/_template.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename, dirname } from "path";

const DSTUDIO_SVG = `<svg width="103" height="33" viewBox="0 0 103 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M37.399 19.3917C37.8443 19.7141 38.3853 19.8752 38.9335 19.8439C39.3716 19.8656 39.8073 19.7598 40.1903 19.5433C40.4991 19.358 40.681 19.0213 40.6666 18.6605C40.6762 18.4344 40.5781 18.2155 40.4009 18.076C40.1544 17.9004 39.8743 17.7777 39.5798 17.7103C39.204 17.6117 38.6008 17.4698 37.7533 17.2942C37.0519 17.1547 36.3649 16.943 35.7066 16.664C35.1752 16.4306 34.7203 16.0482 34.3996 15.5623C34.0429 14.973 33.8705 14.2898 33.904 13.6019C33.8968 12.8899 34.1171 12.1923 34.5312 11.615C34.9741 11.004 35.5701 10.5229 36.262 10.2198C37.0376 9.87586 37.8778 9.70267 38.7252 9.7147C39.5894 9.70267 40.4464 9.87827 41.2364 10.2319C41.9402 10.5398 42.5506 11.0329 43.0006 11.6583C43.4244 12.25 43.6518 12.962 43.647 13.6885H40.4847C40.4656 13.2819 40.2788 12.8995 39.9748 12.6349C39.6205 12.351 39.1729 12.2091 38.7181 12.2356C38.3255 12.2187 37.9353 12.3174 37.5977 12.5218C37.3153 12.6998 37.1477 13.0198 37.1645 13.3565C37.1525 13.5778 37.2458 13.7919 37.4158 13.9338C37.6576 14.1022 37.9305 14.2225 38.2201 14.2898C38.5864 14.3884 39.1801 14.5255 40.0036 14.6891C40.7169 14.819 41.4135 15.0211 42.0862 15.2929C42.6224 15.5142 43.0844 15.8846 43.4196 16.3585C43.7786 16.9214 43.9558 17.5828 43.9223 18.2516C43.9295 18.9996 43.6996 19.7333 43.2688 20.3443C42.8091 20.9913 42.1843 21.5013 41.459 21.8164C40.6451 22.182 39.7642 22.3624 38.8737 22.3504C37.9496 22.3648 37.0352 22.1772 36.1902 21.7996C35.4409 21.47 34.7921 20.948 34.3062 20.2865C33.8538 19.6659 33.612 18.913 33.6168 18.1409L36.779 18.2107C36.803 18.6749 37.028 19.1079 37.3967 19.3917" fill="white"/><path d="M54.005 9.82068V12.5893H50.668V22.2423H47.4195V12.5893H44.0825V9.82068H54.005Z" fill="white"/><path d="M58.4937 17.0225C58.4458 17.6984 58.6134 18.3743 58.9701 18.9492C59.8271 19.8104 61.2179 19.8128 62.0749 18.9492C62.4316 18.3743 62.5992 17.6984 62.5513 17.0225V9.81824H65.795V16.8469C65.8955 18.3334 65.4095 19.7983 64.4448 20.9265C62.1635 22.8196 58.8672 22.8196 56.5882 20.9265C55.6235 19.7959 55.1376 18.331 55.2381 16.8469V9.81824H58.4865L58.4913 17.0225H58.4937Z" fill="white"/><path d="M72.311 9.81832C73.4505 9.79427 74.5756 10.0709 75.5762 10.6169C76.505 11.1293 77.2687 11.8966 77.7833 12.8251C78.8318 14.8312 78.8318 17.2246 77.7833 19.2283C77.2687 20.1592 76.505 20.9242 75.5762 21.4365C74.5756 21.9826 73.4505 22.2592 72.311 22.2351H67.6646V9.81592H72.311V9.81832ZM74.475 18.6005C75.4996 17.0394 75.4996 15.0164 74.475 13.4553C73.9532 12.7986 73.1465 12.4354 72.311 12.4787H70.9154V19.5771H72.311C73.1465 19.6204 73.9508 19.2572 74.475 18.6005Z" fill="white"/><path d="M83.2485 9.81824H80V22.2399H83.2485V9.81824Z" fill="white"/><path d="M94.1907 21.5229C92.1559 22.6222 89.7094 22.6222 87.6747 21.5229C86.7435 20.9889 85.9798 20.2072 85.4675 19.2618C84.419 17.2365 84.419 14.8262 85.4675 12.8009C85.9798 11.8555 86.7435 11.0714 87.6747 10.5398C89.7094 9.43808 92.1583 9.43808 94.1907 10.5398C95.1219 11.0714 95.8855 11.8555 96.3978 12.8009C97.4463 14.8262 97.4463 17.2365 96.3978 19.2618C95.8855 20.2072 95.1219 20.9913 94.1907 21.5229ZM90.9327 19.6515C91.7633 19.6756 92.5557 19.2955 93.0608 18.6316C94.1309 17.0657 94.1309 14.9994 93.0608 13.4311C92.1081 12.25 90.3845 12.0672 89.2091 13.0246C89.0607 13.1448 88.9242 13.2819 88.8046 13.4311C87.7321 14.997 87.7321 17.0657 88.8046 18.6316C89.3097 19.2979 90.102 19.678 90.9327 19.6515Z" fill="white"/><path d="M101.011 18.4297C101.54 18.4128 102.054 18.6149 102.433 18.9877C103.189 19.7671 103.189 21.0083 102.433 21.7877C101.631 22.5357 100.391 22.5357 99.5864 21.7877C98.8299 21.0083 98.8299 19.7671 99.5864 18.9877C99.9646 18.6149 100.479 18.4128 101.008 18.4297" fill="white"/><path d="M24.525 22.2638C25.2838 21.5229 25.8966 20.6449 26.3275 19.6731C26.0953 21.3642 25.6213 23.0143 24.9247 24.5706C23.9169 26.875 22.2364 28.8162 20.1011 30.1343C17.7958 31.4693 15.1674 32.1332 12.5078 32.0539H7.63397C7.92842 31.2865 8.07683 30.4687 8.06726 29.646C8.11035 27.9743 7.45683 26.3626 6.26469 25.196C5.06059 24.0101 3.42799 23.3703 1.74511 23.4184C1.15623 23.4136 0.569735 23.4833 0 23.6228V0.00638118H12.5054C15.1483 -0.0705924 17.7671 0.550007 20.0963 1.80323C22.2149 3.02278 23.9025 4.87977 24.9199 7.11201C25.7171 8.84872 26.2222 10.7057 26.4185 12.606C25.9852 11.5452 25.3389 10.5878 24.5226 9.78925C22.8349 8.1271 20.5488 7.22987 18.186 7.30204C15.8233 7.22987 13.5348 8.1295 11.8495 9.79165C10.1786 11.4273 9.26418 13.6884 9.32403 16.0313C9.26179 18.3742 10.1786 20.6353 11.8495 22.2686C13.5348 23.9331 15.8233 24.8328 18.186 24.763C20.5488 24.8328 22.8349 23.9331 24.5226 22.2686" fill="white"/></svg>`;

const args = process.argv.slice(2);
const configPath = args[0];

if (!configPath) {
  console.error("Usage: node generate-audit.mjs <config.json> [--out <path>]");
  process.exit(1);
}

const outIdx = args.indexOf("--out");
const config = JSON.parse(readFileSync(configPath, "utf-8"));
const slug = config.slug || basename(configPath, ".json");
const outPath = outIdx !== -1 ? args[outIdx + 1] : join(slug, "index.html");

// ─── Slide generators ───

function slideHero(s) {
  const tags = (s.tags || []).map((t) => `<span class="tag-w">${t}</span>`).join("\n      ");
  const clientLogoHtml = config.clientLogo
    ? `<img src="${config.clientLogo}" alt="${config.client}" style="filter:grayscale(1) brightness(2);height:28px;opacity:0.6;" />`
    : "";
  return `
<section>
  <div class="orb orb-1" style="opacity:0.4;"></div>
  <div class="orb orb-2"></div>
  <div class="scanline"></div>
  <div style="display:flex;flex-direction:column;gap:24px;max-width:800px;position:relative;z-index:1;">
    <div class="flex-c anim">
      <span style="height:20px;display:inline-flex;align-items:center;">${DSTUDIO_SVG.replace('width="103" height="33"', 'height="20"')}</span>
      <span class="chev">›</span>
      <span class="pill">${config.date || ""}</span>
      ${clientLogoHtml}
    </div>
    <div>
      <div class="label anim d1" style="margin-bottom:14px;">${s.label || config.client}</div>
      <div class="title-xl anim d2">${s.title}</div>
    </div>
    <div class="divider anim d3"></div>
    <p class="body-md anim d4" style="max-width:540px;">${s.body || ""}</p>
    ${tags ? `<div class="flex-c anim d5" style="flex-wrap:wrap;gap:8px;">${tags}</div>` : ""}
  </div>
</section>`;
}

function slideGap(s) {
  function renderColumn(col) {
    const dotClass = col.type === "good" ? "dot-g" : "dot-r";
    const items = (col.items || [])
      .map((item) => `          <div class="list-item anim"><div class="dot ${dotClass}"></div><div class="card-body">${item}</div></div>`)
      .join("\n");
    return `
      <div>
        <div class="card-title" style="font-size:11px;color:rgba(255,255,255,0.25);margin-bottom:8px;">${col.title}</div>
        <div class="col" style="gap:6px;">
${items}
        </div>
      </div>`;
  }

  const cols = (s.columns || []).map(renderColumn).join("\n");
  return `
<section>
  <div style="display:flex;flex-direction:column;gap:18px;position:relative;z-index:1;">
    <div>
      <div class="label anim" style="margin-bottom:10px;">${s.label || "Le gap"}</div>
      <div class="title-lg anim d1">${s.title}</div>
    </div>
    <div class="grid-2 anim d2">
${cols}
    </div>
  </div>
</section>`;
}

function slideCards(s) {
  const cards = (s.cards || [])
    .map((c) => {
      const style = c.highlight ? `background:rgba(${c.highlight === "red" ? "248,113,113" : "74,222,128"},0.04);border-color:rgba(${c.highlight === "red" ? "248,113,113" : "74,222,128"},0.12);` : "";
      const titleColor = c.highlight ? `color:rgba(${c.highlight === "red" ? "248,113,113,0.8" : "74,222,128,0.7"});` : "";
      return `      <div class="card anim" ${style ? `style="${style}"` : ""}><div class="card-title" ${titleColor ? `style="${titleColor}"` : ""}>${c.title}</div><div class="card-body" style="margin-top:10px;">${c.body}</div></div>`;
    })
    .join("\n");

  return `
<section>
  <div style="display:flex;flex-direction:column;gap:18px;position:relative;z-index:1;">
    <div>
      <div class="label anim" style="margin-bottom:10px;">${s.label || ""}</div>
      <div class="title-lg anim d1">${s.title}</div>
    </div>
    <div class="${s.grid || "col"} anim d2" style="gap:10px;">
${cards}
    </div>
  </div>
</section>`;
}

function slideProposition(s) {
  const items = (s.items || [])
    .map((item, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `      <div class="list-item anim" style="justify-content:space-between;align-items:center;"><div class="row" style="gap:12px;"><div class="num">${num}</div><div><div class="card-title">${item.title}</div><div class="card-body">${item.body}</div></div></div>${item.duration ? `<span class="tag-w" style="white-space:nowrap;">${item.duration}</span>` : ""}</div>`;
    })
    .join("\n");

  return `
<section>
  <div style="display:flex;flex-direction:column;gap:16px;position:relative;z-index:1;">
    <div>
      <div class="label anim" style="margin-bottom:10px;">${s.label || "Notre proposition"}</div>
      <div class="title-lg anim d1">${s.title}</div>
    </div>
    <div class="col anim d2" style="gap:7px;">
${items}
    </div>
  </div>
</section>`;
}

function slideStats(s) {
  const stats = (s.stats || [])
    .map((st) => `      <div class="card anim" style="text-align:center;padding:22px;"><div class="stat-big" style="font-size:34px;">${st.value}</div><div class="stat-label">${st.label}</div><div class="progress-bar" style="margin-top:14px;"><div class="progress-fill"></div></div></div>`)
    .join("\n");

  return `
<section>
  <div style="display:flex;flex-direction:column;gap:18px;position:relative;z-index:1;">
    <div class="orb orb-1" style="opacity:0.3;"></div>
    <div>
      <div class="label anim" style="margin-bottom:10px;">${s.label || ""}</div>
      <div class="title-lg anim d1">${s.title}</div>
    </div>
    <div class="${s.grid || "grid-2"} anim d2">
${stats}
    </div>
  </div>
</section>`;
}

function slideCTA(s) {
  const offers = (s.offers || [])
    .map((o) => `      <div class="card" style="padding:22px;"><div class="card-title" style="margin-bottom:8px;">${o.title}</div><div class="stat-big" style="font-size:34px;">${o.price}</div><div class="card-body" style="margin-top:8px;font-size:12px;">${o.details}</div><div class="progress-bar" style="margin-top:14px;"><div class="progress-fill"></div></div></div>`)
    .join("\n");

  return `
<section>
  <div class="orb orb-1" style="opacity:0.4;"></div>
  <div class="orb orb-2"></div>
  <div class="scanline"></div>
  <div style="display:flex;flex-direction:column;gap:24px;max-width:800px;position:relative;z-index:1;">
    <div>
      <div class="label anim" style="margin-bottom:14px;">${s.label || "Pour démarrer"}</div>
      <div class="title-xl anim d1">${s.title}</div>
    </div>
    <div class="divider anim d2"></div>
    <div class="grid-2 anim d3">
${offers}
    </div>
    <div class="card anim d4" style="padding:16px 20px;">
      <p class="body-md" style="font-size:13px;">contact@dstudio.company &middot; D-Studio, 7 rue Lauriston, 75016 Paris</p>
    </div>
  </div>
</section>`;
}

function slideCustom(s) {
  return `
<section>
  <div style="display:flex;flex-direction:column;gap:18px;position:relative;z-index:1;">
    <div>
      <div class="label anim" style="margin-bottom:10px;">${s.label || ""}</div>
      <div class="title-lg anim d1">${s.title}</div>
    </div>
    <div class="anim d2">
      ${s.html || ""}
    </div>
  </div>
</section>`;
}

function slideDStudioCTA() {
  return `<!-- D-Studio CTA -->
<section>
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:32px;position:relative;z-index:1;text-align:center;">
    <div class="orb orb-1" style="opacity:0.3;"></div>
    <div class="orb orb-2"></div>
    <div class="anim" style="width:150px;">${DSTUDIO_SVG}</div>
    <div class="divider anim d1" style="margin:0 auto;"></div>
    <a href="https://dstudio.company" target="_blank" class="dstudio-cta-btn anim d2">Discuter avec D-Studio</a>
  </div>
</section>`;
}

const generators = {
  hero: slideHero,
  gap: slideGap,
  cards: slideCards,
  proposition: slideProposition,
  stats: slideStats,
  cta: slideCTA,
  custom: slideCustom,
};

// ─── Build slides ───

const configSlides = (config.slides || [])
  .map((s, i) => {
    const gen = generators[s.type];
    if (!gen) {
      console.warn(`Unknown slide type "${s.type}" at index ${i}, skipping.`);
      return "";
    }
    return `<!-- Slide ${i + 1} · ${s.type} -->${gen(s)}`;
  })
  .filter(Boolean)
  .join("\n\n");

// Auto-append D-Studio CTA as last slide
const slides = configSlides + "\n\n" + slideDStudioCTA();

// ─── Accent color ───

const accentColor = config.clientColor || "rgba(74,222,128,0.6)";

// ─── Template ───

const html = `<!DOCTYPE html>
<html lang="${config.lang || "fr"}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>D-Studio — ${config.client}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap" rel="stylesheet" />

<style>
*{margin:0;padding:0;box-sizing:border-box;}
:root{--bg:#000;--card:rgba(8,8,8,0.95);--border:rgba(255,255,255,0.08);--border-strong:rgba(255,255,255,0.14);--muted:rgba(255,255,255,0.35);--muted2:rgba(255,255,255,0.55);--r:16px;--accent:${accentColor};--ease-spring:cubic-bezier(0.22,1,0.36,1);--ease-out:cubic-bezier(0,0,0.2,1);--dur-base:200ms;--dur-moderate:300ms;--dur-slow:500ms;--shadow-glass:0 8px 32px rgba(0,0,0,0.15),inset 0 0 0 1px rgba(255,255,255,0.05);--shadow-glass-glow:0 0 40px rgba(180,140,255,0.08),0 8px 32px rgba(0,0,0,0.3);}
html{background:#000;color:#fff;font-family:'Inter',system-ui,sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased;scroll-snap-type:y proximity;scroll-behavior:smooth;}
body{background:#000;}
.deck{max-width:1200px;margin:0 auto;width:100%;position:relative;z-index:1;}
section{text-align:left;padding:80px 60px;min-height:80vh;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:visible;scroll-snap-align:start;scroll-snap-stop:normal;}
section:first-child{min-height:100dvh;}
h1,h2,h3{color:#fff;text-transform:none;margin:0;}
p,li{color:var(--muted2);margin:0;}
#bg-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.35;}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
@keyframes glow{0%,100%{opacity:0.3;}50%{opacity:0.6;}}
@keyframes scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
@keyframes borderPulse{0%,100%{border-color:rgba(255,255,255,0.06);}50%{border-color:rgba(255,255,255,0.16);}}
@keyframes gradientRotate{from{--gradient-angle:0deg;}to{--gradient-angle:360deg;}}
@property --gradient-angle{syntax:"<angle>";initial-value:90deg;inherits:false;}
.anim{opacity:0;transform:translateY(28px);transition:opacity var(--dur-slow) var(--ease-spring),transform var(--dur-slow) var(--ease-spring);}
.anim.visible{opacity:1;transform:translateY(0);}
.d1{transition-delay:0.08s;}.d2{transition-delay:0.16s;}.d3{transition-delay:0.24s;}.d4{transition-delay:0.32s;}.d5{transition-delay:0.4s;}.d6{transition-delay:0.48s;}
.card{position:relative;background:var(--card);border-radius:var(--r);border:1px solid var(--border);padding:18px 20px;animation:borderPulse 5s ease infinite;box-shadow:var(--shadow-glass);transition:border-color var(--dur-base) var(--ease-out),transform var(--dur-base) var(--ease-out);}
.card:hover{border-color:rgba(255,255,255,0.14);transform:translateY(-1px);}
.card::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:0.5px;background:linear-gradient(165deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0) 45%,rgba(255,255,255,0.08) 80%,rgba(255,255,255,0) 100%);opacity:0.5;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;pointer-events:none;transition:opacity var(--dur-moderate) var(--ease-out);}
.card:hover::before{opacity:0.8;}
.orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;animation:glow 6s ease-in-out infinite;}
.orb-1{width:400px;height:400px;background:rgba(255,255,255,0.02);top:-100px;right:-100px;}
.orb-2{width:300px;height:300px;background:rgba(255,255,255,0.012);bottom:-50px;left:-80px;animation-delay:2.5s;}
.label{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.28);}
.title-xl{font-size:clamp(32px,5.5vw,72px);font-weight:800;line-height:1.02;letter-spacing:-0.035em;color:#fff;}
.title-lg{font-size:clamp(24px,3.8vw,50px);font-weight:700;line-height:1.1;letter-spacing:-0.028em;color:#fff;}
.body-md{font-size:clamp(13px,1.4vw,17px);line-height:1.65;color:var(--muted2);}
.stat-big{font-size:clamp(28px,4vw,56px);font-weight:800;letter-spacing:-0.03em;color:#fff;line-height:1;}
.stat-label{font-size:11px;color:rgba(255,255,255,0.3);margin-top:6px;}
.pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:9999px;border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;backdrop-filter:blur(12px);background:rgba(255,255,255,0.03);}
.tag-w{display:inline-block;padding:3px 12px;border-radius:9999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.6);font-size:11px;font-weight:600;}
.tag-g{display:inline-block;padding:3px 12px;border-radius:9999px;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.18);color:rgba(74,222,128,0.85);font-size:11px;font-weight:600;}
.tag-r{display:inline-block;padding:3px 12px;border-radius:9999px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.18);color:rgba(248,113,113,0.85);font-size:11px;font-weight:600;}
.chev{color:rgba(255,255,255,0.15);margin:0 6px;}
.divider{width:36px;height:1px;background:rgba(255,255,255,0.12);margin:18px 0;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;}
.col{display:flex;flex-direction:column;gap:8px;}
.row{display:flex;gap:10px;align-items:flex-start;}
.flex-c{display:flex;align-items:center;gap:8px;}
.card-title{font-size:13px;font-weight:600;color:#fff;margin-bottom:6px;}
.card-body{font-size:12px;line-height:1.6;color:rgba(255,255,255,0.42);}
.list-item{display:flex;gap:10px;align-items:flex-start;padding:12px 16px;border-radius:12px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.05);transition:all var(--dur-base) var(--ease-out);}
.list-item:hover{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.1);}
.dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.25);margin-top:6px;flex-shrink:0;}
.dot-g{background:rgba(74,222,128,0.6);}
.dot-r{background:rgba(248,113,113,0.6);}
.num{font-size:11px;font-weight:700;color:rgba(255,255,255,0.18);min-width:20px;}
.progress-bar{height:3px;border-radius:9999px;background:rgba(255,255,255,0.06);margin-top:10px;overflow:hidden;}
.progress-fill{height:100%;border-radius:9999px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform 1.2s var(--ease-spring);}
.visible .progress-fill{transform:scaleX(1);}
.scanline{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.03),transparent);animation:scanline 8s linear infinite;pointer-events:none;}
.dstudio-cta-btn{display:inline-flex;align-items:center;gap:8px;padding:19px 28px;border-radius:40px;background:rgba(32,32,32,0.2);border:0.4px solid transparent;color:rgba(229,229,229,1);font-size:15px;font-weight:600;text-decoration:none;box-shadow:inset -1px -1px 2px rgba(255,255,255,0.1),inset 1px 1px 2px rgba(255,255,255,0.38),inset 0 0 14px rgba(255,255,255,0.25),0 0 24px rgba(231,221,217,0.2);transition:all var(--dur-moderate) var(--ease-out);background-image:linear-gradient(156.52deg,rgba(255,255,255,0.15) 0%,rgba(255,255,255,0.02) 40%,rgba(255,255,255,0.08) 100%);}
.dstudio-cta-btn:hover{color:#fff;transform:scale(1.02);box-shadow:inset -1px -1px 2px rgba(255,255,255,0.15),inset 1px 1px 2px rgba(255,255,255,0.45),inset 0 0 18px rgba(255,255,255,0.3),0 0 32px rgba(231,221,217,0.3);}
.dstudio-cta-btn:active{transform:scale(0.98);}
@media(max-width:768px){
  html{scroll-snap-type:none;}
  section{padding:48px 20px!important;min-height:auto!important;justify-content:flex-start!important;}
  .grid-2{grid-template-columns:1fr 1fr!important;}
  .grid-3,.grid-4{grid-template-columns:1fr 1fr!important;}
  .title-xl{font-size:28px!important;}
  .title-lg{font-size:22px!important;}
  .stat-big{font-size:24px!important;}
  .card{padding:14px 16px!important;border-radius:12px!important;}
  .orb{display:none;}
}
@media(max-width:480px){
  section{padding:36px 16px!important;}
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr!important;}
}
@media print{
  #bg-canvas,.orb,.scanline,a[href="../"]{display:none!important;}
  section{page-break-after:always;}
  *{print-color-adjust:exact;-webkit-print-color-adjust:exact;}
}
</style>
</head>
<body>

<canvas id="bg-canvas"></canvas>
<a href="../" style="position:fixed;top:14px;left:14px;z-index:9999;display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:100px;background:rgba(11,10,12,0.55);backdrop-filter:blur(16px) saturate(150%) brightness(1.1);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.55);font-size:11px;font-weight:600;text-decoration:none;letter-spacing:.04em;transition:all 0.2s;">&#8592; Accueil</a>
<div class="deck">

${slides}

</div>

<script>
(function(){const c=document.getElementById('bg-canvas'),x=c.getContext('2d');let W,H,p=[];function r(){W=c.width=innerWidth;H=c.height=innerHeight;}function P(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.r=Math.random()*1.5+.3;this.a=Math.random()*.4+.1;}function init(){r();p=Array.from({length:80},()=>new P);}function draw(){x.clearRect(0,0,W,H);for(let i=0;i<p.length;i++){let a=p[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;x.beginPath();x.arc(a.x,a.y,a.r,0,Math.PI*2);x.fillStyle='rgba(255,255,255,'+a.a+')';x.fill();for(let j=i+1;j<p.length;j++){let b=p[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.strokeStyle='rgba(255,255,255,'+(0.06*(1-d/120))+')';x.stroke();}}}requestAnimationFrame(draw);}addEventListener('resize',r);init();draw();})();
/* IntersectionObserver for scroll animations */
const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.anim').forEach(el=>obs.observe(el));
<\/script>
</body>
</html>`;

// ─── Write output ───

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html, "utf-8");
console.log(`Generated: ${outPath} (${(config.slides || []).length + 1} slides, including D-Studio CTA)`);

// ─── Also update dashboard if --update-dashboard flag ───

if (args.includes("--update-dashboard")) {
  console.log("Dashboard auto-update: manually add the card to index.html");
}
