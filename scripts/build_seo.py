#!/usr/bin/env python3
"""Refresh static SEO from visible HTML; run after editing or generating pages."""
import html
import json
import re
import textwrap
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urljoin, urlparse

from bs4 import BeautifulSoup
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://www.soance.com/"
ORG = BASE + "#organization"
WEBSITE = BASE + "#website"
NOINDEX = {"404.html", "pay.html", "case-study.html"}
ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
META = {
    "index.html": ("Web, Mobile App & Custom Software Development | Soance", "Soance builds websites, web and mobile apps, custom software, automation and AI solutions. Based in Kannur, Kerala, serving India and global businesses."),
    "about.html": ("About Soance | Software Development & Technology Consulting", "Meet Soance Innovations LLP, a Kerala-based technology partner building websites, mobile apps, CRMs, AI and computer vision solutions for businesses."),
    "contact.html": ("Contact Soance | Discuss Your Website, App or Software Project", "Discuss your website, app or software project with Soance in Kannur, Kerala. Call +91 8217445213 or email info@soance.com to get started."),
    "case-studies.html": ("Software, Web & Mobile App Case Studies | Soance", "Explore Soance's web, mobile app and software case studies, including client projects and clearly labeled fictional scenarios across business sectors."),
    "me.html": ("Rajilesh Panoli | Founder & CEO, Soance Innovations", "Connect with Rajilesh Panoli, Founder and CEO of Soance Innovations, in Whitefield, Bangalore. Find his business contact details and company website."),
    "cubesolv-privacy.html": ("CubeSolv Privacy Policy | Soance", "Read how CubeSolv handles privacy, on-device camera processing, locally stored progress and personal data. Contact Soance for privacy questions."),
    "privacy.html": ("Privacy Policy | Soance Innovations", "Read the Soance Innovations privacy policy, including how information is collected, used and protected, and how to contact us about your privacy."),
    "terms-of-service.html": ("Terms of Service | Soance Innovations", "Read the Soance Innovations terms of service covering use of the website, purchases, user submissions, third-party services and limitations of liability."),
    "refund-policy.html": ("Refund Policy | Soance Innovations", "Read the Soance Innovations refund policy for information about returns, refund eligibility, exchanges, shipping and how to contact our team."),
    "pay.html": ("Make a Payment | Soance Innovations", "Make a payment to Soance Innovations for an agreed project or service. Contact our team if you need help with your payment."),
    "404.html": ("Page Not Found | Soance", "This page could not be found. Explore Soance's website, app and software development services, case studies, or contact our team."),
}


def pages():
    return sorted(list(ROOT.glob("*.html")) + list((ROOT / "case-studies").glob("*.html")))


def page_url(path):
    rel = path.relative_to(ROOT).as_posix()
    return BASE if rel == "index.html" else BASE + rel


def plain(node):
    return " ".join(node.stripped_strings) if node else ""


def local_path(url, page):
    parsed = urlparse(urljoin(page_url(page), url))
    if parsed.netloc != "www.soance.com":
        return None
    return ROOT / parsed.path.lstrip("/")


def dimensions(url, page):
    path = local_path(url, page)
    if not path or not path.is_file():
        return None
    if path.suffix == ".svg":
        root = ET.parse(path).getroot()
        view = root.get("viewBox", "").split()
        return tuple(round(float(n)) for n in view[2:]) if len(view) == 4 else None
    with Image.open(path) as im:
        return im.size


def replace_meta(source, key, value, attr="name"):
    pattern = rf'<meta\b(?=[^>]*\b{attr}=[\"\']{re.escape(key)}[\"\'])[^>]*>\s*'
    source = re.sub(pattern, "", source, flags=re.I)
    tag = f'<meta {attr}="{key}" content="{html.escape(value, quote=True)}">'
    return source.replace("</head>", f"    {tag}\n</head>")


def replace_link(source, rel, href, extra=""):
    source = re.sub(rf'<link\b(?=[^>]*\brel="{rel}")[^>]*>\s*', "", source, flags=re.I)
    return source.replace("</head>", f'    <link rel="{rel}" href="{href}"{extra}>\n</head>')


def organization():
    # Only the actual office; service-area pages are not additional branches.
    return {"@type": ["Organization", "ProfessionalService"], "@id": ORG,
            "name": "Soance Innovations LLP", "alternateName": "Soance", "url": BASE,
            "logo": {"@id": BASE + "#logo"}, "image": BASE + "images/soance.png",
            "telephone": "+91-8217445213", "email": "info@soance.com",
            "address": {"@type": "PostalAddress", "streetAddress": "I/478A, Pulliode, Kadirur",
                        "addressLocality": "Kannur", "addressRegion": "Kerala", "postalCode": "670642", "addressCountry": "IN"},
            "sameAs": ["https://www.linkedin.com/company/soance"],
            "contactPoint": {"@type": "ContactPoint", "contactType": "business enquiries",
                             "telephone": "+91-8217445213", "email": "info@soance.com"}}


def schema(soup, path, title, description, image_url):
    url = page_url(path)
    rel = path.relative_to(ROOT).as_posix()
    old = []
    for script in soup.select('script[type="application/ld+json"]'):
        data = json.loads(script.string or script.get_text())
        old.extend(data.get("@graph", [data]))
    logo_size = dimensions(BASE + "images/soance.png", path)
    graph = [organization(),
             {"@type": "ImageObject", "@id": BASE + "#logo", "url": BASE + "images/soance.png",
              "contentUrl": BASE + "images/soance.png", "width": logo_size[0], "height": logo_size[1], "caption": "Soance Innovations"},
             {"@type": "WebSite", "@id": WEBSITE, "url": BASE, "name": "Soance", "alternateName": "Soance Innovations",
              "publisher": {"@id": ORG}, "inLanguage": "en-IN"}]
    kind = {"about.html": "AboutPage", "contact.html": "ContactPage", "case-studies.html": "CollectionPage", "me.html": "ProfilePage"}.get(rel, "WebPage")
    webpage = {"@type": kind, "@id": url + "#webpage", "url": url, "name": title, "description": description,
               "isPartOf": {"@id": WEBSITE}, "about": {"@id": ORG}, "inLanguage": "en-IN",
               "primaryImageOfPage": {"@id": url + "#primaryimage"}}
    graph.append(webpage)
    image = {"@type": "ImageObject", "@id": url + "#primaryimage", "url": image_url, "contentUrl": image_url}
    size = dimensions(image_url, path)
    if size:
        image.update(width=size[0], height=size[1])
    graph.append(image)
    if rel != "index.html":
        crumbs = [("Home", BASE)]
        if rel.startswith("case-studies/"):
            crumbs.append(("Case Studies", BASE + "case-studies.html"))
        crumbs.append((plain(soup.h1) or title.split(" | ")[0], url))
        webpage["breadcrumb"] = {"@id": url + "#breadcrumb"}
        graph.append({"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": i, "name": name, "item": link} for i, (name, link) in enumerate(crumbs, 1)]})
    if rel == "index.html":
        offers = []
        for heading in soup.select("#services h3"):
            service_id = BASE + "#service-" + re.sub(r"[^a-z0-9]+", "-", plain(heading).lower()).strip("-")
            service = {"@type": "Service", "@id": service_id, "name": plain(heading),
                       "description": plain(heading.find_next_sibling("p")), "url": BASE + "#services",
                       "provider": {"@id": ORG}}
            graph.append(service)
            offers.append({"@type": "Offer", "itemOffered": {"@id": service_id}})
        graph[0]["hasOfferCatalog"] = {"@type": "OfferCatalog", "name": "Software development and technology services", "itemListElement": offers}
        webpage["mainEntity"] = {"@id": ORG}
    if rel.startswith("website-development-company-in-"):
        city = plain(soup.h1).replace("Website Development Company in ", "")
        service_id = url + "#service"
        webpage["mainEntity"] = {"@id": service_id}
        graph.append({"@type": "Service", "@id": service_id, "name": "Website Development in " + city,
                      "serviceType": "Website design and development", "description": description,
                      "url": url, "provider": {"@id": ORG}, "areaServed": {"@type": "Place", "name": city}})
    faqs = []
    for detail in soup.select("#faq details"):
        question = plain(detail.find("summary")).rstrip(" ⌄")
        answer = " ".join(plain(p) for p in detail.find_all("p"))
        faqs.append({"@type": "Question", "name": question, "acceptedAnswer": {"@type": "Answer", "text": answer}})
    if faqs:
        graph.append({"@type": "FAQPage", "@id": url + "#faq", "isPartOf": {"@id": url + "#webpage"}, "mainEntity": faqs})
        webpage["hasPart"] = {"@id": url + "#faq"}
    article = next((n for n in old if n.get("@type") == "Article"), None)
    if article:
        article.update(description=description, image={"@id": url + "#primaryimage"},
                       mainEntityOfPage={"@id": url + "#webpage"}, author={"@id": ORG}, publisher={"@id": ORG}, inLanguage="en-IN")
        article["isPartOf"] = {"@id": BASE + "case-studies.html#webpage"}
        webpage["mainEntity"] = {"@id": article["@id"]}
        graph.append(article)
    if rel == "case-studies.html":
        items = []
        for link in soup.select(".case-study-grid .case-study-card__title a"):
            items.append({"@type": "ListItem", "position": len(items) + 1, "name": plain(link), "url": urljoin(url, link["href"])})
        # The static collection grid is the source of truth, never JS-only cards.
        if not items:
            for card in soup.select(".case-study-card"):
                link = card.select_one(".case-study-card__title a")
                if link:
                    items.append({"@type": "ListItem", "position": len(items) + 1, "name": plain(link), "url": urljoin(url, link["href"])})
        listing = {"@type": "ItemList", "@id": url + "#case-studies", "numberOfItems": len(items), "itemListElement": items}
        webpage["mainEntity"] = {"@id": listing["@id"]}
        graph.append(listing)
    if rel == "me.html":
        person = {"@type": "Person", "@id": url + "#person", "name": "Rajilesh Panoli", "jobTitle": "Founder & CEO",
                  "worksFor": {"@id": ORG}, "url": url, "email": "rajilesh@soance.com", "telephone": "+91-8547105826"}
        webpage["mainEntity"] = {"@id": person["@id"]}
        graph.append(person)
    return {"@context": "https://schema.org", "@graph": graph}


def update_page(path):
    source = path.read_text()
    rel = path.relative_to(ROOT).as_posix()
    soup = BeautifulSoup(source, "html.parser")
    title = plain(soup.title)
    desc_tag = soup.find("meta", attrs={"name": "description"})
    description = desc_tag["content"] if desc_tag else title
    if rel in META:
        title, description = META[rel]
    elif rel.startswith("website-development-company-in-"):
        city = plain(soup.h1).replace("Website Development Company in ", "")
        title = f"Website Development in {city} | Soance"
        description = f"Website development for businesses in {city}: responsive websites, WordPress, e-commerce and web apps. Discuss your project with Soance Innovations."
    elif rel.startswith("case-studies/"):
        article = next(n for s in soup.select('script[type="application/ld+json"]') for n in json.loads(s.string)["@graph"] if n.get("@type") == "Article")
        company = plain(soup.select_one(".case-detail-hero p" )).split(" · ")[0]
        # Preserve the editorial headline, but make search titles scannable.
        title = f"{company}: {article['articleSection']} Case Study | Soance" if company else title
        if "fictional" in article.get("genre", "").lower():
            description = f"Fictional {article['articleSection'].lower()} case study: {article['headline'].rstrip('.')}. An illustrative Soance delivery scenario."
        else:
            description = article.get("abstract", description)
    description = textwrap.shorten(description, width=170, placeholder="…")
    image_tag = soup.find("meta", attrs={"property": "og:image"})
    image_url = image_tag["content"] if image_tag else BASE + "images/soance.png"
    data = schema(soup, path, title, description, image_url) if rel not in NOINDEX else None
    source = re.sub(r"<title>.*?</title>", "<title>" + html.escape(title) + "</title>", source, flags=re.S)
    source = re.sub(r'<script\b[^>]*type="application/ld\+json"[^>]*>.*?</script>\s*', "", source, flags=re.S)
    for name in ("keywords", "googlebot", "geo.position", "ICBM"):
        source = re.sub(rf'<meta\b(?=[^>]*name="{re.escape(name)}")[^>]*>\s*', "", source)
    source = replace_meta(source, "description", description)
    source = replace_meta(source, "robots", "noindex, follow" if rel in NOINDEX else ROBOTS)
    source = replace_meta(source, "viewport", "width=device-width, initial-scale=1.0")
    source = replace_link(source, "canonical", page_url(path))
    for key, val in {"og:type": "article" if rel.startswith("case-studies/") else "website", "og:url": page_url(path),
                     "og:title": title, "og:description": description, "og:image": image_url,
                     "og:image:alt": plain(soup.h1) if rel.startswith("case-studies/") else "Soance Innovations",
                     "og:site_name": "Soance", "og:locale": "en_IN"}.items():
        source = replace_meta(source, key, val, "property")
    size = dimensions(image_url, path)
    if size:
        for key, val in zip(("og:image:width", "og:image:height"), size):
            source = replace_meta(source, key, str(val), "property")
    for key, val in {"twitter:card": "summary_large_image" if rel.startswith("case-studies/") else "summary",
                     "twitter:title": title, "twitter:description": description, "twitter:image": image_url,
                     "twitter:image:alt": plain(soup.h1) if rel.startswith("case-studies/") else "Soance Innovations"}.items():
        source = replace_meta(source, key, val)
    source = replace_link(source, "describedby", BASE + "llms.txt", ' type="text/plain"')
    if data:
        markup = json.dumps(data, ensure_ascii=False, indent=2).replace("<", "\\u003c")
        source = source.replace("</head>", f'    <script id="seo-schema" type="application/ld+json">\n{markup}\n    </script>\n</head>')
    # Compile framework styles at build time, keeping the existing cascade order.
    source = re.sub(r'<script src="https://cdn.tailwindcss.com"></script>', '<link rel="stylesheet" href="/css/tailwind.min.css">', source)
    source = re.sub(r'<script>\s*tailwind.config\s*=.*?</script>\s*', "", source, flags=re.S)
    source = re.sub(r'<link[^>]*rel="stylesheet/less"[^>]*>\s*', "", source)
    source = re.sub(r'<script[^>]*src="(?:/)?less/less.min.js"[^>]*></script>', '<link rel="stylesheet" href="/css/legacy.min.css">', source)
    # Remove a duplicate Google Fonts preload (the normal stylesheet is retained).
    source = re.sub(r'<link rel="preload"[^>]*href="https://fonts.googleapis.com[^>]*>\s*', "", source)
    source = source.replace('href="font-awesome/css/font-awesome.css"', 'href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"')
    source = re.sub(r'<(?:link|script)\b[^>]*(?:href|src)="sweetalert-master/[^\"]+"[^>]*>(?:</script>)?\s*', "", source)
    source = re.sub(r'<script[^>]*src="js/wow.js"[^>]*></script>\s*', "", source)
    source = source.replace("new WOW().init();", "")
    # Show content immediately instead of waiting for every third-party widget.
    source = re.sub(r'<div id="preloader">\s*<div id="status">.*?</div>\s*</div>\s*', "", source, flags=re.S)
    source = re.sub(r'<noscript id="nojs-content">.*?</noscript>\s*', "", source, flags=re.S)
    def image_attrs(match):
        tag = BeautifulSoup(match[0], "html.parser").img
        src = tag.get("src", "")
        if not tag.has_attr("alt"):
            tag["alt"] = "Soance" if "soance" in src else ""  # Decorative stock photography.
        if not tag.has_attr("width") and not tag.has_attr("height"):
            size = dimensions(src, path)
            if size:
                tag["width"], tag["height"] = map(str, size)
        tag["decoding"] = "async"
        return str(tag)
    source = re.sub(r"<img\b[^>]*>", image_attrs, source)
    # Do not change timestamps just because a build ran; sitemap omits uncertain lastmod.
    # Keep repeated builds byte-stable even after replacing head elements.
    head, body = source.split("</head>", 1)
    head = re.sub(r"(?m)^[ \t]+(?=<)", "    ", head)
    head = re.sub(r"(?m)^[ \t]+$", "", head).rstrip()
    source = re.sub(r"(?m)[ \t]+$", "", head + "\n</head>" + body)
    if source != path.read_text():
        path.write_text(source)


def markdown(path):
    soup = BeautifulSoup(path.read_text(), "html.parser")
    title = plain(soup.h1) or plain(soup.title)
    body = soup.select_one("article.case-study-content") or soup.find("main") or soup.body
    for node in body.select("script, style, nav, footer, .header_section, #preloader, #contact-modal, #contact-cta, .btntabs, .case-related, .cta-bottom"):
        node.decompose()
    lines = ["# " + title, "", "Source: " + page_url(path), ""]
    for node in body.find_all(["h2", "h3", "h4", "p", "li", "summary", "address"]):
        if node.find_parent(["li", "address"]):
            continue
        text = plain(node).rstrip(" ⌄")
        if not text:
            continue
        prefix = "## " if node.name.startswith("h") else "- " if node.name == "li" else ""
        lines.extend([prefix + text, ""])
    return "\n".join(lines).rstrip() + "\n"


def discovery():
    indexable = [p for p in pages() if p.name not in NOINDEX]
    namespace = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", namespace)
    root = ET.Element(f"{{{namespace}}}urlset")
    for path in indexable:
        node = ET.SubElement(root, f"{{{namespace}}}url")
        ET.SubElement(node, f"{{{namespace}}}loc").text = page_url(path)
    ET.indent(root, space="  ")
    (ROOT / "sitemap.xml").write_bytes(ET.tostring(root, encoding="utf-8", xml_declaration=True) + b"\n")
    (ROOT / "robots.txt").write_text("User-agent: *\nAllow: /\nDisallow: /sendMail.php\n\nSitemap: " + BASE + "sitemap.xml\n")
    sections = {"Company and services": [], "Case studies": [], "Service areas": [], "Policies": []}
    full = []
    for path in indexable:
        rel = path.relative_to(ROOT).as_posix()
        soup = BeautifulSoup(path.read_text(), "html.parser")
        text = markdown(path)
        md_rel = "index.md" if rel == "index.html" else rel + ".md"
        (ROOT / md_rel).write_text(text)
        source = replace_link(path.read_text(), "alternate", BASE + md_rel, ' type="text/markdown"')
        path.write_text(source)
        section = "Case studies" if rel.startswith("case-studies/") else "Service areas" if rel.startswith("website-development-company-in-") else "Policies" if "privacy" in rel or "policy" in rel or rel == "terms-of-service.html" else "Company and services"
        desc = soup.find("meta", attrs={"name": "description"})["content"]
        sections[section].append(f"- [{plain(soup.title)}]({BASE + md_rel}): {desc}")
        full.append(text)
    intro = "# Soance Innovations LLP\n\n> Soance develops websites, web applications, mobile apps, custom software, automation and AI solutions for businesses.\n\nBased in Kadirur, Kannur, Kerala, India, and serving customers in India and internationally. Business enquiries: info@soance.com; +91 8217445213. Canonical website: https://www.soance.com/.\n\nThe case-study library includes client projects and explicitly fictionalized scenarios. Fictional company identities and illustrative outcomes are not real customer evidence. Service-area pages describe places served, not separate offices. Refer to the linked pages for context.\n"
    llms = intro + "\n" + "\n\n".join("## " + name + "\n\n" + "\n".join(links) for name, links in sections.items())
    llms += "\n\n## Optional\n\n- [Full site text](https://www.soance.com/llms-full.txt): Combined readable content from the indexable pages.\n- [XML sitemap](https://www.soance.com/sitemap.xml): Canonical HTML URLs.\n"
    (ROOT / "llms.txt").write_text(llms)
    (ROOT / "llms-full.txt").write_text(intro + "\n---\n\n" + "\n---\n\n".join(full))
    print(f"Updated SEO, sitemap and AI-readable content for {len(indexable)} indexable pages.")


def main():
    for page in pages():
        update_page(page)
    discovery()


if __name__ == "__main__":
    main()
