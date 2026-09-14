import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const source = readFileSync('data/publications.ts', 'utf8');
const additionalCompanions = {
  'Language and Private Debt Renegotiation, International Journal of Finance & Economics 30, 134-171.': 'https://cgodlewski.github.io/language-private-debt-renegotiation/',
};
const companionByDoi = {
  'https://doi.org/10.1007/s10693-025-00449-x': 'https://cgodlewski.github.io/macroprudential-policy-net-interest-margins/',
};
const records = source.split(/\r?\n/).filter((line) => /\{ year: \d/.test(line) && /citation: ['"]/.test(line)).map((line) => {
  const year = line.match(/year: (\d+)/)[1];
  const citation = line.match(/citation: (['"])(.*?)\1/)[2];
  const doi = line.match(/doi: '([^']+)'/)?.[1];
  const companion = line.match(/companion: '([^']+)'/)?.[1] ?? companionByDoi[doi] ?? additionalCompanions[citation];
  return { year, citation, doi, companion };
});
const books = [...source.matchAll(/^  '(.+)',$/gm)].map((m) => m[1]);
const visualOaRecords = [
  {
    year: '2026', license: 'CC BY 4.0', image: 'macroprudential-net-interest-margins-01.png',
    title: 'Macroprudential Policy and Net Interest Margins in European Banks',
    citation: 'with M. Olszak, I. Kowalska and A. Paciorek, Journal of Financial Services Research 70, 1-52.',
    en: 'The study examines how macroprudential policy affects banks’ net interest margins, their income and funding-cost components, and the timing of those effects.',
    fr: 'L’étude examine comment la politique macroprudentielle affecte les marges d’intérêt des banques, leurs composantes de revenus et de coûts de financement, ainsi que la temporalité de ces effets.',
    doi: 'https://doi.org/10.1007/s10693-025-00449-x', companion: 'https://cgodlewski.github.io/macroprudential-policy-net-interest-margins/',
  },
  {
    year: '2026', license: 'CC BY 4.0', image: 'tales-that-cost-01.png',
    title: 'Tales that Cost: Folklore and Bank Loan Spreads',
    citation: 'with L. Weill, International Review of Financial Analysis 111, 105100.',
    en: 'The paper examines whether cultural narratives about risk-taking, transmitted through folklore, shape the pricing of syndicated loans.',
    fr: 'L’article examine si les récits culturels sur la prise de risque, transmis par le folklore, façonnent la tarification des prêts syndiqués.',
    doi: 'https://doi.org/10.1016/j.irfa.2026.105100', companion: 'https://cgodlewski.github.io/tales-that-cost-companion/',
  },
  {
    year: '2025', license: 'CC BY-NC-ND', image: 'language-private-debt-01.jpg',
    title: 'Language and Private Debt Renegotiation',
    citation: 'International Journal of Finance & Economics 30, 134-171.',
    en: 'Language structure shapes the perceived value of loan renegotiation. The analysis draws on 6,500 loans issued to European firms.',
    fr: 'La structure linguistique façonne la valeur perçue de la renégociation des prêts. L’analyse porte sur 6 500 prêts accordés à des entreprises européennes.',
    doi: 'https://doi.org/10.1002/ijfe.2907', companion: 'https://cgodlewski.github.io/language-private-debt-renegotiation/',
  },
  {
    year: '2024', license: 'CC BY', image: 'bank-loan-renegotiation-network-01.jpg',
    title: 'Bank Loan Renegotiation and Financial Institutions’ Network',
    citation: 'with B. Sanditov, International Review of Financial Analysis 95, 103409.',
    en: 'The paper examines how lenders’ information-sourcing capacity, proxied by their centrality in syndicated-lending networks, shapes loan renegotiation.',
    fr: 'L’article examine comment la capacité des prêteurs à produire de l’information, approchée par leur centralité dans les réseaux de prêts syndiqués, façonne la renégociation.',
    doi: 'https://doi.org/10.1016/j.irfa.2024.103409',
  },
  {
    year: '2025', license: 'CC BY', image: 'macroprudential-corporate-loans-01.jpg',
    title: 'Macroprudential Policy and Corporate Loans: Evidence from the Syndicated Loan Market',
    citation: 'with M. Olszak, Journal of International Financial Markets, Institutions & Money 104, 102223.',
    en: 'Using syndicated loans from 19 European countries, the study examines how macroprudential policy affects the structure of corporate loans.',
    fr: 'À partir de prêts syndiqués issus de 19 pays européens, l’étude examine comment la politique macroprudentielle affecte la structure des prêts aux entreprises.',
    doi: 'https://doi.org/10.1016/j.intfin.2025.102223', companion: 'https://cgodlewski.github.io/macroprud-loans-companion/',
  },
  {
    year: '2024', license: 'CC BY-NC-ND', image: 'family-ties-firm-performance-01.jpg',
    title: 'Family Ties and Firm Performance: Empirical Evidence from East Asia',
    citation: 'with H. N. Le, Quarterly Review of Economics and Finance 94, 150-166.',
    en: 'The article studies how family ties affect the performance of family firms in East Asia, using objective and subjective measures from the World Values Survey.',
    fr: 'L’article étudie l’effet des liens familiaux sur la performance des entreprises familiales d’Asie de l’Est, à partir de mesures objectives et subjectives issues de la World Values Survey.',
    doi: 'https://doi.org/10.1016/j.qref.2024.01.008',
  },
];
const esc = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const header = `<header class="site-header"><a href="../" class="brand"><span class="brand-mark">CJG</span><span class="brand-name">Christophe J. Godlewski</span></a><nav><a href="../" data-en="Home" data-fr="Accueil">Home</a><a href="./" aria-current="page" data-en="Publications" data-fr="Publications">Publications</a><a href="../conferences/" data-en="Conferences" data-fr="Conférences">Conferences</a><a href="../archives/" data-en="Archive" data-fr="Archives">Archive</a><a href="../#links" data-en="Links" data-fr="Liens">Links</a></nav><div class="language-switch"><button data-lang="en">EN</button><span>/</span><button data-lang="fr">FR</button></div></header>`;
const rows = records.map((r) => `<li class="record"><time>${r.year}</time><div><p>${esc(r.citation)}</p>${r.doi || r.companion ? `<div class="record-links">${r.doi ? `<a href="${r.doi}" target="_blank">DOI ↗</a>` : ''}${r.companion ? `<a href="${r.companion}" target="_blank" data-en="Research companion ↗" data-fr="Compagnon de recherche ↗">Research companion ↗</a>` : ''}</div>` : ''}</div></li>`).join('');
const cards = visualOaRecords.map((r) => `<article class="oa-card"><a class="oa-cover" href="${r.doi}" target="_blank"><img src="../assets/publication-previews/${r.image}" loading="lazy" alt="Published article: ${esc(r.title)}"></a><div class="oa-card-copy"><p class="oa-meta">${r.year} · <a href="https://creativecommons.org/licenses/by${r.license.includes('NC-ND') ? '-nc-nd' : ''}/4.0/" target="_blank">${r.license}</a> · <span data-en="Open access" data-fr="Libre accès">Open access</span></p><h2>${esc(r.title)}</h2><p class="paper-meta">${esc(r.citation)}</p><p class="oa-summary" data-en="${esc(r.en)}" data-fr="${esc(r.fr)}">${esc(r.en)}</p><div class="record-links"><a href="${r.doi}" target="_blank">DOI ↗</a>${r.companion ? `<a href="${r.companion}" target="_blank" data-en="Research companion ↗" data-fr="Compagnon de recherche ↗">Research companion ↗</a>` : ''}</div></div></article>`).join('');
const bookRows = books.map((b) => `<li>${esc(b)}</li>`).join('');
const gallery = `<section class="oa-gallery wrap"><div class="section-heading"><div class="section-label"><span>01</span><span data-en="Open access" data-fr="Libre accès">Open access</span></div><div><h2 data-en="A visual selection of open-access publications" data-fr="Une sélection visuelle de publications en libre accès">A visual selection of open-access publications</h2></div></div><div class="oa-grid">${cards}</div></section>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Publication record of Christophe J. Godlewski"><title>Publications | Christophe J. Godlewski</title><link rel="stylesheet" href="../assets/style.css?v=20260914-1"></head><body>${header}<main><section class="page-hero wrap"><p class="eyebrow" data-en="Publication record" data-fr="Dossier scientifique">Publication record</p><h1>Publications</h1><p data-en="Peer-reviewed journal articles, in reverse chronological order." data-fr="Articles publiés dans des revues à comité de lecture, par ordre antéchronologique.">Peer-reviewed journal articles, in reverse chronological order.</p></section>${gallery}<section class="page-content wrap"><div class="publication-tools"><p><strong>${records.length}</strong> <span data-en="peer-reviewed journal articles" data-fr="articles dans des revues à comité de lecture">peer-reviewed journal articles</span></p></div><ol class="full-list">${rows}</ol></section><section class="books wrap"><div class="section-label"><span>02</span><span data-en="Books and chapters" data-fr="Ouvrages et chapitres">Books and chapters</span></div><ol>${bookRows}</ol></section></main><footer class="footer wrap"><a class="text-link" href="../" data-en="← Back to home" data-fr="← Retour à l’accueil">← Back to home</a></footer><script src="../assets/site.js?v=20260914-1"></script></body></html>`;
mkdirSync('publications', { recursive: true });
writeFileSync('publications/index.html', html);
