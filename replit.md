# FEI Consultores — Web Platform

## Overview
Premium consulting website for FEI Consultores, specializing in fiscal materiality evidence (materialidad fiscal) for Mexican companies. The site serves as a public-facing platform and includes a client portal and admin panel.

## Architecture

### Tech Stack
- **Frontend**: React + Vite (TypeScript), Tailwind CSS, Framer Motion, Radix UI
- **Backend**: Express.js (TypeScript), PostgreSQL (Drizzle ORM)
- **Auth**: Passport.js + magic links for client portal, session-based for admin
- **AI Agents**: Custom orchestrator with 5 agents (content formatter, orthography, SEO optimizer, fiscal validator, content auditor)

### Key Routes
- `/` — Home page (hero, sections, metrics, services, trust, CTA)
- `/servicios` — Services page with detailed service cards
- `/contacto` — Contact page with form connected to `/api/contact`
- `/blog` — Blog listing (loads from `/api/blog/posts`)
- `/blog/:slug` — Individual blog post
- `/faq` — FAQ accordion (Radix UI)
- `/aviso-privacidad` — Legal/privacy page
- `/acceso` — Client login (magic link)
- `/portal` — Client portal
- `/admin/*` — Admin panel

### Config System
All site content comes from config files:
- `config/brand.ts` — Brand colors, fonts, logo, contact info
- `config/content/home.ts` — All homepage sections content
- `config/content/servicios.ts` — Services page content
- `config/content/faq.ts` — FAQ categories and questions
- `config/content/legal.ts` — Privacy notice content
- `config/content/footer.ts` — Footer description, copyright, certifications
- `config/navigation.ts` — Main nav, footer nav, CTA
- `config/seo.ts` — SEO titles and descriptions per page

## Design System (Premium — Stripe/Linear level)
- **Base color**: `#0D1117` (navy-dark / dark)
- **Surface**: `#1A2332` (navy), `#2D3A4E` (navy-light)
- **Primary accent**: `#4CC9F0` (cyan), `#7DD8F4` (cyan-light)
- **Secondary accent**: `#7B61FF` (purple), `#9B85FF` (purple-light)
- **Fonts**: Plus Jakarta Sans (heading, 800 weight), Inter (body)
- **Glass surfaces**: `glass-surface` (backdrop-blur-2xl, inner light highlight, gradient bg), `glass-surface-hover`, `glass-surface-interactive`
- **Premium buttons**: `btn-primary-premium` (gradient shimmer + glow), `btn-secondary-premium` (glass border)
- **Gradient text**: `text-gradient-hero` (animated white→cyan→purple), `text-gradient-cyan`, `text-gradient-white`
- **Text glow**: `text-glow`, `text-glow-strong`
- **Background FX**: `perspective-grid` (3D CSS grid), `gradient-orb` (animated float), `gradient-orb-purple`, `gradient-orb-lg`, `noise-overlay` (grain texture)
- **Borders**: `gradient-border` (animated gradient), `animated-border-glow` (conic gradient on hover)
- **Section dividers**: `section-divider-cyan`, `section-divider-fade`
- **Backgrounds**: `bg-grid-pattern`, `bg-grid-fine`, `bg-dot-pattern`, `geo-bg`, `dot-bg`
- **Shadows**: `shadow-glow-cyan-*` (sm/md/lg/xl), `shadow-card-dark`, `shadow-card-elevated`, `shadow-inner-glow`

## Component Structure
```
client/src/
  pages/
    Home.tsx              — Composed from section components
    Servicios.tsx         — Services page
    Contacto.tsx          — Contact form + info
    Blog.tsx              — Blog listing grid
    BlogPost.tsx          — Individual post
    FAQ.tsx               — Accordion FAQ
    Legal.tsx             — Privacy notice
    not-found.tsx         — 404 page
    admin/                — Admin panel (DO NOT MODIFY)
    AccesoPage.tsx        — Client login (DO NOT MODIFY)
    PortalPage.tsx        — Client portal (DO NOT MODIFY)
  components/
    Header.tsx            — Sticky nav with mobile sheet
    Footer.tsx            — 4-column footer with newsletter
    SEOHead.tsx           — SEO meta tags
    sections/
      HeroSection.tsx     — Large headline, CTAs, animated metrics bar
      SplitSection.tsx    — Context: text + 2x2 card grid
      ProblemSection.tsx  — Animated fraction stat + 3 cards
      ColumnsSection.tsx  — Solution: 3 icon columns
      PhasesSection.tsx   — 4-phase methodology numbered cards
      MetricsSection.tsx  — Animated number counters (viewport-triggered)
      ComparisonSection.tsx — Without/With FEI comparison
      TimelineSection.tsx — Implementation timeline
      ServicesGridSection.tsx — Services preview grid
      TrustSection.tsx    — Testimonials (3 quotes)
      CTASection.tsx      — Final CTA with gradient bg
      BannerDivider.tsx   — Italic quote divider between sections
```

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string
- `SESSION_SECRET` — Express session secret
- `OPENAI_API_KEY` — For AI content agents
- `SMTP_*` — For magic link emails

## Development
```bash
npm run dev   # Starts both server and Vite dev server on port 5000
```
