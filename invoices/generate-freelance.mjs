#!/usr/bin/env node
/**
 * Freelance Invoice Generator (Kevin Le Junter → D·STUDIO)
 * Usage: node generate-freelance.mjs invoice-data.json
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function generate(data) {
  let html = readFileSync(join(__dirname, 'template-freelance.html'), 'utf-8');

  const total = data.total || data.items.reduce((s, i) => s + parseFloat(i.montant), 0);
  const fmt = n => Number(n).toFixed(2).replace('.', ',');

  // Build table rows
  const rowsHtml = data.items.map(item => `
      <div class="table-row">
        <div class="col col-desc">
          <div class="row-title">${item.title}</div>
          ${item.subtitle ? `<div class="row-sub">${item.subtitle}</div>` : ''}
          ${item.subtitle ? `<div class="row-sub-mobile">Taux: <strong>${fmt(item.taux)} &euro;</strong> &middot; Heures: <strong>${item.heures}</strong></div>` : ''}
        </div>
        <div class="col col-taux"><span class="cell-value">${fmt(item.taux)} &euro;</span></div>
        <div class="col col-heures"><span class="cell-value">${item.heures}</span></div>
        <div class="col col-montant"><span class="cell-value cell-bold">${fmt(item.montant)} &euro;</span></div>
      </div>`).join('\n');

  // Replace placeholders
  html = html.replace('FACTURE N. 0023', `FACTURE N. ${data.number || '0023'}`);
  html = html.replace('26 Mars 2026', data.date || '26 Mars 2026');
  html = html.replace('<!-- Filled by generator -->', rowsHtml);
  html = html.replace('>0.00 &euro;</span>', `>${fmt(total)} &euro;</span>`);
  // Total amount (plain text node)
  html = html.replace('>0.00 &euro;<', `>${fmt(total)} &euro;<`);
  // Payment amount
  html = html.replace(
    /(<div class="payment-amount"[^>]*>)0\.00 &euro;/,
    `$1${fmt(total)} &euro;`
  );
  // Footer number
  html = html.replace('Facture 0023', `Facture ${data.number || '0023'}`);
  // Title
  html = html.replace('<title>Facture — Kevin Le Junter</title>',
    `<title>Facture ${data.number || '0023'} — Kevin Le Junter</title>`);

  return { html, total };
}

const dataFile = process.argv[2];
if (!dataFile) {
  console.error('Usage: node generate-freelance.mjs <data.json>');
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataFile, 'utf-8'));
const { html, total } = generate(data);
const filename = `facture-${(data.number || '0023').toLowerCase()}-kevin-le-junter.html`;
const outPath = join(__dirname, filename);
writeFileSync(outPath, html);

console.log(`Facture ${data.number} generee`);
console.log(`   Total: ${Number(total).toFixed(2)} EUR`);
console.log(`   File: ${outPath}`);
