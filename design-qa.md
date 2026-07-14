# Design QA — Soance case studies white inner-page theme

Final result: **passed**

## Source and implementation

- User reference: the supplied About-page screenshot showing the white inner-page treatment.
- Live design-system source: `about.html`, captured at the same viewports as the implementation.
- Desktop source: `design-evidence/about-white-theme-source-desktop.png`
- Desktop implementation: `design-evidence/soance-case-studies-white-desktop.png`
- Desktop side-by-side comparison: `design-evidence/white-theme-comparison-desktop.png`
- Mobile source: `design-evidence/about-white-theme-source-mobile.png`
- Mobile implementation: `design-evidence/soance-case-studies-white-mobile.png`
- Mobile side-by-side comparison: `design-evidence/white-theme-comparison-mobile.png`
- Detail-page checks: `design-evidence/soance-case-detail-white-desktop.png` and `design-evidence/soance-case-detail-white-mobile.png`
- Responsive navigation state: `design-evidence/soance-case-studies-white-mobile-nav.png`

## Viewports and states

- Desktop: 1265 × 710, page top.
- Mobile: 390 × 844, page top.
- Source state: About page with its white inner-page header and white hero.
- Listing state: white header, centered page title, and first card row.
- Detail state: white header and title band for `marketplace-through-mobile-app`.
- Navigation state: mobile menu opened and closed successfully.

## Visual comparison

The source and case-study pages now use the same five visible design surfaces:

1. White header and page background.
2. Black Soance logo.
3. Dark-navy navigation with the active route in green.
4. No desktop or mobile header CTA pills.
5. Dark-navy title typography, matching the existing inner-page visual language.

The listing and detail content remains intentionally different from About, but the shared shell, colors, typography, and responsive navigation treatment match the existing inner-page design system.

## QA history

1. Replaced the blue case-study header/hero treatment with the existing `inner-header` white theme used by About.
2. Removed the consultation and WhatsApp header pills from both case-study pages to match the inner-page header.
3. Updated desktop and mobile navigation contrast for the white background while retaining the green active state.
4. Verified the listing, detail page, card content, and mobile menu at desktop and mobile viewports.
5. Compared the local About source and implementation side by side at the same viewport sizes.

## Final checks

- Listing and detail pages return HTTP 200.
- 38 case studies still render from the local catalog.
- Case-study page console errors: 0.
- Mobile navigation opens and closes correctly.
- JavaScript syntax and the edited HTML pages pass validation.
- P0 issues: 0. P1 issues: 0. P2 issues: 0.

Intentional differences are limited to the case-study-specific title and card/detail content.
