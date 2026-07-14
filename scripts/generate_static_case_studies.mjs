#!/usr/bin/env node

/**
 * Generate crawlable case-study HTML pages and pre-render the listing cards.
 *
 * The browser-side case-study data remains the editorial source of truth, while
 * this build step ensures search engines and text-only/AI crawlers receive the
 * complete article, canonical metadata, and structured data in the first HTML
 * response.
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_PATH = path.join(ROOT, 'js', 'case-studies-data.js');
const INDEX_PATH = path.join(ROOT, 'case-studies.html');
const OUTPUT_DIR = path.join(ROOT, 'case-studies');
const SITE_URL = 'https://www.soance.com';
const BUILD_DATE = '2026-07-14';

function loadStudies() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(DATA_PATH, 'utf8'), sandbox, { filename: DATA_PATH });
  const studies = sandbox.window.SOANCE_CASE_STUDIES;
  if (!Array.isArray(studies) || studies.length === 0) {
    throw new Error('No case studies were found in js/case-studies-data.js');
  }
  return studies;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function absoluteAsset(assetPath) {
  return `${SITE_URL}/${String(assetPath).replace(/^\/+/, '')}`;
}

function pageUrl(study) {
  return `${SITE_URL}/case-studies/${encodeURIComponent(study.slug)}.html`;
}

function localPageUrl(study) {
  return `/case-studies/${encodeURIComponent(study.slug)}.html`;
}

function jsonLd(value) {
  return JSON.stringify(value, null, 2).replaceAll('<', '\\u003c');
}

function cardMarkup(study, headingLevel = 2) {
  const title = escapeHtml(study.title);
  const company = escapeHtml(study.company);
  const industry = escapeHtml(study.industry);
  const url = localPageUrl(study);
  const summary = escapeHtml(study.excerpt || 'See how strategy, design, and technology came together to move this digital product forward.');
  const image = String(study.image || '').replace(/^\/+/, '');
  const logo = String(study.logo || '').replace(/^\/+/, '');

  return `
                    <article id="case-${escapeHtml(study.slug)}" class="case-study-card">
                        <a class="case-study-card__media" href="${url}" aria-label="Read ${title}">
                            <img class="case-study-card__photo" src="/${escapeHtml(image)}" alt="${title}" loading="lazy" decoding="async">
                            <span class="case-study-card__media-logo"><img src="/${escapeHtml(logo)}" alt="${company} fictional logo" loading="lazy" decoding="async"></span>
                        </a>
                        <div class="case-study-card__content">
                            <p class="case-study-card__brand">${company} · ${industry}</p>
                            <h${headingLevel} class="case-study-card__title"><a href="${url}">${title}</a></h${headingLevel}>
                            <p class="case-study-card__summary">Summary / TLDR ${summary}</p>
                            <a class="case-study-card__link" href="${url}" aria-label="Read case study: ${title}">Read case study</a>
                        </div>
                    </article>`;
}

function articleContent(study) {
  const tabTargets = {
    Summary: '#bgsection',
    Overview: '#overviewBlock',
    Challenges: '#challengesBlock',
    Solution: '#solutionBlock',
    Results: '#resultsBlock'
  };

  let content = String(study.content)
    .replaceAll('src="images/', 'src="/images/')
    .replaceAll('href="contact.html"', 'href="/contact.html"');

  for (const [label, target] of Object.entries(tabTargets)) {
    content = content.replace(
      `<a class="wp-block-button__link">${label}</a>`,
      `<a class="wp-block-button__link" href="${target}">${label}</a>`
    );
  }
  return content;
}

function schemaFor(study) {
  const url = pageUrl(study);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: study.title,
        description: study.excerpt,
        abstract: study.excerpt,
        image: absoluteAsset(study.image),
        url,
        mainEntityOfPage: url,
        articleSection: study.industry,
        genre: 'Transparent fictionalized case study',
        isAccessibleForFree: true,
        datePublished: BUILD_DATE,
        dateModified: BUILD_DATE,
        author: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'Soance Innovations LLP',
          url: `${SITE_URL}/`
        },
        publisher: {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'Soance Innovations LLP',
          url: `${SITE_URL}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/soance.png`
          }
        },
        about: {
          '@type': 'Thing',
          name: `${study.industry} digital product delivery scenario`,
          description: 'The company identity and outcomes in this case study are fictionalized and illustrative.'
        },
        isPartOf: {
          '@type': 'CollectionPage',
          '@id': `${SITE_URL}/case-studies.html#collection`,
          name: 'Soance Case Studies',
          url: `${SITE_URL}/case-studies.html`
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Case Studies', item: `${SITE_URL}/case-studies.html` },
          { '@type': 'ListItem', position: 3, name: study.title, item: url }
        ]
      }
    ]
  };
}

function renderPage(study, related) {
  const title = escapeHtml(study.title);
  const excerpt = escapeHtml(study.excerpt);
  const company = escapeHtml(study.company);
  const industry = escapeHtml(study.industry);
  const url = pageUrl(study);
  const image = absoluteAsset(study.image);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>${title} | Soance Case Study</title>
    <meta name="author" content="Soance Innovations LLP">
    <meta name="description" content="${excerpt}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="${url}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title} | Soance">
    <meta property="og:description" content="${excerpt}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:alt" content="${title}">
    <meta property="og:site_name" content="Soance">
    <meta property="article:section" content="${industry}">
    <meta property="article:published_time" content="${BUILD_DATE}">
    <meta property="article:modified_time" content="${BUILD_DATE}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title} | Soance">
    <meta name="twitter:description" content="${excerpt}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:image:alt" content="${title}">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] } } } };</script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="/css/animate.css">
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <link rel="stylesheet" type="text/css" href="/css/responsive.css">
    <link rel="stylesheet" type="text/css" href="/css/case-studies.css?v=20260714-search-ready">
    <script type="application/ld+json">${jsonLd(schemaFor(study))}</script>
</head>
<body class="case-page">
    <div id="preloader"><div id="status"><h3 style="color:#fff">soance</h3><span class="loading toggle" aria-hidden="true"></span></div></div>
    <main class="master_wrap animated fadeIn font-sans">
        <section class="header_section stick inner-header fixed">
            <div class="container">
                <div class="logo_wrp">
                    <a href="/" class="logo-white"><img src="/images/soance_white.png" alt="Soance"></a>
                    <a href="/" class="logo-blue"><img src="/images/soance.png" alt="Soance"></a>
                </div>
                <div class="nav_icon" id="nav_icon" aria-label="Open navigation"><span></span><span></span><span></span></div>
                <div class="nav_wrap"><div class="nav_inner"><ul>
                    <li><a href="/">HOME</a></li>
                    <li><a href="/about.html">ABOUT</a></li>
                    <li class="active"><a href="/case-studies.html">CASE STUDIES</a></li>
                    <li><a href="/contact.html">CONTACT</a></li>
                </ul></div></div>
            </div>
        </section>
        <section class="header_section">
            <div class="logo_wrp"><a href="/" class="logo-blue"><img src="/images/soance.png" alt="Soance"></a></div>
            <div class="nav_icon" id="nav_icon2" aria-label="Open navigation"><span></span><span></span><span></span></div>
            <div class="nav_wrap"><div class="nav_inner">
                <ul><li><a href="/">Home</a></li><li><a href="/about.html">About</a></li><li class="active"><a href="/case-studies.html">Case Studies</a></li><li><a href="/contact.html">Contact</a></li></ul>
                <div class="nav_bottom"><p><a href="mailto:info@soance.com">info@soance.com</a></p></div>
            </div></div>
        </section>

        <div id="case-study-detail">
            <div class="case-header-band"></div>
            <section class="case-detail-hero">
                <div class="container">
                    <p class="case-detail-client">${company} · ${industry} · Fictional client</p>
                    <h1>${title}</h1>
                    <div class="case-detail-meta"><span class="case-detail-meta__icon" aria-hidden="true"><i class="fa fa-clock-o"></i></span><span>Reading time about ${Number(study.readingMinutes) || 5} mins</span></div>
                </div>
            </section>
            <article class="case-study-content">
${articleContent(study)}
            </article>
            <section class="case-related">
                <div class="container">
                    <div class="case-related__heading"><h2>More case studies</h2><a href="/case-studies.html">View all case studies</a></div>
                    <div class="case-studies-grid">${related.map((item) => cardMarkup(item, 3)).join('')}
                    </div>
                </div>
            </section>
        </div>

        <footer class="border-t bg-white font-sans">
            <div class="max-w-6xl mx-auto px-6 pt-12 pb-9">
                <div class="flex flex-col lg:flex-row gap-y-8">
                    <div class="lg:w-1/4">
                        <a href="/" class="inline-block"><img src="/images/soance.png" alt="Soance" class="h-7"></a>
                        <div class="mt-5 text-sm text-slate-500">Soance is a technology consulting and software development company helping businesses innovate, automate, and grow through custom digital solutions.<br>Based in Kadirur, Kannur, Kerala.</div>
                    </div>
                    <div class="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-y-8 text-sm">
                        <div><div class="font-semibold text-slate-900 mb-3">Company</div><div class="flex flex-col gap-y-[7px] text-slate-600"><a href="/about.html" class="hover:text-slate-900">About</a><a href="/case-studies.html" class="hover:text-slate-900">Case Studies</a><a href="/contact.html" class="hover:text-slate-900">Contact</a><a href="https://wa.me/918217445213" target="_blank" rel="noopener noreferrer" class="hover:text-slate-900">WhatsApp</a></div></div>
                        <div><div class="font-semibold text-slate-900 mb-3">Legal</div><div class="flex flex-col gap-y-[7px] text-slate-600"><a href="/privacy.html" class="hover:text-slate-900">Privacy Policy</a><a href="/terms-of-service.html" class="hover:text-slate-900">Terms of Service</a><a href="/refund-policy.html" class="hover:text-slate-900">Refund Policy</a></div></div>
                        <div><div class="font-semibold text-slate-900 mb-3">Get in touch</div><div class="flex flex-col gap-y-1.5"><a href="mailto:info@soance.com" class="text-slate-600 hover:text-slate-900">info@soance.com</a><a href="https://wa.me/918217445213" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-700">Chat on WhatsApp</a><a href="https://www.linkedin.com/company/soance" target="_blank" rel="noopener noreferrer" class="text-slate-600 hover:text-slate-900">LinkedIn</a></div></div>
                    </div>
                </div>
                <div class="mt-8 border-t pt-6 text-sm"><div class="font-semibold text-slate-900 mb-1 text-xs tracking-[2px] uppercase">Serving clients worldwide</div><div class="text-xs text-slate-600">India • United States &amp; Canada • UK &amp; Europe • UAE &amp; Middle East • Australia &amp; New Zealand • Southeast Asia • Remote clients globally</div></div>
                <div class="mt-8 pt-6 border-t text-xs text-slate-500">© Soance Innovations LLP</div>
            </div>
        </footer>
    </main>
    <script src="/js/jquery-2.2.4.js"></script>
    <script src="/js/main.js"></script>
</body>
</html>
`;
}

function updateListing(studies) {
  let source = fs.readFileSync(INDEX_PATH, 'utf8');
  const cards = studies.map((study) => cardMarkup(study)).join('');
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/case-studies.html#collection`,
    name: 'Soance Case Studies',
    url: `${SITE_URL}/case-studies.html`,
    description: 'A library of transparent, fictionalized digital product and technology transformation case studies from Soance Innovations.',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: studies.length,
      itemListElement: studies.map((study, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: study.title,
        url: pageUrl(study)
      }))
    }
  };

  source = source.replace(
    /(<!-- CASE STUDY GRID START -->)[\s\S]*?(<!-- CASE STUDY GRID END -->)/,
    `$1${cards}\n                    $2`
  );
  source = source.replace(
    /<script id="case-studies-schema" type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script id="case-studies-schema" type="application/ld+json">\n${jsonLd(collectionSchema)}\n    </script>`
  );
  fs.writeFileSync(INDEX_PATH, source);
}

function main() {
  const studies = loadStudies();
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  studies.forEach((study, index) => {
    const related = [1, 2, 3].map((offset) => studies[(index + offset) % studies.length]);
    fs.writeFileSync(path.join(OUTPUT_DIR, `${study.slug}.html`), renderPage(study, related));
  });

  updateListing(studies);
  console.log(`Generated ${studies.length} static case-study pages and pre-rendered the listing.`);
}

main();
