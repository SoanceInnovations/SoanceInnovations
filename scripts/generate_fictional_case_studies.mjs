import fs from 'node:fs';
import path from 'node:path';
import { buildSourceCaseStudies } from './source_case_studies.mjs';

const root = path.resolve(import.meta.dirname, '..');
const logoDir = path.join(root, 'images', 'case-studies', 'logos');

const cases = [
  { slug: 'loomora-artisan-marketplace', company: 'Loomora', industry: 'Artisan commerce', type: 'mobile', accent: '#E56A3A', accent2: '#F7C873', title: 'Taking Independent Craft Brands Global with the Loomora Marketplace App', profile: 'a curated marketplace connecting independent craft makers with design-conscious buyers', need: 'a mobile marketplace that made product discovery, maker stories, multi-vendor inventory, and international checkout feel effortless', features: ['maker storefronts and origin stories', 'multi-currency checkout and localized discovery', 'vendor inventory and order management'] },
  { slug: 'vendracart-b2b-commerce', company: 'VendraCart', industry: 'B2B commerce', type: 'commerce', accent: '#6C5CE7', accent2: '#00C2A8', title: 'Designing a Faster B2B E-commerce Experience for VendraCart', profile: 'a wholesale sourcing platform for independent retailers', need: 'a conversion-focused commerce experience that simplified bulk ordering, negotiated pricing, and repeat purchases', features: ['tiered pricing and account-specific catalogs', 'bulk order creation and rapid reordering', 'search, filters, and inventory visibility'] },
  { slug: 'pixelcrest-agency-website', company: 'PixelCrest', industry: 'Digital services', type: 'website', accent: '#2346D8', accent2: '#72E5F2', title: 'Rebuilding PixelCrest’s Website for Speed, Security, and Qualified Leads', profile: 'a strategy and digital experience studio serving growth-stage companies', need: 'a modern website that loaded quickly, communicated expertise clearly, and converted more qualified visitors', features: ['modular service and case-study pages', 'Core Web Vitals and technical SEO improvements', 'secure forms and a flexible editorial workflow'] },
  { slug: 'crewcanvas-people-operations', company: 'CrewCanvas', industry: 'Media operations', type: 'enterprise', accent: '#F04E6E', accent2: '#FFBE5C', title: 'Creating a Unified People Operations Module for CrewCanvas', profile: 'a distributed media production network coordinating specialist talent across markets', need: 'one operational module for profiles, availability, assignments, approvals, and team reporting', features: ['searchable talent profiles and skills', 'assignment planning and approval flows', 'role-based access and operational reporting'] },
  { slug: 'searchvista-ranking-intelligence', company: 'SearchVista', industry: 'Marketing analytics', type: 'dashboard', accent: '#0B8F6A', accent2: '#A5E55D', title: 'Turning Search Data into Decisions with the SearchVista Intelligence Platform', profile: 'an SEO consultancy managing complex portfolios of search campaigns', need: 'a consolidated ranking and performance platform that transformed fragmented data into clear priorities', features: ['keyword and competitor monitoring', 'Power BI reporting and scheduled data refreshes', 'client workspaces with actionable alerts'] },
  { slug: 'protoharbor-product-team', company: 'ProtoHarbor', industry: 'Product design', type: 'enterprise', accent: '#5A4AE3', accent2: '#E0A4FF', title: 'Scaling Mission-Critical Product Delivery for ProtoHarbor', profile: 'a product design partner working on enterprise transformation programs', need: 'an embedded engineering team that could increase delivery capacity without weakening design quality or governance', features: ['cross-functional sprint teams', 'shared component and quality standards', 'release planning and engineering documentation'] },
  { slug: 'alturax-asset-marketplace', company: 'AlturaX', industry: 'Financial technology', type: 'platform', accent: '#0D2340', accent2: '#35D0BA', title: 'Building a Trusted Digital Asset Marketplace for AlturaX', profile: 'a financial technology venture making private-market opportunities easier to discover and evaluate', need: 'a secure platform for listings, due diligence, investor onboarding, and controlled deal participation', features: ['verified asset listings and document rooms', 'investor onboarding and suitability checks', 'permissioned workflows and audit trails'] },
  { slug: 'rupeeroot-financial-learning', company: 'RupeeRoot', industry: 'Financial education', type: 'content', accent: '#12735A', accent2: '#F4B942', title: 'Making Personal Finance Easier to Understand with RupeeRoot', profile: 'an independent financial education platform for first-time investors and young families', need: 'a trusted content experience that made complex money decisions practical, searchable, and approachable', features: ['structured learning paths and calculators', 'topic hubs with expert-reviewed articles', 'newsletter capture and personalized reading lists'] },
  { slug: 'brimora-fashion-commerce', company: 'Brimora', industry: 'Fashion retail', type: 'commerce', accent: '#171717', accent2: '#FF785A', title: 'Launching a Bold Direct-to-Consumer Storefront for Brimora', profile: 'a contemporary accessories label focused on versatile caps and everyday essentials', need: 'a mobile-first storefront that balanced editorial brand expression with frictionless shopping', features: ['collection-led product discovery', 'size, color, and stock variants', 'fast checkout and lifecycle marketing integrations'] },
  { slug: 'dwellara-property-platform', company: 'Dwellara', industry: 'Real estate', type: 'website', accent: '#1E6B5C', accent2: '#D7B06A', title: 'Creating a High-Trust Property Discovery Experience for Dwellara', profile: 'a residential property advisory helping families evaluate new developments', need: 'a credible digital presence that made projects, amenities, floor plans, and enquiries easy to navigate', features: ['project comparison and location discovery', 'interactive floor plans and availability', 'lead routing to the correct property advisor'] },
  { slug: 'masalamuse-recipe-platform', company: 'MasalaMuse', industry: 'Food media', type: 'content', accent: '#B33A3A', accent2: '#F2B84B', title: 'Serving a Faster, More Discoverable Recipe Experience for MasalaMuse', profile: 'a recipe publisher celebrating practical regional cooking for a global audience', need: 'a content platform that supported rich recipes, fast search, video, and dependable publishing at scale', features: ['ingredient and cuisine filters', 'structured recipe data and printable views', 'editorial workflows for articles and video'] },
  { slug: 'teppora-cleaning-platform', company: 'Teppora', industry: 'Home services', type: 'platform', accent: '#176B87', accent2: '#64CCC5', title: 'Simplifying Door-to-Door Carpet Care for Teppora', profile: 'an urban carpet cleaning service built around pickup, specialist care, and home delivery', need: 'an online booking experience that coordinated pricing, pickup slots, order status, and customer communication', features: ['room-based pricing and instant estimates', 'pickup scheduling and route coordination', 'order tracking with automated notifications'] },
  { slug: 'reloopr-resale-apps', company: 'ReLoopr', industry: 'Circular commerce', type: 'mobile', accent: '#287A4D', accent2: '#B9E769', title: 'Connecting Collectors and Retailers through ReLoopr’s Resale Apps', profile: 'a circular-commerce network helping businesses trade reusable materials and pre-owned goods', need: 'separate mobile experiences for collectors and retailers backed by one reliable transaction platform', features: ['role-specific Android and iOS workflows', 'pickup requests and offer negotiation', 'inventory, settlement, and transaction history'] },
  { slug: 'cleanaura-service-operations', company: 'CleanAura', industry: 'Home services', type: 'platform', accent: '#3478F6', accent2: '#82E9DE', title: 'Modernizing Service Operations and Customer Care for CleanAura', profile: 'a premium home-textile cleaning company serving multiple metropolitan areas', need: 'a dependable booking and operations platform with clearer service visibility and easier maintenance', features: ['service-area validation and pricing rules', 'operations dashboard and exception handling', 'content, security, and performance maintenance'] },
  { slug: 'eldasense-senior-health', company: 'EldaSense', industry: 'Digital health', type: 'mobile', accent: '#6A52C7', accent2: '#58D1C9', title: 'Supporting Independent Ageing with the EldaSense Health Companion', profile: 'a digital wellness venture helping older adults and caregivers follow everyday health routines', need: 'an accessible mobile companion that combined check-ins, reminders, guided assessments, and caregiver insights', features: ['large-type accessible interaction patterns', 'AI-assisted wellness check-ins', 'caregiver permissions and escalation alerts'] },
  { slug: 'verdurepath-sustainability-hub', company: 'VerdurePath', industry: 'Sustainability', type: 'content', accent: '#2B6B4F', accent2: '#C6D66A', title: 'Building a Practical Sustainability Knowledge Hub for VerdurePath', profile: 'a climate advisory translating long-term environmental goals into practical organizational action', need: 'a credible knowledge platform for programs, research, events, and stakeholder collaboration', features: ['topic-led resource library', 'program and impact storytelling', 'event registration and newsletter journeys'] },
  { slug: 'vectoryn-industrial-catalog', company: 'Vectoryn', industry: 'Advanced manufacturing', type: 'commerce', accent: '#273043', accent2: '#F6AE2D', title: 'Digitizing Precision Tool Discovery for Vectoryn', profile: 'a precision tooling manufacturer serving industrial production and specialist workshops', need: 'a technical product platform that made a large catalog searchable without sacrificing engineering detail', features: ['attribute-rich product taxonomy', 'technical document downloads and RFQs', 'distributor and application-based discovery'] },
  { slug: 'aarunova-college-website', company: 'Aarunova College', industry: 'Higher education', type: 'website', accent: '#7B1E3A', accent2: '#D7A84B', title: 'Creating an Accessible Digital Campus for Aarunova College', profile: 'a health sciences college offering degree programs, clinical training, and community education', need: 'a modern institutional website for admissions, departments, notices, accreditation, and student resources', features: ['program and department information architecture', 'admissions journeys and document downloads', 'notices, events, and governance publishing'] },
  { slug: 'cinecurrent-media-platform', company: 'CineCurrent', industry: 'Entertainment media', type: 'content', accent: '#7F2BFF', accent2: '#FF4D8D', title: 'Scaling Real-Time Entertainment Publishing for CineCurrent', profile: 'an entertainment newsroom covering film, streaming, interviews, and popular culture', need: 'a high-traffic publishing platform that kept editorial teams fast and readers engaged across devices', features: ['breaking-news and live-update workflows', 'video, gallery, and interview formats', 'performance, advertising, and analytics integration'] },
  { slug: 'pantrypeak-food-commerce', company: 'PantryPeak', industry: 'Consumer foods', type: 'commerce', accent: '#D14D2A', accent2: '#F2C14E', title: 'Transforming Direct-to-Consumer Food Commerce for PantryPeak', profile: 'a fresh packaged-food brand delivering convenient meal staples and pantry essentials', need: 'a reliable commerce platform for subscriptions, regional availability, recipes, and repeat ordering', features: ['location-aware catalog and delivery rules', 'subscriptions and smart reordering', 'product education, recipes, and bundles'] },
  { slug: 'buildnova-event-experience', company: 'BuildNova Expo', industry: 'Construction technology', type: 'event', accent: '#EB5E28', accent2: '#FFBF69', title: 'Driving Registrations with a Digital Event Experience for BuildNova Expo', profile: 'an industry event focused on emerging construction technology and design practice', need: 'a fast campaign site that explained the program, built credibility, and converted visitors into delegates', features: ['speaker, agenda, and partner modules', 'campaign landing pages and registration flows', 'real-time agenda updates and analytics'] },
  { slug: 'ujjiva-community-platform', company: 'Ujjiva Collective', industry: 'Social impact', type: 'website', accent: '#A63372', accent2: '#F6B6D2', title: 'Extending Community Impact through Ujjiva Collective’s New Website', profile: 'a nonprofit supporting women, migrant families, and community-led livelihoods', need: 'a warm, accessible website for programs, impact reporting, volunteering, partnerships, and donations', features: ['human-centered program storytelling', 'impact dashboards and downloadable reports', 'donation, volunteer, and partner journeys'] },
  { slug: 'ambiqo-advisory-website', company: 'Ambiqo', industry: 'Business advisory', type: 'website', accent: '#2F4858', accent2: '#00B4D8', title: 'Clarifying a Complex Advisory Offer through Ambiqo’s Website', profile: 'a consultancy helping leadership teams navigate ambiguous strategic and operational decisions', need: 'a focused website that translated a nuanced offer into clear services, proof, and conversion paths', features: ['audience-led service architecture', 'insight publishing and lead capture', 'modular case examples and consultant profiles'] },
  { slug: 'learnaut-education-platform', company: 'Learnaut', industry: 'Education technology', type: 'education', accent: '#4F46E5', accent2: '#22D3EE', title: 'Building a Flexible Learning Platform for Learnaut', profile: 'an education technology venture connecting learners with cohort courses and specialist mentors', need: 'one scalable platform for course discovery, enrollment, learning delivery, assessments, and support', features: ['course catalog and cohort enrollment', 'learning paths, assessments, and progress tracking', 'mentor sessions and learner support'] },
  { slug: 'matkarise-sports-promotion', company: 'MatkaRise League', industry: 'Sports and events', type: 'event', accent: '#D62828', accent2: '#F77F00', title: 'Energizing Regional Sports Promotion for MatkaRise League', profile: 'a modern league celebrating a high-energy traditional team sport', need: 'a campaign website for teams, fixtures, ticketing, sponsors, results, and fan engagement', features: ['team profiles and fixture publishing', 'ticketing calls to action and sponsor visibility', 'results, highlights, and social content'] },
  { slug: 'wealthorbit-planning-platform', company: 'WealthOrbit', industry: 'Personal finance', type: 'platform', accent: '#12355B', accent2: '#2EC4B6', title: 'Helping Families Make Confident Financial Decisions with WealthOrbit', profile: 'a planning platform designed around goals rather than isolated financial products', need: 'a guided digital journey for onboarding, goal planning, scenario comparison, and advisor collaboration', features: ['goal-based planning and scenario tools', 'secure document collection and task tracking', 'shared client and advisor workspaces'] },
  { slug: 'clinora-professional-app', company: 'Clinora Connect', industry: 'Healthcare technology', type: 'mobile', accent: '#0077B6', accent2: '#90E0EF', title: 'Creating a Smarter Professional Health Companion for Clinora Connect', profile: 'a clinical enablement platform supporting healthcare professionals in the field', need: 'a mobile ecosystem for resources, product guidance, learning, and compliant professional communication', features: ['role-based clinical resources', 'learning modules and knowledge checks', 'secure communication and activity history'] },
  { slug: 'carespan-referral-network', company: 'CareSpan', industry: 'Healthcare collaboration', type: 'mobile', accent: '#0A9396', accent2: '#94D2BD', title: 'Streamlining Specialist Referrals and Care Collaboration for CareSpan', profile: 'a care-coordination network linking primary practitioners with specialist teams', need: 'a clearer mobile workflow for referrals, case updates, secure messaging, and follow-up responsibilities', features: ['structured referral creation and triage', 'secure case-based communication', 'status tracking, reminders, and audit history'] },
  { slug: 'novaarc-institute-portal', company: 'NovaArc Institute', industry: 'Higher education', type: 'platform', accent: '#5F0F40', accent2: '#FB8B24', title: 'Transforming the Digital Campus Experience for NovaArc Institute', profile: 'a multidisciplinary engineering institute serving students, faculty, researchers, and industry partners', need: 'a unified institutional platform for programs, research, admissions, notices, and decentralized publishing', features: ['multi-department content governance', 'student, research, and admissions journeys', 'high-availability publishing and search'] },
  { slug: 'stepvera-orthopedic-commerce', company: 'Stepvera', industry: 'Consumer healthcare', type: 'mobile', accent: '#335C67', accent2: '#9E2A2B', title: 'Improving Orthopedic Product Access through the Stepvera Mobile Store', profile: 'a consumer health brand offering supports, braces, and mobility products', need: 'a guided mobile shopping experience that matched users with appropriate products and care information', features: ['symptom- and activity-led product discovery', 'fit guidance and educational content', 'saved routines, reorders, and support'] },
  { slug: 'civicnexa-knowledge-hub', company: 'CivicNexa', industry: 'Urban innovation', type: 'content', accent: '#3A86FF', accent2: '#8338EC', title: 'Creating an Urban Innovation Knowledge Hub for CivicNexa', profile: 'a city innovation initiative sharing practical programs, research, and technology pilots', need: 'an editorial platform that made complex civic programs understandable to residents and professional audiences', features: ['program stories and searchable resources', 'multilingual editorial workflows', 'accessible data highlights and newsletters'] },
  { slug: 'markora-ip-content', company: 'Markora IP', industry: 'Legal technology', type: 'content', accent: '#1D3557', accent2: '#E9C46A', title: 'Building Search Authority through Markora IP’s Expert Content Hub', profile: 'an intellectual property advisory supporting founders, creators, and growing companies', need: 'a credible knowledge hub that answered high-intent questions and converted readers into consultations', features: ['topic clusters for trademarks, patents, and copyright', 'expert review and publishing workflows', 'technical SEO, internal linking, and lead capture'] },
  { slug: 'chaincanvas-insights', company: 'ChainCanvas', industry: 'Emerging technology', type: 'content', accent: '#5B2A86', accent2: '#00F5D4', title: 'Explaining Emerging Technology through ChainCanvas Insights', profile: 'an innovation studio working across immersive media, digital ownership, and creator tools', need: 'a sophisticated editorial experience that made technical ideas accessible without diluting the brand', features: ['long-form articles and visual explainers', 'authoring workflows for technical contributors', 'topic taxonomy, search, and newsletter capture'] },
  { slug: 'insuredge-learning-platform', company: 'InsurEdge Academy', industry: 'Professional education', type: 'education', accent: '#023E8A', accent2: '#48CAE4', title: 'Launching a Professional Learning Platform for InsurEdge Academy', profile: 'a specialist training provider for insurance and risk professionals', need: 'a modern learning platform for self-paced courses, live cohorts, certification, and employer reporting', features: ['course commerce and cohort scheduling', 'assessments, certificates, and learner progress', 'enterprise enrollment and reporting'] },
  { slug: 'lendora-fintech-platform', company: 'Lendora', industry: 'Financial technology', type: 'platform', accent: '#006D77', accent2: '#E9C46A', title: 'Making Responsible Credit More Accessible with Lendora', profile: 'a digital lending venture focused on transparent, user-friendly personal finance', need: 'a secure application journey that simplified eligibility, document collection, verification, and servicing', features: ['guided eligibility and application flows', 'document capture and verification integrations', 'application status, repayment, and support'] },
  { slug: 'finovista-literacy-platform', company: 'Finovista Institute', industry: 'Financial education', type: 'education', accent: '#386641', accent2: '#A7C957', title: 'Modernizing Financial Education for Finovista Institute', profile: 'a professional institute delivering practical financial literacy and advisor development programs', need: 'a refreshed website and learning experience for course discovery, enrollment, resources, and certification', features: ['program comparison and guided enrollment', 'resource library and learning pathways', 'certificate management and alumni access'] },
  { slug: 'orthevia-health-catalog', company: 'Orthevia', industry: 'Healthcare manufacturing', type: 'commerce', accent: '#005F73', accent2: '#94D2BD', title: 'Reimagining a Complex Healthcare Catalog for Orthevia', profile: 'a healthcare manufacturer offering a broad range of orthopedic support products', need: 'a modern product platform that organized a large catalog around conditions, activities, fit, and clinical use', features: ['condition- and body-area-led navigation', 'technical specifications and fitting resources', 'dealer enquiries and content migration'] },
  { slug: 'motiveaxis-engineering-apps', company: 'MotiveAxis', industry: 'Engineering technology', type: 'enterprise', accent: '#2B2D42', accent2: '#EF8354', title: 'Designing Connected Engineering Workflows for MotiveAxis', profile: 'an engineering technology company supporting mobility and industrial product teams', need: 'two connected applications for field collaboration, issue capture, approvals, and program visibility', features: ['shared design system across both applications', 'offline field capture and synchronized records', 'role-based reviews, approvals, and analytics'] }
];

const templates = {
  mobile: {
    services: ['Product strategy and user research', 'Mobile UX and interface design', 'Cross-platform application development', 'API integration, QA, and launch support'],
    approach: 'We designed the experience around short, confidence-building tasks, then built a cross-platform application backed by secure APIs, analytics, and a maintainable design system.',
    outcomes: ['A clearer mobile journey with fewer decision points', 'A scalable product foundation for new services and markets', 'More consistent support, analytics, and release operations']
  },
  commerce: {
    services: ['Commerce strategy and information architecture', 'Responsive UX and visual design', 'Storefront and platform development', 'Search, checkout, analytics, and performance optimization'],
    approach: 'We mapped discovery and purchase journeys, created a modular commerce design system, and implemented a fast storefront connected to catalog, checkout, content, and analytics services.',
    outcomes: ['Faster product discovery and a more confident path to purchase', 'Simpler merchandising and content operations', 'A flexible commerce foundation ready for new categories and campaigns']
  },
  website: {
    services: ['Digital strategy and content architecture', 'Responsive website design', 'CMS implementation and migration', 'Accessibility, technical SEO, performance, and security'],
    approach: 'We clarified the story before designing a modular page system, then delivered a responsive CMS build with structured content, strong performance budgets, and measurable conversion paths.',
    outcomes: ['A clearer proposition and more useful customer journeys', 'Faster publishing with reusable page components', 'Improved accessibility, performance, and search readiness']
  },
  dashboard: {
    services: ['Analytics discovery and data modeling', 'Dashboard UX and information design', 'Data integration and reporting development', 'Permissions, alerts, and quality assurance'],
    approach: 'We aligned the reporting model to real decisions, consolidated data sources, and designed progressive dashboards that move from portfolio-level signals to detailed actions.',
    outcomes: ['A shared source of truth for performance conversations', 'Less manual reporting and faster issue identification', 'Clearer accountability through alerts and role-based views']
  },
  enterprise: {
    services: ['Workflow discovery and service design', 'Enterprise UX and design systems', 'Application engineering and integration', 'Quality assurance, documentation, and release support'],
    approach: 'We mapped roles, decisions, and exception paths, designed a shared component system, and delivered modular workflows that integrate cleanly with the wider technology environment.',
    outcomes: ['More consistent work across teams and locations', 'Reduced duplication through shared workflows and standards', 'A maintainable platform for future modules and integrations']
  },
  platform: {
    services: ['Platform strategy and requirements definition', 'User experience and interface design', 'Full-stack application development', 'Cloud architecture, security, analytics, and support'],
    approach: 'We translated the operating model into a role-based platform, validated the highest-risk workflows early, and built a scalable web application with secure integrations and observable infrastructure.',
    outcomes: ['A single digital journey across previously fragmented tasks', 'Better visibility for customers and operational teams', 'A scalable architecture with clearer governance and support']
  },
  content: {
    services: ['Content strategy and information architecture', 'Editorial experience design', 'CMS and front-end development', 'Search, structured data, analytics, and performance'],
    approach: 'We organized the content around audience intent, created reusable editorial formats, and delivered a fast publishing platform with strong search, structured metadata, and accessible reading patterns.',
    outcomes: ['More discoverable content and stronger topic authority', 'A faster, more consistent editorial workflow', 'Improved reading experience across mobile and desktop']
  },
  event: {
    services: ['Campaign strategy and conversion planning', 'Event website and landing-page design', 'CMS development and registration integration', 'Analytics, performance, and launch support'],
    approach: 'We shaped a high-energy event story, prioritized the information visitors need to register, and built flexible campaign modules that the event team could update in real time.',
    outcomes: ['A clearer path from interest to registration', 'Faster updates for speakers, schedules, and partners', 'Reusable campaign components for future editions']
  },
  education: {
    services: ['Learning experience and platform strategy', 'Course discovery and learner UX', 'LMS and application development', 'Assessment, certification, analytics, and support'],
    approach: 'We designed the experience around learner momentum, connected discovery and enrollment to delivery, and implemented role-based tools for learners, instructors, and program administrators.',
    outcomes: ['A smoother journey from course discovery to completion', 'Better visibility into learner progress and support needs', 'A reusable learning foundation for new programs and audiences']
  }
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function initials(company) {
  return company.split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

function logoMark(c, index, x = 0, y = 0, scale = 1) {
  const mark = index % 5;
  const size = 76 * scale;
  const radius = 18 * scale;
  const ix = escapeHtml(initials(c.company));
  const base = `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${radius}" fill="${c.accent}"/>`;
  const decor = [
    `<circle cx="${x + size * .68}" cy="${y + size * .32}" r="${size * .2}" fill="${c.accent2}" opacity=".9"/>`,
    `<path d="M${x + size * .2} ${y + size * .72}L${x + size * .5} ${y + size * .16}L${x + size * .8} ${y + size * .72}Z" fill="${c.accent2}" opacity=".82"/>`,
    `<rect x="${x + size * .48}" y="${y + size * .08}" width="${size * .42}" height="${size * .42}" rx="${size * .12}" fill="${c.accent2}" opacity=".86"/>`,
    `<circle cx="${x + size * .5}" cy="${y + size * .5}" r="${size * .33}" fill="none" stroke="${c.accent2}" stroke-width="${size * .11}"/>`,
    `<path d="M${x + size * .15} ${y + size * .5}C${x + size * .3} ${y + size * .12},${x + size * .7} ${y + size * .88},${x + size * .85} ${y + size * .5}" fill="none" stroke="${c.accent2}" stroke-width="${size * .12}" stroke-linecap="round"/>`
  ][mark];
  return `${base}${decor}<text x="${x + size / 2}" y="${y + size * .61}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="${size * .26}" font-weight="800" fill="#fff">${ix}</text>`;
}

function logoSvg(c, index) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="160" viewBox="0 0 640 160" role="img" aria-labelledby="title"><title id="title">${escapeHtml(c.company)} fictional company logo</title>${logoMark(c, index, 24, 40, 1)}<text x="124" y="91" font-family="Inter,Arial,sans-serif" font-size="48" font-weight="750" letter-spacing="-1.5" fill="#101828">${escapeHtml(c.company)}</text><text x="126" y="120" font-family="Inter,Arial,sans-serif" font-size="15" font-weight="650" letter-spacing="2.2" fill="#667085">${escapeHtml(c.industry.toUpperCase())}</text></svg>`;
}

function mockup(c, index) {
  const type = c.type;
  const bar = (x, y, w, h, opacity = .14) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(h / 2, 10)}" fill="${c.accent}" opacity="${opacity}"/>`;
  if (type === 'mobile') {
    return `<rect x="580" y="96" width="224" height="498" rx="38" fill="#fff"/><rect x="830" y="126" width="224" height="468" rx="38" fill="#F7F8FC"/><rect x="652" y="112" width="80" height="8" rx="4" fill="#D0D5DD"/>${bar(610,174,164,104,.16)}${bar(610,300,164,18,.22)}${bar(610,337,118,12,.12)}${bar(610,382,76,76,.18)}${bar(698,382,76,76,.1)}${bar(860,198,164,18,.25)}${bar(860,236,120,12,.12)}${bar(860,290,164,92,.16)}${bar(860,410,164,48,.22)}`;
  }
  if (type === 'commerce') {
    return `<rect x="478" y="92" width="650" height="520" rx="24" fill="#fff"/><rect x="478" y="92" width="650" height="58" rx="24" fill="#F7F8FC"/><circle cx="510" cy="121" r="7" fill="#F97066"/><circle cx="533" cy="121" r="7" fill="#FDB022"/><circle cx="556" cy="121" r="7" fill="#32D583"/>${[0,1,2,3].map((n)=>`<rect x="${512+n*146}" y="190" width="122" height="166" rx="14" fill="#F2F4F7"/>${bar(528+n*146,212,90,82,.15)}${bar(528+n*146,310,70,10,.22)}${bar(528+n*146,332,54,8,.11)}`).join('')}${bar(512,398,570,28,.14)}${bar(512,452,360,14,.2)}${bar(512,482,480,12,.1)}${bar(512,540,142,38,.9)}`;
  }
  if (type === 'website' || type === 'event' || type === 'content') {
    return `<rect x="448" y="88" width="680" height="524" rx="24" fill="#fff"/><rect x="448" y="88" width="680" height="56" rx="24" fill="#F7F8FC"/>${bar(486,108,86,16,.85)}${bar(886,110,52,12,.14)}${bar(954,110,52,12,.14)}${bar(1022,106,72,22,.75)}${bar(486,188,296,34,.9)}${bar(486,242,240,15,.18)}${bar(486,273,274,13,.1)}${bar(486,316,132,40,.9)}${bar(832,176,246,206,.18)}${[0,1,2].map((n)=>`<rect x="${486+n*196}" y="426" width="172" height="132" rx="14" fill="#F2F4F7"/>${bar(504+n*196,448,92,14,.2)}${bar(504+n*196,480,132,10,.1)}${bar(504+n*196,504,112,10,.1)}`).join('')}`;
  }
  return `<rect x="452" y="88" width="676" height="524" rx="24" fill="#fff"/><rect x="452" y="88" width="176" height="524" rx="24" fill="#F7F8FC"/>${bar(484,126,96,20,.85)}${[0,1,2,3,4].map((n)=>bar(484,190+n*54,110-(n%2)*18,12,.13)).join('')}<text x="676" y="142" font-family="Inter,Arial,sans-serif" font-size="17" font-weight="700" fill="#344054">Overview</text>${bar(676,172,196,18,.14)}${bar(676,218,404,118,.12)}<polyline points="700,305 758,270 818,286 886,238 946,258 1032,202" fill="none" stroke="${c.accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>${[0,1,2].map((n)=>`<rect x="${676+n*138}" y="382" width="118" height="84" rx="12" fill="#F2F4F7"/>${bar(694+n*138,404,66,12,.2)}${bar(694+n*138,434,82,10,.1)}`).join('')}${bar(676,508,404,18,.12)}${bar(676,544,318,14,.09)}`;
}

function coverSvg(c, index) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720" role="img" aria-labelledby="title desc"><title id="title">${escapeHtml(c.company)} case study cover</title><desc id="desc">Original fictional brand and digital product interface artwork for ${escapeHtml(c.company)}</desc><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#08111F"/><stop offset="1" stop-color="${c.accent}"/></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="22" stdDeviation="24" flood-color="#000" flood-opacity=".24"/></filter></defs><rect width="1200" height="720" fill="url(#bg)"/><circle cx="110" cy="640" r="260" fill="${c.accent2}" opacity=".11"/><circle cx="1110" cy="40" r="220" fill="#fff" opacity=".05"/><g transform="translate(70 70)">${logoMark(c, index, 0, 0, .82)}</g><text x="70" y="184" font-family="Inter,Arial,sans-serif" font-size="43" font-weight="760" fill="#fff">${escapeHtml(c.company)}</text><text x="70" y="220" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="650" letter-spacing="2.7" fill="#fff" opacity=".7">${escapeHtml(c.industry.toUpperCase())}</text><text x="70" y="300" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="650" fill="#fff" opacity=".88">FICTIONAL CLIENT CASE STUDY</text><text x="70" y="342" font-family="Inter,Arial,sans-serif" font-size="16" fill="#fff" opacity=".65">Strategy · Design · Engineering</text><g filter="url(#shadow)">${mockup(c, index)}</g></svg>`;
}

function contentHtml(c, index) {
  const t = templates[c.type];
  const image = `images/case-studies/photos/${photoFor(c)}.webp`;
  const logo = `images/case-studies/logos/${c.slug}.svg`;
  const services = t.services.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  const challenges = c.features.map((item) => `<li><strong>${escapeHtml(item.charAt(0).toUpperCase() + item.slice(1))}:</strong> The experience needed to support this capability without adding unnecessary complexity for users or operational teams.</li>`).join('');
  const solutions = c.features.map((item) => `<li>Designed and validated ${escapeHtml(item)} as part of one coherent, role-aware product journey.</li>`).join('');
  const outcomes = t.outcomes.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  return `<div class="wp-block-columns"><div class="wp-block-column single-post-container"><div class="wp-block-buttons btntabs"><div class="wp-block-button"><a class="wp-block-button__link">Summary</a></div><div class="wp-block-button"><a class="wp-block-button__link">Overview</a></div><div class="wp-block-button"><a class="wp-block-button__link">Challenges</a></div><div class="wp-block-button"><a class="wp-block-button__link">Solution</a></div><div class="wp-block-button"><a class="wp-block-button__link">Results</a></div></div></div></div>
<div class="wp-block-columns" id="bgsection"><div class="wp-block-column single-post-container bgimg-main"><div class="wp-block-spacer" style="height:60px" aria-hidden="true"></div><div class="case-fictional-note"><strong>Fictionalized client profile</strong><span>Created to demonstrate a realistic delivery scenario without identifying a real customer.</span></div><h3 id="h-summary-tldr">Summary / TLDR</h3><p>${escapeHtml(c.company)} is ${escapeHtml(c.profile)}. The team needed ${escapeHtml(c.need)}.</p><p>Soance shaped the strategy, experience, and technical foundation around measurable user and operational needs, then translated the concept into a launch-ready digital product.</p><figure class="wp-block-image"><img src="${image}" alt="${escapeHtml(c.company)} fictional case study product concept" class="case-study-source-image" loading="lazy"></figure><div class="wp-block-spacer" style="height:50px" aria-hidden="true"></div></div></div>
<div class="wp-block-columns"><div class="wp-block-column single-post-container" id="overviewBlock"><img class="case-client-logo" src="${logo}" alt="${escapeHtml(c.company)} fictional logo" loading="lazy"><h3>Overview</h3><p><strong>${escapeHtml(c.company)}</strong> is a fictional ${escapeHtml(c.industry.toLowerCase())} company created for this representative portfolio story. Its operating context, user needs, and delivery constraints are modeled on realistic digital transformation engagements.</p><p>The core brief was to deliver ${escapeHtml(c.need)} while giving internal teams a system they could confidently operate, measure, and evolve after launch.</p><h4>Services provided</h4><ul>${services}</ul></div></div>
<div class="wp-block-columns"><div class="wp-block-column single-post-container" id="challengesBlock"><h3>Challenges</h3><p>The project needed to balance a polished customer experience with the less-visible realities of content, operations, permissions, integrations, and long-term maintainability.</p><ul>${challenges}</ul></div></div>
<div class="wp-block-columns"><div class="wp-block-column single-post-container" id="solutionBlock"><h3>Solution</h3><p>${escapeHtml(t.approach)}</p><ul>${solutions}</ul><p>A shared design system, instrumentation plan, and staged release approach kept the product coherent while allowing the team to learn from realistic usage patterns.</p></div></div>
<div class="wp-block-columns"><div class="wp-block-column single-post-container" id="resultsBlock"><h3>Illustrative outcomes</h3><p>Because ${escapeHtml(c.company)} is fictional, these outcomes describe the intended value of the solution rather than claims about a real client engagement.</p><ul>${outcomes}</ul></div></div>
<div class="wp-block-columns"><div class="wp-block-column cta-bottom"><div class="wp-block-columns"><div class="wp-block-column" style="flex-basis:66.66%"><p><strong>Have a similar challenge?</strong> Let’s turn your idea into a practical, measurable digital product.</p></div><div class="wp-block-column" style="flex-basis:33.33%"><div class="wp-block-button btnyellow"><a class="wp-block-button__link" href="contact.html">Let’s talk</a></div></div></div></div></div>`;
}

fs.mkdirSync(logoDir, { recursive: true });

function photoFor(c) {
  const versionedPhotos = {
    'insuredge-learning-platform': 'unique/insuredge-learning-platform-v2',
    'lendora-fintech-platform': 'unique/lendora-fintech-platform-v2',
    'finovista-literacy-platform': 'unique/finovista-literacy-platform-v2'
  };
  if (versionedPhotos[c.slug]) return versionedPhotos[c.slug];
  const uniquePhoto = path.join(root, 'images', 'case-studies', 'photos', 'unique', `${c.slug}.webp`);
  if (fs.existsSync(uniquePhoto)) return `unique/${c.slug}`;
  if (c.slug === 'loomora-artisan-marketplace') return 'artisan-marketplace';
  if (c.industry === 'Home services') return 'home-services';
  if (c.industry === 'Real estate') return 'property-design';
  if (['Food media', 'Consumer foods'].includes(c.industry)) return 'food-content';
  if (/health/i.test(c.industry)) return 'digital-health';
  if (/education/i.test(c.industry)) return 'learning-workshop';
  if (['Sustainability', 'Advanced manufacturing', 'Construction technology', 'Engineering technology', 'Circular commerce'].includes(c.industry)) return 'industrial-sustainability';
  if (c.type === 'dashboard' || /finance|financial/i.test(c.industry)) return 'analytics-workspace';
  if (c.type === 'commerce') return 'commerce-warehouse';
  if (c.type === 'enterprise') return 'enterprise-operations';
  return 'creative-studio';
}

const fictionalRecords = cases.map((c, index) => {
  fs.writeFileSync(path.join(logoDir, `${c.slug}.svg`), logoSvg(c, index));
  return {
    slug: c.slug,
    company: c.company,
    industry: c.industry,
    title: c.title,
    excerpt: `${c.company}, ${c.profile}, needed ${c.need}. This fictionalized case study shows a realistic strategy, design, and engineering response.`,
    image: `images/case-studies/photos/${photoFor(c)}.webp`,
    logo: `images/case-studies/logos/${c.slug}.svg`,
    readingMinutes: 4 + (index % 4),
    fictional: true,
    content: contentHtml(c, index)
  };
});

const records = [...fictionalRecords, ...buildSourceCaseStudies(root)];

const duplicatePhotos = records
  .map((record) => record.image)
  .filter((image, index, images) => images.indexOf(image) !== index);
if (duplicatePhotos.length) {
  throw new Error(`Every case study must have a unique photo. Duplicate paths: ${[...new Set(duplicatePhotos)].join(', ')}`);
}

fs.writeFileSync(
  path.join(root, 'js', 'case-studies-data.js'),
  `/* Portfolio case studies generated by scripts/generate_fictional_case_studies.mjs. */\nwindow.SOANCE_CASE_STUDIES=${JSON.stringify(records)};\n`
);

console.log(`Generated ${records.length} case studies (${fictionalRecords.length} fictionalized and ${records.length - fictionalRecords.length} source-backed).`);
