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
  return `
<section>
  <div class="orb orb-1" style="opacity:0.4;"></div>
  <div class="orb orb-2"></div>
  <div class="scanline"></div>
  <div style="display:flex;flex-direction:column;gap:24px;max-width:800px;position:relative;z-index:1;">
    <div class="flex-c anim-fadeup">
      <span class="logo">D<span>.</span>STUDIO</span>
      <span class="chev">›</span>
      <span class="pill">${config.date || ""}</span>
    </div>
    <div>
      <div class="label anim-fadeup d1" style="margin-bottom:14px;">${s.label || config.client}</div>
      <div class="title-xl anim-fadeup d2">${s.title}</div>
    </div>
    <div class="divider anim-fadeup d3"></div>
    <p class="body-md anim-fadeup d4" style="max-width:540px;">${s.body || ""}</p>
    ${tags ? `<div class="flex-c anim-fadeup d5" style="flex-wrap:wrap;gap:8px;">${tags}</div>` : ""}
  </div>
</section>`;
}

function slideGap(s) {
  function renderColumn(col) {
    const dotClass = col.type === "good" ? "dot-g" : "dot-r";
    const items = (col.items || [])
      .map((item) => `          <div class="list-item fragment fade-up"><div class="dot ${dotClass}"></div><div class="card-body">${item}</div></div>`)
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
      <div class="label anim-fadeup" style="margin-bottom:10px;">${s.label || "Le gap"}</div>
      <div class="title-lg anim-fadeup d1">${s.title}</div>
    </div>
    <div class="grid-2 anim-fadeup d2">
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
      return `      <div class="card fragment fade-up" ${style ? `style="${style}"` : ""}><div class="card-title" ${titleColor ? `style="${titleColor}"` : ""}>${c.title}</div><div class="card-body" style="margin-top:5px;">${c.body}</div></div>`;
    })
    .join("\n");

  return `
<section>
  <div style="display:flex;flex-direction:column;gap:18px;position:relative;z-index:1;">
    <div>
      <div class="label anim-fadeup" style="margin-bottom:10px;">${s.label || ""}</div>
      <div class="title-lg anim-fadeup d1">${s.title}</div>
    </div>
    <div class="${s.grid || "col"} anim-fadeup d2" style="gap:10px;">
${cards}
    </div>
  </div>
</section>`;
}

function slideProposition(s) {
  const items = (s.items || [])
    .map((item, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `      <div class="list-item fragment fade-up" style="justify-content:space-between;align-items:center;"><div class="row" style="gap:12px;"><div class="num">${num}</div><div><div class="card-title">${item.title}</div><div class="card-body">${item.body}</div></div></div>${item.duration ? `<span class="tag-w" style="white-space:nowrap;">${item.duration}</span>` : ""}</div>`;
    })
    .join("\n");

  return `
<section>
  <div style="display:flex;flex-direction:column;gap:16px;position:relative;z-index:1;">
    <div>
      <div class="label anim-fadeup" style="margin-bottom:10px;">${s.label || "Notre proposition"}</div>
      <div class="title-lg anim-fadeup d1">${s.title}</div>
    </div>
    <div class="col anim-fadeup d2" style="gap:7px;">
${items}
    </div>
  </div>
</section>`;
}

function slideStats(s) {
  const stats = (s.stats || [])
    .map((st) => `      <div class="card fragment fade-up" style="text-align:center;padding:22px;"><div class="stat-big" style="font-size:34px;">${st.value}</div><div class="stat-label">${st.label}</div><div class="progress-bar" style="margin-top:14px;"><div class="progress-fill"></div></div></div>`)
    .join("\n");

  return `
<section>
  <div style="display:flex;flex-direction:column;gap:18px;position:relative;z-index:1;">
    <div class="orb orb-1" style="opacity:0.3;"></div>
    <div>
      <div class="label anim-fadeup" style="margin-bottom:10px;">${s.label || ""}</div>
      <div class="title-lg anim-fadeup d1">${s.title}</div>
    </div>
    <div class="${s.grid || "grid-2"} anim-fadeup d2">
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
      <div class="label anim-fadeup" style="margin-bottom:14px;">${s.label || "Pour démarrer"}</div>
      <div class="title-xl anim-fadeup d1">${s.title}</div>
    </div>
    <div class="divider anim-fadeup d2"></div>
    <div class="grid-2 anim-fadeup d3">
${offers}
    </div>
    <div class="card anim-fadeup d4" style="padding:16px 20px;">
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
      <div class="label anim-fadeup" style="margin-bottom:10px;">${s.label || ""}</div>
      <div class="title-lg anim-fadeup d1">${s.title}</div>
    </div>
    <div class="anim-fadeup d2">
      ${s.html || ""}
    </div>
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

const slides = (config.slides || [])
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

// ─── Template ───

const html = `<!DOCTYPE html>
<html lang="${config.lang || "fr"}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>D-Studio — ${config.client}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reset.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.css" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap" rel="stylesheet" />

<style>
:root{--bg:#000;--card:rgba(14,13,16,0.9);--border:rgba(255,255,255,0.08);--border-strong:rgba(255,255,255,0.14);--muted:rgba(255,255,255,0.35);--muted2:rgba(255,255,255,0.55);--r:12px;}
.reveal-viewport,.reveal,.reveal .slides{background:#000!important;font-family:'Inter',system-ui,sans-serif!important;color:#fff!important;}
.reveal .slides section{text-align:left;padding:0 60px;height:100%;display:flex!important;flex-direction:column;justify-content:center;overflow:hidden;}
.reveal h1,.reveal h2,.reveal h3{color:#fff;text-transform:none;margin:0;}
.reveal p,.reveal li{color:var(--muted2);margin:0;}
.reveal .progress{background:rgba(255,255,255,0.04);}
.reveal .progress span{background:rgba(255,255,255,0.25);}
.reveal .controls button{color:rgba(255,255,255,0.2);}
#bg-canvas{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.4;}
.reveal .slides{position:relative;z-index:1;}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes glow{0%,100%{opacity:0.3;}50%{opacity:0.7;}}
@keyframes scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
@keyframes pulseRing{0%{transform:scale(1);opacity:0.6;}100%{transform:scale(2.5);opacity:0;}}
@keyframes countUp{from{opacity:0;transform:scale(0.8);}to{opacity:1;transform:scale(1);}}
@keyframes borderPulse{0%,100%{border-color:rgba(255,255,255,0.08);}50%{border-color:rgba(255,255,255,0.22);}}
.anim-fadeup{animation:fadeUp 0.7s ease both;}
.anim-fadein{animation:fadeIn 0.5s ease both;}
.d1{animation-delay:0.1s;}.d2{animation-delay:0.2s;}.d3{animation-delay:0.3s;}.d4{animation-delay:0.4s;}.d5{animation-delay:0.5s;}.d6{animation-delay:0.6s;}
.glass,.card{position:relative;background:var(--card);border-radius:var(--r);border:1px solid var(--border);animation:borderPulse 4s ease infinite;}
.glass::before,.card::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(145deg,rgba(255,255,255,0.16) 0%,rgba(255,255,255,0.03) 50%,rgba(255,255,255,0.12) 100%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude;pointer-events:none;}
.orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0;animation:glow 5s ease-in-out infinite;}
.orb-1{width:400px;height:400px;background:rgba(255,255,255,0.025);top:-100px;right:-100px;}
.orb-2{width:300px;height:300px;background:rgba(255,255,255,0.015);bottom:-50px;left:-80px;animation-delay:2s;}
.label{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,0.28);}
.title-xl{font-size:clamp(38px,5.5vw,72px);font-weight:800;line-height:1.02;letter-spacing:-0.035em;color:#fff;}
.title-lg{font-size:clamp(26px,3.8vw,50px);font-weight:700;line-height:1.1;letter-spacing:-0.028em;color:#fff;}
.body-md{font-size:clamp(13px,1.4vw,17px);line-height:1.65;color:var(--muted2);}
.stat-big{font-size:clamp(30px,4vw,56px);font-weight:800;letter-spacing:-0.03em;color:#fff;line-height:1;}
.stat-label{font-size:11px;color:rgba(255,255,255,0.3);margin-top:4px;}
.pill{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:100px;border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.5);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase;}
.tag-w{display:inline-block;padding:2px 10px;border-radius:100px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.6);font-size:11px;font-weight:600;}
.tag-g{display:inline-block;padding:2px 10px;border-radius:100px;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.2);color:rgba(74,222,128,0.85);font-size:11px;font-weight:600;}
.tag-r{display:inline-block;padding:2px 10px;border-radius:100px;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.2);color:rgba(248,113,113,0.85);font-size:11px;font-weight:600;}
.logo{font-size:20px;font-weight:900;letter-spacing:-0.04em;color:#fff;}
.logo span{color:rgba(255,255,255,0.3);}
.chev{color:rgba(255,255,255,0.2);margin:0 6px;}
.divider{width:36px;height:1px;background:rgba(255,255,255,0.14);margin:18px 0;}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.grid-4{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;}
.col{display:flex;flex-direction:column;gap:8px;}
.row{display:flex;gap:10px;align-items:flex-start;}
.flex-c{display:flex;align-items:center;gap:8px;}
.card{padding:18px 20px;}
.card-title{font-size:13px;font-weight:600;color:#fff;margin-bottom:5px!important;}
.card-body{font-size:12px;line-height:1.55;color:rgba(255,255,255,0.42);}
.list-item{display:flex;gap:10px;align-items:flex-start;padding:10px 14px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);transition:background 0.2s,border-color 0.2s;}
.list-item:hover{background:rgba(255,255,255,0.06);border-color:rgba(255,255,255,0.12);}
.dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.25);margin-top:6px;flex-shrink:0;}
.dot-g{background:rgba(74,222,128,0.6);}
.dot-r{background:rgba(248,113,113,0.6);}
.num{font-size:11px;font-weight:700;color:rgba(255,255,255,0.18);min-width:20px;}
.progress-bar{height:3px;border-radius:100px;background:rgba(255,255,255,0.06);margin-top:8px;overflow:hidden;}
.progress-fill{height:100%;border-radius:100px;background:linear-gradient(90deg,rgba(255,255,255,0.5),rgba(255,255,255,0.15));transform:scaleX(0);transform-origin:left;transition:transform 1s ease 0.5s;}
.reveal .present .progress-fill{transform:scaleX(1);}
.reveal .fragment{transition:all 0.4s ease;}
.reveal .fragment.fade-up{transform:translateY(16px);opacity:0;}
.reveal .fragment.fade-up.visible{transform:translateY(0);opacity:1;}
.counter{display:inline-block;animation:countUp 0.6s ease both;}
.scanline{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent);animation:scanline 8s linear infinite;pointer-events:none;}
.pulse-ring{position:absolute;border-radius:50%;border:1px solid rgba(255,255,255,0.15);animation:pulseRing 2.5s ease-out infinite;}
@media(max-width:768px){
  .reveal .slides section{padding:16px 18px!important;justify-content:flex-start!important;padding-top:28px!important;}
  .grid-2,.grid-3,.grid-4{grid-template-columns:1fr!important;}
  .title-xl{font-size:28px!important;}
  .title-lg{font-size:22px!important;}
  .stat-big{font-size:26px!important;}
  .card{padding:12px 14px!important;}
  .orb{display:none;}
}
@media(max-width:480px){
  .grid-3{grid-template-columns:1fr 1fr!important;}
  .grid-4{grid-template-columns:1fr 1fr!important;}
}
</style>
</head>
<body>

<canvas id="bg-canvas"></canvas>
<a href="../" style="position:fixed;top:14px;left:14px;z-index:9999;display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:100px;background:rgba(0,0,0,0.7);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.55);font-size:11px;font-weight:600;text-decoration:none;backdrop-filter:blur(12px);letter-spacing:.04em;transition:all 0.2s;">&#8592; Accueil</a>
<div class="reveal">
<div class="slides">

${slides}

</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.js"><\/script>
<script>
(function(){const c=document.getElementById('bg-canvas'),x=c.getContext('2d');let W,H,p=[];function r(){W=c.width=innerWidth;H=c.height=innerHeight;}function P(){this.x=Math.random()*W;this.y=Math.random()*H;this.vx=(Math.random()-.5)*.3;this.vy=(Math.random()-.5)*.3;this.r=Math.random()*1.5+.3;this.a=Math.random()*.4+.1;}function init(){r();p=Array.from({length:80},()=>new P);}function draw(){x.clearRect(0,0,W,H);for(let i=0;i<p.length;i++){let a=p[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;x.beginPath();x.arc(a.x,a.y,a.r,0,Math.PI*2);x.fillStyle='rgba(255,255,255,'+a.a+')';x.fill();for(let j=i+1;j<p.length;j++){let b=p[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<120){x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.strokeStyle='rgba(255,255,255,'+(0.06*(1-d/120))+')';x.stroke();}}}requestAnimationFrame(draw);}addEventListener('resize',r);init();draw();})();
Reveal.initialize({hash:true,controls:true,progress:true,center:false,transition:'fade',transitionSpeed:'slow',width:'100%',height:'100%',margin:0,minScale:1,maxScale:1});
<\/script>
</body>
</html>`;

// ─── Write output ───

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html, "utf-8");
console.log(`Generated: ${outPath} (${(config.slides || []).length} slides)`);

// ─── Also update dashboard if --update-dashboard flag ───

if (args.includes("--update-dashboard")) {
  console.log("Dashboard auto-update: manually add the card to index.html");
}
