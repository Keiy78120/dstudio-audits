#!/usr/bin/env node

/**
 * D-Studio Audit Deck Generator v2 (Premium — Lightinderm quality)
 *
 * Generates a pixel-perfect HTML audit deck from a JSON config.
 * Uses Tailwind CDN + Figma DS tokens + gradient borders.
 *
 * Usage:
 *   node generate-audit.mjs audits/lightinderm.json
 *   node generate-audit.mjs audits/lightinderm.json --out lightinderm/index.html
 *
 * JSON config format: see audits/_template.json
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { basename, dirname } from "path";

// ─── CLI ───

const args = process.argv.slice(2);
const configPath = args[0];
if (!configPath) {
  console.error("Usage: node generate-audit.mjs <config.json> [--out <path>]");
  process.exit(1);
}
const outIdx = args.indexOf("--out");
const config = JSON.parse(readFileSync(configPath, "utf-8"));
const slug = config.slug || basename(configPath, ".json");
const outPath = outIdx !== -1 ? args[outIdx + 1] : `${slug}/index.html`;

// ─── SVG Assets ───

const DSTUDIO_LOGO_SVG = `<svg width="232" height="282" viewBox="0 0 103 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M37.399 19.3917C37.8443 19.7141 38.3853 19.8752 38.9335 19.8439C39.3716 19.8656 39.8073 19.7598 40.1903 19.5433C40.4991 19.358 40.681 19.0213 40.6666 18.6605C40.6762 18.4344 40.5781 18.2155 40.4009 18.076C40.1544 17.9004 39.8743 17.7777 39.5798 17.7103C39.204 17.6117 38.6008 17.4698 37.7533 17.2942C37.0519 17.1547 36.3649 16.943 35.7066 16.664C35.1752 16.4306 34.7203 16.0482 34.3996 15.5623C34.0429 14.973 33.8705 14.2898 33.904 13.6019C33.8968 12.8899 34.1171 12.1923 34.5312 11.615C34.9741 11.004 35.5701 10.5229 36.262 10.2198C37.0376 9.87586 37.8778 9.70267 38.7252 9.7147C39.5894 9.70267 40.4464 9.87827 41.2364 10.2319C41.9402 10.5398 42.5506 11.0329 43.0006 11.6583C43.4244 12.25 43.6518 12.962 43.647 13.6885H40.4847C40.4656 13.2819 40.2788 12.8995 39.9748 12.6349C39.6205 12.351 39.1729 12.2091 38.7181 12.2356C38.3255 12.2187 37.9353 12.3174 37.5977 12.5218C37.3153 12.6998 37.1477 13.0198 37.1645 13.3565C37.1525 13.5778 37.2458 13.7919 37.4158 13.9338C37.6576 14.1022 37.9305 14.2225 38.2201 14.2898C38.5864 14.3884 39.1801 14.5255 40.0036 14.6891C40.7169 14.819 41.4135 15.0211 42.0862 15.2929C42.6224 15.5142 43.0844 15.8846 43.4196 16.3585C43.7786 16.9214 43.9558 17.5828 43.9223 18.2516C43.9295 18.9996 43.6996 19.7333 43.2688 20.3443C42.8091 20.9913 42.1843 21.5013 41.459 21.8164C40.6451 22.182 39.7642 22.3624 38.8737 22.3504C37.9496 22.3648 37.0352 22.1772 36.1902 21.7996C35.4409 21.47 34.7921 20.948 34.3062 20.2865C33.8538 19.6659 33.612 18.913 33.6168 18.1409L36.779 18.2107C36.803 18.6749 37.028 19.1079 37.3967 19.3917" fill="white"/><path d="M54.005 9.82068V12.5893H50.668V22.2423H47.4195V12.5893H44.0825V9.82068H54.005Z" fill="white"/><path d="M58.4937 17.0225C58.4458 17.6984 58.6134 18.3743 58.9701 18.9492C59.8271 19.8104 61.2179 19.8128 62.0749 18.9492C62.4316 18.3743 62.5992 17.6984 62.5513 17.0225V9.81824H65.795V16.8469C65.8955 18.3334 65.4095 19.7983 64.4448 20.9265C62.1635 22.8196 58.8672 22.8196 56.5882 20.9265C55.6235 19.7959 55.1376 18.331 55.2381 16.8469V9.81824H58.4865L58.4913 17.0225H58.4937Z" fill="white"/><path d="M72.311 9.81832C73.4505 9.79427 74.5756 10.0709 75.5762 10.6169C76.505 11.1293 77.2687 11.8966 77.7833 12.8251C78.8318 14.8312 78.8318 17.2246 77.7833 19.2283C77.2687 20.1592 76.505 20.9242 75.5762 21.4365C74.5756 21.9826 73.4505 22.2592 72.311 22.2351H67.6646V9.81592H72.311V9.81832ZM74.475 18.6005C75.4996 17.0394 75.4996 15.0164 74.475 13.4553C73.9532 12.7986 73.1465 12.4354 72.311 12.4787H70.9154V19.5771H72.311C73.1465 19.6204 73.9508 19.2572 74.475 18.6005Z" fill="white"/><path d="M83.2485 9.81824H80V22.2399H83.2485V9.81824Z" fill="white"/><path d="M94.1907 21.5229C92.1559 22.6222 89.7094 22.6222 87.6747 21.5229C86.7435 20.9889 85.9798 20.2072 85.4675 19.2618C84.419 17.2365 84.419 14.8262 85.4675 12.8009C85.9798 11.8555 86.7435 11.0714 87.6747 10.5398C89.7094 9.43808 92.1583 9.43808 94.1907 10.5398C95.1219 11.0714 95.8855 11.8555 96.3978 12.8009C97.4463 14.8262 97.4463 17.2365 96.3978 19.2618C95.8855 20.2072 95.1219 20.9913 94.1907 21.5229ZM90.9327 19.6515C91.7633 19.6756 92.5557 19.2955 93.0608 18.6316C94.1309 17.0657 94.1309 14.9994 93.0608 13.4311C92.1081 12.25 90.3845 12.0672 89.2091 13.0246C89.0607 13.1448 88.9242 13.2819 88.8046 13.4311C87.7321 14.997 87.7321 17.0657 88.8046 18.6316C89.3097 19.2979 90.102 19.678 90.9327 19.6515Z" fill="white"/><path d="M101.011 18.4297C101.54 18.4128 102.054 18.6149 102.433 18.9877C103.189 19.7671 103.189 21.0083 102.433 21.7877C101.631 22.5357 100.391 22.5357 99.5864 21.7877C98.8299 21.0083 98.8299 19.7671 99.5864 18.9877C99.9646 18.6149 100.479 18.4128 101.008 18.4297" fill="white"/><path d="M24.525 22.2638C25.2838 21.5229 25.8966 20.6449 26.3275 19.6731C26.0953 21.3642 25.6213 23.0143 24.9247 24.5706C23.9169 26.875 22.2364 28.8162 20.1011 30.1343C17.7958 31.4693 15.1674 32.1332 12.5078 32.0539H7.63397C7.92842 31.2865 8.07683 30.4687 8.06726 29.646C8.11035 27.9743 7.45683 26.3626 6.26469 25.196C5.06059 24.0101 3.42799 23.3703 1.74511 23.4184C1.15623 23.4136 0.569735 23.4833 0 23.6228V0.00638118H12.5054C15.1483 -0.0705924 17.7671 0.550007 20.0963 1.80323C22.2149 3.02278 23.9025 4.87977 24.9199 7.11201C25.7171 8.84872 26.2222 10.7057 26.4185 12.606C25.9852 11.5452 25.3389 10.5878 24.5226 9.78925C22.8349 8.1271 20.5488 7.22987 18.186 7.30204C15.8233 7.22987 13.5348 8.1295 11.8495 9.79165C10.1786 11.4273 9.26418 13.6884 9.32403 16.0313C9.26179 18.3742 10.1786 20.6353 11.8495 22.2686C13.5348 23.9331 15.8233 24.8328 18.186 24.763C20.5488 24.8328 22.8349 23.9331 24.5226 22.2686" fill="white"/></svg>`;

// ─── Helpers ───

function esc(s) { return (s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function raw(s) { return s || ""; } // allow HTML in content fields

// ─── Slide Generators ───

function slideHero(s) {
  const clientLogo = config.clientLogo
    ? `<div class="fade-up"><img src="${config.clientLogo}" alt="${esc(config.client)}" class="h-[60px] object-contain" onerror="this.style.display='none'" /></div>`
    : `<div class="fade-up"><span class="font-bold text-[36px] text-white tracking-tight">${esc(config.client)}</span></div>`;

  const tabs = (s.tags || [])
    .map(t => `<div class="tab-pill"><span>${raw(t)}</span></div>`)
    .join("\n          ");

  const heroImg = config.heroImage || s.image;
  const heroBg = heroImg
    ? `
    <!-- Hero Image: full-bleed background, full height -->
    <img src="${heroImg}" alt="${esc(config.client)}" style="position:absolute; inset:0; height:100%; width:100%; object-fit:cover; object-position:center 58%; z-index:0;" />
    <div style="position:absolute; inset:0; background:linear-gradient(to bottom, #000 0%, #000 calc(32% - 10px), rgba(0,0,0,0.85) calc(44% - 10px), rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 88%, #000 100%); pointer-events:none; z-index:1;"></div>`
    : "";

  return `
<section class="slide bg-black flex flex-col items-center justify-start relative overflow-hidden" id="slide-0">
  ${heroBg}
  <div class="slide-content w-full max-w-[1440px] mx-auto flex flex-col items-center relative z-[2]">
    <div class="flex flex-col items-center gap-[25px] pt-[72px] w-[742px] max-w-full px-4">
      ${clientLogo}
      <div class="fade-up flex flex-col items-center gap-[24px] w-full" style="transition-delay:0.2s">
        <h1 class="font-bold text-[36px] leading-[46px] text-white text-center w-full">${raw(s.title)}</h1>
        <p class="text-[17px] text-[#c7c7cc] text-center w-full leading-normal max-w-[620px]">${raw(s.body || "")}</p>
      </div>
      <div class="fade-up flex flex-wrap justify-center gap-[8px]" style="transition-delay:0.1s">
        ${tabs}
      </div>
    </div>
  </div>
</section>`;
}

function slideStats(s) {
  const cards = (s.stats || [])
    .map(st => `
      <div class="stat-card-outer">
        <div class="stat-card-inner">
          <div class="font-bold text-[38px] text-white leading-normal w-full counter-value">${raw(st.value)}</div>
          <div class="font-medium text-[16px] text-[rgba(255,255,255,0.84)] w-full uppercase">${raw(st.label)}</div>
        </div>
      </div>`)
    .join("\n");

  return `
<section class="slide bg-black flex flex-col items-center justify-center">
  <div class="slide-content w-full max-w-[1209px] mx-auto flex flex-col items-center justify-center px-6 h-full">
    <div class="flex flex-col items-center gap-[34px]">
      <div class="fade-up badge">${raw(s.label || "EN CHIFFRES")}</div>
      <h2 class="fade-up font-bold text-[38px] text-[#efefef] text-center leading-normal" style="transition-delay:0.1s">${raw(s.title)}</h2>
    </div>
    <div class="fade-up grid grid-cols-2 md:grid-cols-${Math.min((s.stats || []).length, 4)} gap-[20px] md:gap-[31px] mt-[50px] md:mt-[66px] w-full" style="transition-delay:0.2s">
      ${cards}
    </div>
  </div>
</section>`;
}

function slideGap(s) {
  function renderColumn(col) {
    const isGood = col.type === "good";
    const cardClass = isGood ? "gap-card-green" : "gap-card-red";
    const badgeColor = isGood ? "text-[rgba(77,127,74,0.7)]" : "text-[rgba(171,92,92,0.7)]";
    const textColor = isGood ? "text-[#c7c7cc]" : "text-[#7c7c80]";

    const items = (col.items || [])
      .map(item => `<div class="gap-item gb-card"><span class="${textColor} text-[15px]">${raw(item)}</span></div>`)
      .join("\n            ");

    return `
      <div class="flex flex-col items-center flex-1 min-w-0">
        <div class="gap-badge mb-[-16px] relative z-10">
          <span class="${badgeColor}">${raw(col.title)}</span>
        </div>
        <div class="${cardClass} pt-[40px] pb-[20px] px-[24px] w-full flex-1">
          <div class="flex flex-col gap-[12px] w-full">
            ${items}
          </div>
        </div>
      </div>`;
  }

  const cols = (s.columns || []).map(renderColumn).join("\n");

  return `
<section class="slide bg-black flex flex-col items-center justify-center">
  <div class="slide-content w-full max-w-[1209px] mx-auto flex flex-col items-center px-6 h-full justify-center">
    <div class="flex flex-col items-center gap-[34px] mb-[66px]">
      <div class="fade-up badge">${raw(s.label || "LE GAP")}</div>
      <h2 class="fade-up font-bold text-[36px] text-[#efefef] text-center leading-normal" style="transition-delay:0.1s">${raw(s.title)}</h2>
    </div>
    <div class="fade-up flex flex-col md:flex-row gap-[36px] items-stretch justify-center w-full max-w-[1100px]" style="transition-delay:0.2s">
      ${cols}
    </div>
  </div>
</section>`;
}

function slideCards(s) {
  const grid = s.grid || "col";
  const isCol = grid === "col";

  const cards = (s.cards || [])
    .map(c => {
      if (isCol) {
        // Opportunity card style (centered, glass)
        return `
      <div class="opp-card">
        <h3 class="font-bold text-[21px] text-[#c7c7cc] text-center w-full">${raw(c.title)}</h3>
        <p class="text-[17px] text-[#a3a3ae] text-center w-full">${raw(c.body)}</p>
      </div>`;
      } else {
        // Bench card style (left-aligned, compact)
        return `
      <div class="bench-card">
        <h3 class="font-bold text-[21px] text-[#c7c7cc] w-full">${raw(c.title)}</h3>
        <p class="text-[17px] text-[#a3a3ae] w-full leading-normal">${raw(c.body)}</p>
      </div>`;
      }
    })
    .join("\n");

  const containerClass = isCol
    ? "flex flex-col gap-[19px] w-full max-w-[819px]"
    : `grid ${grid} gap-[19px] w-full`;

  // When an intro is present, tighten header gap and add the intro paragraph.
  // Without intro, keep the original spacing so existing decks stay byte-identical.
  const headerGap = s.intro ? "gap-[20px] mb-[50px]" : "gap-[34px] mb-[66px]";
  const intro = s.intro
    ? `\n      <p class="fade-up text-[17px] text-[#a3a3ae] text-center leading-normal max-w-[800px] mx-auto" style="transition-delay:0.15s">${raw(s.intro)}</p>`
    : "";

  return `
<section class="slide bg-black flex flex-col items-center justify-center">
  <div class="slide-content w-full max-w-[1209px] mx-auto flex flex-col items-center justify-center px-6 h-full">
    <div class="flex flex-col items-center ${headerGap}">
      <div class="fade-up badge">${raw(s.label || "")}</div>
      <h2 class="fade-up font-bold text-[36px] text-[#efefef] text-center leading-normal" style="transition-delay:0.1s">${raw(s.title)}</h2>${intro}
    </div>
    <div class="fade-up ${containerClass}" style="transition-delay:0.2s">
      ${cards}
    </div>
  </div>
</section>`;
}

function slideBenchmark(s) {
  const img = s.image || config.benchmarkImage || "";
  const imgHtml = img
    ? `
      <div class="benchmark-image flex-shrink-0 relative" style="margin-right:-60px; margin-left:-40px; z-index:1;">
        <div class="relative w-[560px] h-[400px] rounded-[28px]" style="padding:8px; box-shadow: 0 0 0 2px rgba(255,255,255,0.25);">
          <div style="position:absolute; inset:0; border-radius:28px; padding:8px; background:linear-gradient(180deg, rgba(207,207,207,0.59) 0%, rgba(105,105,105,0.30) 50%, rgba(105,105,105,0.41) 100%); -webkit-mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite:exclude; pointer-events:none; z-index:1;"></div>
          <img src="${img}" alt="Benchmark" class="w-full h-full object-cover object-center rounded-[20px]" />
        </div>
      </div>`
    : "";

  const cards = (s.cards || [])
    .map(c => `
          <div class="bench-card">
            <h3 class="font-bold text-[21px] text-[#c7c7cc] w-full">${raw(c.title)}</h3>
            <p class="text-[17px] text-[#a3a3ae] w-full leading-normal">${raw(c.body)}</p>
          </div>`)
    .join("\n");

  return `
<section class="slide bg-black flex flex-col items-center justify-center">
  <div class="slide-content w-full max-w-[1100px] mx-auto flex flex-col items-center justify-center px-6 h-full overflow-visible">
    <div class="fade-up flex flex-col md:flex-row items-center w-full" style="transition-delay:0.1s">
      ${imgHtml}
      <div class="benchmark-text flex flex-col gap-[30px] flex-1 min-w-0 relative z-[2]">
        <div class="flex flex-col gap-[16px] items-start" ${img ? 'style="padding-left:100px;"' : ""}>
          <div class="badge">${raw(s.label || "BENCHMARK")}</div>
          <h2 class="font-bold text-[42px] text-[#efefef] leading-[1.1]">${raw(s.title)}</h2>
        </div>
        <div class="flex flex-col gap-[19px] w-full">
          ${cards}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function slideProposition(s) {
  const items = (s.items || [])
    .map((item, i) => {
      const num = String(i + 1).padStart(2, "0");
      return `
          <div class="prop-item">
            <div class="prop-icon">
              <span class="number-gradient">${num}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-[21px] text-[#c7c7cc] leading-normal">${raw(item.title)}</h3>
              <p class="text-[17px] text-[#a3a3ae] leading-normal mt-[10px]">${raw(item.body)}</p>
            </div>
            ${item.duration ? `<span class="duration-badge">${raw(item.duration)}</span>` : ""}
          </div>`;
    })
    .join("\n");

  return `
<section class="slide bg-black flex flex-col items-center justify-center">
  <div class="slide-content w-full max-w-[1440px] mx-auto flex flex-col items-center justify-center px-6 h-full">
    <div class="fade-up w-full max-w-[1104px]">
      <div class="flex justify-center" style="position:relative; z-index:2; margin-bottom:-20px;">
        <div class="badge">${raw(s.label || "NOTRE PROPOSITION")}</div>
      </div>
      <div class="prop-container" style="padding: 60px 40px 20px;">
        <div class="flex flex-col items-center ${s.intro ? "gap-[20px] " : ""}mb-[40px]">
          <h2 class="font-bold text-[${s.intro ? "42" : "48"}px] text-[#e6e6f1] text-center leading-[1.1]">${raw(s.title)}</h2>${s.intro ? `\n          <p class="text-[16px] text-[#a3a3ae] text-center leading-normal max-w-[760px]">${raw(s.intro)}</p>` : ""}
        </div>
        <div class="flex flex-col gap-[19px] max-w-[838px] mx-auto">
          ${items}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function slideCTA(s) {
  const offers = (s.offers || [])
    .map(o => `
      <div class="stat-card-outer pricing flex-1" style="padding:12px">
        <div class="stat-card-inner">
          <div class="font-medium text-[16px] text-[rgba(255,255,255,0.84)] uppercase w-full">${raw(o.title)}</div>
          <div class="font-bold text-[38px] text-white uppercase leading-normal w-full">${raw(o.price)}</div>
          <p class="text-[17px] text-[#a3a3ae] w-full leading-normal">${raw(o.details)}</p>
        </div>
      </div>`)
    .join("\n");

  return `
<section class="slide bg-black flex flex-col items-center justify-center">
  <div class="slide-content w-full max-w-[1135px] mx-auto flex flex-col items-center justify-center px-6 h-full">
    <div class="flex flex-col items-center gap-[30px]">
      <div class="fade-up badge">${raw(s.label || "POUR DÉMARRER")}</div>
      <h2 class="fade-up font-bold text-[36px] leading-[46px] text-white text-center" style="transition-delay:0.1s">${raw(s.title)}</h2>
    </div>
    <div class="fade-up flex flex-col md:flex-row gap-[31px] w-full mt-[60px]" style="transition-delay:0.2s">
      ${offers}
    </div>
  </div>
</section>`;
}

function slideCustom(s) {
  // Backward-compatible default: emit EXACTLY the original markup unless the new
  // opt-in fields (slideClass / maxWidth / hideHeader) are used. This keeps
  // existing custom-slide decks (stellantis, rexos…) byte-identical.
  const sectionClass = s.slideClass ? `slide ${s.slideClass}` : "slide";
  const maxW = s.maxWidth
    ? ` style="max-width:${s.maxWidth}"`
    : "";
  const maxWClass = s.maxWidth ? "" : "max-w-[1209px] ";
  // Header is rendered unless both label & title are omitted (new "no header" path).
  const hasHeader = s.label !== undefined || s.title !== undefined;
  const header = hasHeader
    ? `
    <div class="flex flex-col items-center gap-[34px] mb-[40px]">
      ${s.label ? `<div class="fade-up badge">${raw(s.label)}</div>` : ""}
      <h2 class="fade-up font-bold text-[36px] text-[#efefef] text-center leading-normal" style="transition-delay:0.1s">${raw(s.title || "")}</h2>
    </div>`
    : "";
  // Content wrapper: original was a bare `fade-up`. New custom slides opt into a
  // full-width centered wrapper via `wrapContent` to host grid/flex layouts.
  const wrapClass = s.wrapContent ? "fade-up w-full flex flex-col items-center" : "fade-up";
  return `
<section class="${sectionClass} bg-black flex flex-col items-center justify-center">
  <div class="slide-content w-full ${maxWClass}mx-auto flex flex-col items-center justify-center px-6 h-full"${maxW}>${header}
    <div class="${wrapClass}" style="transition-delay:0.2s">${raw(s.html || "")}</div>
  </div>
</section>`;
}

function slideClosing() {
  return `
<section class="slide bg-black flex flex-col items-center justify-center">
  <div class="slide-content w-full max-w-[1440px] mx-auto flex flex-col items-center justify-center px-6 h-full gap-[40px]">
    <div class="fade-up">
      <img src="assets/dstudio-logo.svg" alt="D-Studio" class="w-[232px] h-[282px] object-contain" onerror="this.innerHTML='${DSTUDIO_LOGO_SVG.replace(/'/g, "\\'")}'" />
    </div>
    <div class="fade-up flex flex-col items-center gap-[16px] w-[292px]" style="transition-delay:0.1s">
      <span class="font-medium text-[18px] text-[rgba(255,255,255,0.84)] uppercase text-center tracking-wide">D-STUDIO</span>
      <a href="mailto:contact@dstudio.company" class="font-medium text-[18px] text-[rgba(255,255,255,0.84)] uppercase text-center underline hover:text-white transition-colors tracking-wide">CONTACT@DSTUDIO.COMPANY</a>
      <span class="font-medium text-[18px] text-[rgba(255,255,255,0.84)] uppercase text-center tracking-wide">7 RUE LAURISTON, 75016 PARIS</span>
    </div>
    <div class="fade-up" style="transition-delay:0.2s">
      <a href="mailto:contact@dstudio.company" class="cta-button gb-pill">
        <span class="font-medium text-[18px] leading-[24px] text-[#e5e5e5] relative z-10">Discuter avec D-Studio</span>
      </a>
    </div>
  </div>
</section>`;
}

// ─── Product Render (between proposition & CTA) ───

function productRenderSection() {
  const img = config.productRender;
  if (!img) return "";
  return `
<!-- Product Render -->
<div class="flex justify-center items-center bg-black" style="margin-top:-100px; position:relative; z-index:2;">
  <div class="relative w-[700px] max-w-[80%]">
    <img src="${img}" alt="${esc(config.client)}" class="w-full object-contain" />
    <div style="position:absolute; bottom:0; left:0; right:0; height:40%; background:linear-gradient(to top, #000 0%, transparent 100%); pointer-events:none;"></div>
  </div>
</div>`;
}

// ─── Build ───

const generators = {
  hero: slideHero,
  stats: slideStats,
  gap: slideGap,
  cards: slideCards,
  benchmark: slideBenchmark,
  proposition: slideProposition,
  cta: slideCTA,
  custom: slideCustom,
};

const slideCount = (config.slides || []).length + 1; // +1 for closing

// Insert product render after proposition, before CTA
let slidesHtml = "";
for (const [i, s] of (config.slides || []).entries()) {
  const gen = generators[s.type];
  if (!gen) { console.warn(`Unknown slide type "${s.type}" at index ${i}, skipping.`); continue; }
  slidesHtml += `\n<!-- Slide ${i + 1}: ${s.type} -->${gen(s)}`;
  // Insert product render after proposition
  if (s.type === "proposition" && config.productRender) {
    slidesHtml += productRenderSection();
  }
}
slidesHtml += `\n<!-- Closing -->${slideClosing()}`;

// Nav dots
const navDots = Array.from({ length: slideCount }, (_, i) =>
  `  <div class="nav-dot${i === 0 ? " active" : ""}" data-slide="${i}"></div>`
).join("\n");

// ─── CSS Template (Lightinderm quality) ───

const CSS = `
/* ═══ DESIGN TOKENS (Figma DS) ═══ */
:root {
  --bg-primary: #000000;
  --bg-card: #141415;
  --bg-card-glass: rgba(24,24,26,0.58);
  --bg-card-muted: rgba(28,28,30,0.43);
  --bg-elevated: #202020;
  --text-primary: #FFFFFF;
  --text-heading: #EFEFEF;
  --text-heading-alt: #E6E6F1;
  --text-secondary: #C7C7CC;
  --text-muted: #A3A3AE;
  --text-nav: #E5E5E5;
  --border-primary: rgba(255,255,255,0.4);
  --border-subtle: rgba(54,54,54,0.8);
  --border-muted: rgba(54,52,59,0.2);
  --border-card-accent: rgba(255,255,255,0.24);
  --radius-pill: 40px;
  --radius-card: 33px;
  --radius-inner: 21px;
  --radius-badge: 16px;
  --radius-tag: 14px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

/* ═══ GRADIENT BORDER UTILITIES ═══ */
.gb-pill { position: relative; border: none; }
.gb-pill::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(157deg, rgba(255,255,255,0.40) 2.12%, rgba(255,255,255,0) 39%, rgba(255,255,255,0) 54.33%, rgba(255,255,255,0.10) 93.02%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
.gb-card { position: relative; border: none; }
.gb-card::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(159deg, rgba(255,255,255,0.05) 1.69%, rgba(255,255,255,0.50) 37.46%, rgba(255,255,255,0.01) 88.2%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
.gb-accent { position: relative; border: none; }
.gb-accent::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(152deg, rgba(255,255,255,0.65) 32.68%, rgba(255,255,255,0) 98.12%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}

/* ═══ BASE ═══ */
html {
  background: var(--bg-primary);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
}
body {
  overflow-x: hidden;
  scroll-snap-type: y proximity;
  height: 100vh;
  overflow-y: auto;
}
.slide {
  scroll-snap-align: start;
  min-height: 100vh;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
.slide-content { position: relative; z-index: 10; }

/* ═══ PROGRESS BAR ═══ */
#progress-bar {
  position: fixed; top: 0; left: 0; height: 2px;
  background: linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
  z-index: 100; transition: width 0.3s ease;
}

/* ═══ NAV DOTS ═══ */
.nav-dots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 12px; z-index: 90;
}
.nav-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,0.2); cursor: pointer; transition: all 0.3s ease;
}
.nav-dot.active { background: rgba(255,255,255,0.8); transform: scale(1.4); }

/* ═══ BADGE ═══ */
.badge {
  background: #141415; border: none; border-radius: var(--radius-badge);
  padding: 9px 18px; font-size: 15px; color: rgba(255,255,255,0.84);
  text-transform: uppercase; font-weight: 500; white-space: nowrap;
  line-height: 20px; display: inline-flex; align-items: center;
  justify-content: center; position: relative;
}
.badge::before {
  content: ''; position: absolute; inset: 0; border-radius: var(--radius-badge); padding: 1px;
  background: linear-gradient(157deg, rgba(255,255,255,0.40) 2.12%, rgba(255,255,255,0) 39%, rgba(255,255,255,0) 54.33%, rgba(255,255,255,0.10) 93.02%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}

/* ═══ TAB PILL ═══ */
.tab-pill {
  background: #141415; border: none; border-radius: 40px;
  padding: 9px 18px; display: inline-flex; align-items: center;
  justify-content: center; position: relative;
}
.tab-pill::before {
  content: ''; position: absolute; inset: 0; border-radius: 40px; padding: 1px;
  background: linear-gradient(157deg, rgba(255,255,255,0.40) 2.12%, rgba(255,255,255,0) 39%, rgba(255,255,255,0) 54.33%, rgba(255,255,255,0.10) 93.02%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
.tab-pill span { font-weight: 500; font-size: 15px; line-height: 20px; color: #e5e5e5; white-space: nowrap; }

/* ═══ STAT CARD (double-frame) ═══ */
.stat-card-outer {
  border: none; border-radius: var(--radius-card); padding: 12px;
  position: relative; overflow: hidden;
  background: var(--bg-card-glass); backdrop-filter: blur(4.5px); -webkit-backdrop-filter: blur(4.5px);
}
.stat-card-outer::before {
  content: ''; position: absolute; inset: 0; border-radius: var(--radius-card); padding: 1px;
  background: linear-gradient(157deg, rgba(255,255,255,0.20) 2.12%, rgba(255,255,255,0) 39%, rgba(255,255,255,0) 54.33%, rgba(255,255,255,0.08) 93.02%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
.stat-card-outer::after {
  content: ''; position: absolute; inset: 0; border-radius: var(--radius-card);
  box-shadow: inset 0 0 14px 0 rgba(111,111,129,0.25); pointer-events: none;
}
.stat-card-inner {
  position: relative;
  background: linear-gradient(to top, rgba(6,6,6,0.6) 0%, rgba(17,17,19,0.3) 83.56%, rgba(27,27,30,0.2) 110%);
  border: none; border-radius: var(--radius-inner); padding: 21px 25px;
  text-align: center; text-transform: uppercase;
  display: flex; flex-direction: column; gap: 17px; align-items: center;
  height: 100%; justify-content: center;
}
.stat-card-outer.pricing .stat-card-inner { padding: 21px 65px; }

/* ═══ OPPORTUNITY CARD ═══ */
.opp-card {
  border-radius: var(--radius-card); padding: 28px; position: relative;
  display: flex; flex-direction: column; gap: 10px; align-items: center;
  box-shadow: 0 0 44px 0 rgba(76,131,83,0.03), 0 0 64px 0 rgba(217,228,231,0.2);
}
.opp-card::before {
  content: ''; position: absolute; inset: 0;
  background: var(--bg-card-muted); border-radius: var(--radius-card); pointer-events: none;
}
.opp-card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: inset -1px -1px 14px 0 rgba(255,255,255,0.07), inset 1px 1px 3px 0 rgba(255,255,255,0.12);
  pointer-events: none;
}
.opp-card > * { position: relative; }

/* ═══ BENCH CARD ═══ */
.bench-card {
  border-radius: var(--radius-card); padding: 28px; position: relative;
  display: flex; flex-direction: column; gap: 10px; min-height: 140px; justify-content: center;
  box-shadow: 0 0 44px 0 rgba(76,131,83,0.03), 0 0 64px 0 rgba(217,228,231,0.2);
}
.bench-card::before {
  content: ''; position: absolute; inset: 0;
  background: rgba(21,21,23,0.74); border-radius: var(--radius-card); pointer-events: none;
}
.bench-card::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: inset -1px -1px 14px 0 rgba(255,255,255,0.07), inset 1px 1px 3px 0 rgba(255,255,255,0.12);
  pointer-events: none;
}
.bench-card > * { position: relative; }

/* ═══ GAP COLUMNS ═══ */
.gap-card-green, .gap-card-red {
  border: none; border-radius: var(--radius-card); position: relative; overflow: hidden;
}
.gap-card-green {
  background: linear-gradient(180deg, rgba(27,37,29,0.2) 0%, rgba(103,139,111,0) 100%),
              linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 100%);
}
.gap-card-red {
  background: linear-gradient(180deg, rgba(37,27,27,0.2) 0%, rgba(0,0,0,0) 100%),
              linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0) 100%);
}
.gap-card-green::before, .gap-card-red::before {
  content: ''; position: absolute; inset: 0; border-radius: var(--radius-card); padding: 1px;
  background: linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none; z-index: 1;
}
.gap-badge {
  background: #141415; border: none; border-radius: 40px; padding: 9px 18px;
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  font-weight: 500; font-size: 15px; line-height: 20px;
}
.gap-badge::before {
  content: ''; position: absolute; inset: 0; border-radius: 40px; padding: 1px;
  background: linear-gradient(157deg, rgba(255,255,255,0.40) 2.12%, rgba(255,255,255,0) 39%, rgba(255,255,255,0) 54.33%, rgba(255,255,255,0.10) 93.02%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
.gap-badge span { position: relative; z-index: 1; }
.gap-item {
  border: none; border-radius: var(--radius-tag); padding: 14px 16px;
  position: relative; text-align: center;
  box-shadow: 0 0 84px 0 rgba(227,221,186,0.1);
}
.gap-item::before {
  content: ''; position: absolute; inset: 0;
  background: rgba(28,28,30,0.53); mix-blend-mode: plus-lighter;
  border-radius: inherit; pointer-events: none;
}

/* ═══ PROPOSITION ═══ */
.prop-container {
  background: linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.81) 53.39%, transparent 100%);
  border-radius: var(--radius-card); border: none; overflow: hidden; position: relative;
}
.prop-container::before {
  content: ''; position: absolute; inset: 0; border-radius: var(--radius-card); padding: 1px;
  background: linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none; z-index: 1;
}
.prop-item {
  border-radius: var(--radius-card); padding: 23px; border: none;
  background: linear-gradient(180deg, rgba(65,36,28,0.09) 11.28%, rgba(13,12,14,0.4) 128.43%);
  display: flex; align-items: center; gap: 30px; position: relative;
}
.prop-item::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
.prop-icon {
  flex-shrink: 0; width: 56px; height: 56px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px; background: rgba(86,79,77,0.24);
  box-shadow: inset 1px 2px 2px rgba(255,255,255,0.67), inset 0 -3px 2px rgba(0,0,0,0.23), inset -2px -2px 2px rgba(229,229,229,0.25);
  overflow: hidden;
}
.number-gradient {
  background-image: linear-gradient(155.68deg, rgba(255,255,255,0.65) 32.68%, rgba(255,255,255,0) 98.12%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  font-size: 27px; font-weight: 700; line-height: normal;
}
.duration-badge {
  position: absolute; top: 13px; right: 14px;
  background: rgba(60,60,67,0.44); border: none; border-radius: var(--radius-tag);
  padding: 5px 13px; font-size: 14px; color: #fff; font-weight: 400;
  box-shadow: 0 1px 6px 0 rgba(0,0,0,0.25);
}
.duration-badge::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px;
  background: linear-gradient(157deg, rgba(255,255,255,0.40) 2.12%, rgba(255,255,255,0) 39%, rgba(255,255,255,0) 54.33%, rgba(255,255,255,0.10) 93.02%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}

/* ═══ CTA BUTTON ═══ */
.cta-button {
  border-radius: var(--radius-pill); padding: 21px 30px; border: none;
  background: #141415; cursor: pointer;
  box-shadow: 0 0 15px 0 rgba(32,16,98,0.35), 0 0 14px 0 rgba(203,186,227,0.1), 0 0 24px 0 rgba(223,217,231,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  text-decoration: none;
}
.cta-button::after {
  content: ''; position: absolute; inset: 0; border-radius: inherit;
  box-shadow: inset -1px -1px 2px 0 rgba(255,255,255,0.1), inset 1px 1px 2px 0 rgba(255,255,255,0.38), inset 0 0 14px 0 rgba(255,255,255,0.25);
  pointer-events: none;
}
.cta-button:hover {
  transform: scale(1.03);
  box-shadow: 0 0 20px 0 rgba(32,16,98,0.45), 0 0 18px 0 rgba(203,186,227,0.15), 0 0 32px 0 rgba(223,217,231,0.3);
}

/* ═══ FADE-UP ANIMATION ═══ */
.fade-up {
  opacity: 0; transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1);
}
.fade-up.visible { opacity: 1; transform: translateY(0); }

/* ═══ PARTICLES ═══ */
#particles {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 1; opacity: 0.3;
}

/* ═══ RESPONSIVE ═══ */
@media (max-width: 768px) {
  .slide { min-height: 100vh; height: auto; scroll-snap-align: start; padding: 40px 0; }
  body { scroll-snap-type: none; }
  .nav-dots { display: none; }
  .badge, .tab-pill, .gap-badge { font-size: 13px; padding: 7px 14px; }
  .gap-item { padding: 10px 12px; font-size: 13px; }
  .stat-card-outer { border-radius: 24px; padding: 8px; }
  .stat-card-outer::before, .stat-card-outer::after { border-radius: 24px; }
  .stat-card-inner { padding: 16px 12px; gap: 10px; border-radius: 18px; }
  .stat-card-inner .text-\\[38px\\] { font-size: 26px !important; }
  .stat-card-inner .text-\\[16px\\] { font-size: 11px !important; }
  .prop-item { flex-direction: column; gap: 16px; text-align: center; }
  .prop-icon { align-self: center; }
  .duration-badge { position: static; align-self: center; margin-top: 8px; }
  .benchmark-image { display: none !important; }
  .benchmark-text { width: 100% !important; }
  .benchmark-text .flex.flex-col { width: 100% !important; }
  .bench-card { height: auto !important; }
  .bench-card h3 { font-size: 18px !important; }
  .bench-card p { font-size: 14px !important; }
  .gap-card-green, .gap-card-red { border-radius: 20px; }
  .gap-card-green::before, .gap-card-red::before { border-radius: 20px; }
  .opp-card { padding: 20px; border-radius: 20px; }
  .opp-card h3 { font-size: 17px !important; }
  .opp-card p { font-size: 14px !important; }
  .stat-card-outer.pricing .stat-card-inner { padding: 16px 20px; }
}
`;

// ─── JS Template ───

const JS = `
// Particles
(function() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 60;
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  function create() {
    return { x: Math.random()*canvas.width, y: Math.random()*canvas.height,
      size: Math.random()*1.5+0.5, speedX: (Math.random()-0.5)*0.3,
      speedY: (Math.random()-0.5)*0.15-0.1, opacity: Math.random()*0.4+0.1 };
  }
  for (let i=0;i<COUNT;i++) particles.push(create());
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.x+=p.speedX; p.y+=p.speedY;
      if(p.x<0||p.x>canvas.width||p.y<0||p.y>canvas.height){Object.assign(p,create());p.y=canvas.height;}
      ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,'+p.opacity+')'; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

// Scroll progress
const bar = document.getElementById('progress-bar');
document.body.addEventListener('scroll', function() {
  const t = document.body.scrollTop;
  const h = document.body.scrollHeight - document.body.clientHeight;
  bar.style.width = (h > 0 ? (t/h)*100 : 0) + '%';
}, {passive:true});

// Nav dots
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.nav-dot');
dots.forEach(d => d.addEventListener('click', () => {
  slides[parseInt(d.dataset.slide)].scrollIntoView({behavior:'smooth'});
}));

// Fade-up observer
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, {root:null, threshold:0.15});
document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

// Slide observer (nav dots)
const slideObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      const idx = Array.from(slides).indexOf(e.target);
      dots.forEach((d,i) => d.classList.toggle('active', i===idx));
    }
  });
}, {root:null, threshold:0.5});
slides.forEach(s => slideObs.observe(s));

// Counter animation
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    const el = e.target;
    const raw = el.textContent;
    const num = parseFloat(raw.replace(/[^0-9.]/g,''));
    if(!isNaN(num) && num > 0 && num < 100000) {
      const suffix = raw.replace(/[0-9.,]/g,'');
      const dur = 800, start = performance.now();
      const step = (t) => {
        const p = Math.min((t-start)/dur,1);
        const eased = 1-Math.pow(1-p,3);
        el.textContent = Math.round(num*eased)+(suffix||'');
        if(p<1) requestAnimationFrame(step); else el.textContent = raw;
      };
      requestAnimationFrame(step);
    }
    counterObs.unobserve(el);
  });
}, {threshold:0.5});
document.querySelectorAll('.counter-value').forEach(el => counterObs.observe(el));
`;

// ─── Assemble HTML ───

const html = `<!DOCTYPE html>
<html lang="${config.lang || "fr"}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>D-Studio — ${esc(config.client)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: { 'card-12': '#141415', 'selct-dsr': '#e5e5e5' },
      fontFamily: { 'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'] }
    }
  }
}
</script>
<style>${CSS}${config.customCSS ? "\n" + config.customCSS : ""}
</style>
</head>
<body>

<!-- Progress Bar -->
<div id="progress-bar" style="width:0%"></div>

<!-- Particle Canvas -->
<canvas id="particles"></canvas>

<!-- Nav Dots -->
<nav class="nav-dots" id="nav-dots">
${navDots}
</nav>

${slidesHtml}

<script>${JS}
</script>
</body>
</html>`;

// ─── Write ───

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html, "utf-8");
console.log(`✓ Generated: ${outPath} (${slideCount} slides, Lightinderm quality)`);
