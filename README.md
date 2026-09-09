# Soance Innovations website

Static HTML website published by GitHub Pages at https://www.soance.com/ from `master`.

## Update and validate

Use Node.js 22 and Python 3.13. Generated HTML, CSS, Markdown and crawler files are committed so GitHub Pages can serve them directly.

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r scripts/requirements-seo.txt
npm ci
npm run build
npm run check:seo
python -m http.server 8765
```

Edit visible HTML first, then rebuild. For case-study content, edit `js/case-studies-data.js`, run `node scripts/generate_static_case_studies.mjs`, and then run the build and checks above. The SEO generator preserves editorial article publication dates and fictional disclosures. Keep descriptions in `scripts/build_seo.py` aligned with the corresponding pages. Do not add ratings, offices, credentials, prices or outcomes without visible, verified supporting content.

`build:seo` produces page-specific JSON-LD, canonical and social metadata, image dimensions, a canonical-only sitemap, `robots.txt`, `llms.txt`, `llms-full.txt`, and Markdown versions of indexable pages. It extracts services and FAQ answers from visible homepage content. Payment, legacy article-shell and error pages are noindex and excluded from the sitemap. No guessed modification dates are published.

`build:css` compiles Tailwind and LESS locally instead of sending browser compilers to visitors. Run it whenever HTML classes or style sources change. The GitHub Actions check validates the site and requires generated output to be committed.

## Search follow-up

After deployment, submit `https://www.soance.com/sitemap.xml` in the verified Google Search Console and Bing Webmaster Tools properties, inspect representative pages, and monitor indexing and Core Web Vitals. Search Console verification requires the property owner's account; no placeholder verification tokens are installed.

Structured data describes the visible content and does not guarantee rich results. The AI text files support discovery and retrieval; they do not guarantee rankings or AI citations. Local service pages describe service coverage, not additional offices. Keep them useful with genuine local examples as they become available rather than adding repetitive location pages.

References: [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [llms.txt proposal](https://llmstxt.org/).
