(function () {
    'use strict';

    var studies = Array.isArray(window.SOANCE_CASE_STUDIES)
        ? window.SOANCE_CASE_STUDIES
        : [];

    function studyUrl(study) {
        return 'case-studies/' + encodeURIComponent(study.slug) + '.html';
    }

    function createCard(study) {
        var article = document.createElement('article');
        article.id = 'case-' + study.slug;
        article.className = 'case-study-card' + (study.image ? '' : ' case-study-card--no-image');

        if (study.image) {
            var mediaLink = document.createElement('a');
            mediaLink.className = 'case-study-card__media';
            mediaLink.href = studyUrl(study);
            mediaLink.setAttribute('aria-label', 'Read ' + study.title);

            var image = document.createElement('img');
            image.className = 'case-study-card__photo';
            image.src = study.image;
            image.alt = study.title;
            image.loading = 'lazy';
            image.decoding = 'async';
            mediaLink.appendChild(image);

            if (study.logo) {
                var logoBadge = document.createElement('span');
                logoBadge.className = 'case-study-card__media-logo';
                var logoImage = document.createElement('img');
                logoImage.src = study.logo;
                logoImage.alt = study.company + (study.fictional ? ' fictional logo' : ' case study wordmark');
                logoImage.loading = 'lazy';
                logoImage.decoding = 'async';
                logoBadge.appendChild(logoImage);
                mediaLink.appendChild(logoBadge);
            }
            article.appendChild(mediaLink);
        }

        var content = document.createElement('div');
        content.className = 'case-study-card__content';

        var brand = document.createElement('p');
        brand.className = 'case-study-card__brand';
        brand.textContent = study.company + ' · ' + study.industry;

        var heading = document.createElement('h2');
        heading.className = 'case-study-card__title';
        var titleLink = document.createElement('a');
        titleLink.href = studyUrl(study);
        titleLink.textContent = study.title;
        heading.appendChild(titleLink);

        var summary = document.createElement('p');
        summary.className = 'case-study-card__summary';
        summary.textContent = study.excerpt
            ? 'Summary / TLDR ' + study.excerpt
            : 'See how strategy, design, and technology came together to move this digital product forward.';

        var readLink = document.createElement('a');
        readLink.className = 'case-study-card__link';
        readLink.href = studyUrl(study);
        readLink.textContent = 'Read case study';
        readLink.setAttribute('aria-label', 'Read case study: ' + study.title);

        content.appendChild(brand);
        content.appendChild(heading);
        content.appendChild(summary);
        content.appendChild(readLink);
        article.appendChild(content);
        return article;
    }

    function renderGrid(target, records) {
        if (!target) return;
        var fragment = document.createDocumentFragment();
        records.forEach(function (study) {
            fragment.appendChild(createCard(study));
        });
        target.replaceChildren(fragment);
    }

    function updateMetadata(study) {
        document.title = study.title + ' | Soance Case Study';

        var description = document.querySelector('meta[name="description"]');
        if (description) description.setAttribute('content', study.excerpt);

        var canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            canonical.setAttribute(
                'href',
                'https://www.soance.com/case-studies/' + encodeURIComponent(study.slug) + '.html'
            );
        }

        var socialUrl = document.querySelector('meta[property="og:url"]');
        if (socialUrl) {
            socialUrl.setAttribute(
                'content',
                'https://www.soance.com/case-studies/' + encodeURIComponent(study.slug) + '.html'
            );
        }

        var socialTitle = document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]');
        socialTitle.forEach(function (meta) {
            meta.setAttribute('content', study.title + ' | Soance');
        });
        var socialDescription = document.querySelectorAll('meta[property="og:description"], meta[name="twitter:description"]');
        socialDescription.forEach(function (meta) {
            meta.setAttribute('content', study.excerpt);
        });
        var socialImage = document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]');
        socialImage.forEach(function (meta) {
            meta.setAttribute('content', new URL(study.image, window.location.href).href);
        });

        var schema = document.getElementById('case-study-schema');
        if (schema) {
            var pageUrl = 'https://www.soance.com/case-studies/' + encodeURIComponent(study.slug) + '.html';
            schema.textContent = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: study.title,
                description: study.excerpt,
                image: new URL(study.image, 'https://www.soance.com/').href,
                url: pageUrl,
                mainEntityOfPage: pageUrl,
                articleSection: study.industry,
                datePublished: study.datePublished || '2026-07-14',
                dateModified: '2026-07-22',
                author: {
                    '@type': 'Organization',
                    name: 'Soance Innovations LLP',
                    url: 'https://www.soance.com/'
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Soance Innovations LLP',
                    url: 'https://www.soance.com/',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://www.soance.com/images/soance.png'
                    }
                },
                about: study.fictional
                    ? 'Transparent fictionalized digital product case study'
                    : 'Digital product client case study'
            });
        }
    }

    function renderStudyTitle(target, study) {
        if (!target) return;
        target.textContent = study.title;
    }

    function showMissingStudy(shell) {
        if (!shell) return;
        shell.removeAttribute('hidden');
        shell.innerHTML = '';
        var empty = document.createElement('section');
        empty.className = 'case-empty';
        empty.innerHTML = '<h1>Case study not found</h1>' +
            '<p>The story you requested may have moved. Browse the complete Soance case-study library instead.</p>' +
            '<a href="case-studies.html">View all case studies</a>';
        shell.appendChild(empty);
    }

    function renderDetail() {
        var shell = document.getElementById('case-study-detail');
        if (!shell) return;

        var requested = new URLSearchParams(window.location.search).get('case');
        var study = studies.find(function (item) {
            return item.slug === requested;
        });
        if (!study) {
            showMissingStudy(shell);
            return;
        }

        updateMetadata(study);
        var title = document.getElementById('case-study-title');
        var client = document.getElementById('case-study-client');
        var readingTime = document.getElementById('case-study-reading-time');
        var content = document.getElementById('case-study-content');
        var related = document.getElementById('related-case-studies');

        renderStudyTitle(title, study);
        if (client) {
            client.textContent = study.company + ' · ' + study.industry + ' · ' +
                (study.fictional ? 'Fictional client' : 'Client project');
        }
        if (readingTime) {
            readingTime.textContent = 'Reading time about ' + study.readingMinutes + ' mins';
        }
        if (content) {
            content.innerHTML = study.content;
            content.querySelectorAll('figure').forEach(function (figure) {
                if (!figure.querySelector('img')) figure.remove();
            });
            var sectionLinks = {
                'summary': '#bgsection',
                'overview': '#overviewBlock',
                'challenges': '#challengesBlock',
                'solution': '#solutionBlock',
                'results': '#resultsBlock'
            };
            content.querySelectorAll('.btntabs a').forEach(function (link) {
                var destination = sectionLinks[link.textContent.trim().toLowerCase()];
                if (destination && content.querySelector(destination)) {
                    link.setAttribute('href', destination);
                } else {
                    var button = link.closest('.wp-block-button');
                    if (button) button.remove();
                }
            });
        }

        if (related) {
            var currentIndex = studies.indexOf(study);
            var nextStudies = [];
            for (var offset = 1; offset <= 3; offset += 1) {
                nextStudies.push(studies[(currentIndex + offset) % studies.length]);
            }
            renderGrid(related, nextStudies);
        }

        shell.removeAttribute('hidden');
    }

    var listingGrid = document.getElementById('case-studies-grid');
    if (listingGrid && !listingGrid.querySelector('.case-study-card')) {
        renderGrid(listingGrid, studies);
    }
    renderDetail();
}());
