import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const source = readFileSync('../Personal-Academic-Site/lib/publications.ts', 'utf8');
const additionalCompanions = {
  'Language and Private Debt Renegotiation, International Journal of Finance & Economics 30, 134-171.': 'https://cgodlewski.github.io/language-private-debt-renegotiation/',
  'Macroprudential Policy and Net Interest Margins in European Banks (with M. Olszak, I. Kowalska and A. Paciorek), Journal of Financial Services Research, forthcoming.': 'https://cgodlewski.github.io/macroprudential-policy-net-interest-margins/',
};
const records = source.split(/\r?\n/).filter((line) => /\{ year: \d/.test(line) && line.includes("citation: '")).map((line) => {
  const year = line.match(/year: (\d+)/)[1];
  const remainder = line.split("citation: '")[1];
  const citationEnd = ["', doi:", "', companion:", "' }"]
    .map((marker) => remainder.indexOf(marker)).filter((index) => index >= 0)[0];
  const citation = remainder.slice(0, citationEnd);
  const doi = line.match(/doi: '([^']+)'/)?.[1];
  const companion = line.match(/companion: '([^']+)'/)?.[1] ?? additionalCompanions[citation];
  return { year, citation, doi, companion };
});
const books = [...source.matchAll(/^  '(.+)',$/gm)].map((m) => m[1]);
const esc = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const header = `<header class="site-header"><a href="../" class="brand"><span class="brand-mark">CJG</span><span class="brand-name">Christophe J. Godlewski</span></a><nav><a href="../" data-en="Home" data-fr="Accueil">Home</a><a href="./" aria-current="page" data-en="Publications" data-fr="Publications">Publications</a><a href="../archives/" data-en="Archive" data-fr="Archives">Archive</a><a href="../#links" data-en="Links" data-fr="Liens">Links</a></nav><div class="language-switch"><button data-lang="en">EN</button><span>/</span><button data-lang="fr">FR</button></div></header>`;
const rows = records.map((r) => `<li class="record"><time>${r.year}</time><div><p>${esc(r.citation)}</p>${r.doi || r.companion ? `<div class="record-links">${r.doi ? `<a href="${r.doi}" target="_blank">DOI ↗</a>` : ''}${r.companion ? `<a href="${r.companion}" target="_blank" data-en="Research companion ↗" data-fr="Compagnon de recherche ↗">Research companion ↗</a>` : ''}</div>` : ''}</div></li>`).join('');
const bookRows = books.map((b) => `<li>${esc(b)}</li>`).join('');
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Publication record of Christophe J. Godlewski"><title>Publications | Christophe J. Godlewski</title><link rel="stylesheet" href="../assets/style.css"></head><body>${header}<main><section class="page-hero wrap"><p class="eyebrow" data-en="Publication record" data-fr="Dossier scientifique">Publication record</p><h1>Publications</h1><p data-en="Peer-reviewed journal articles, in reverse chronological order." data-fr="Articles publiés dans des revues à comité de lecture, par ordre antéchronologique.">Peer-reviewed journal articles, in reverse chronological order.</p></section><section class="page-content wrap"><div class="publication-tools"><p><strong>${records.length}</strong> <span data-en="peer-reviewed journal articles" data-fr="articles dans des revues à comité de lecture">peer-reviewed journal articles</span></p></div><ol class="full-list">${rows}</ol></section><section class="books wrap"><div class="section-label"><span>02</span><span data-en="Books and chapters" data-fr="Ouvrages et chapitres">Books and chapters</span></div><ol>${bookRows}</ol></section></main><footer class="footer wrap"><a class="text-link" href="../" data-en="← Back to home" data-fr="← Retour à l’accueil">← Back to home</a></footer><script src="../assets/site.js"></script></body></html>`;
mkdirSync('publications', { recursive: true });
writeFileSync('publications/index.html', html);
