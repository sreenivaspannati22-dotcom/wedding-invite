# Product Requirements Document
## Personalised Wedding Invitation Website

**Version:** 1.0  
**Status:** Draft  
**Date:** May 2026  
**Document Type:** Frontend Design & Experience PRD

---

## 1. Executive Summary

A one-page, single-session, fully personalised digital wedding invitation website. The experience begins with a guest name prompt on first load, and every piece of content on the page is then dynamically tailored to address that specific guest by name. The site is scroll-driven, animation-rich, minimal in UI chrome, and deeply focused on emotional resonance. No navigation bar, no multiple pages, no authentication — just a beautiful, flowing digital scroll that feels hand-crafted for the recipient.

---

## 2. Goals & Success Criteria

| Goal | Metric |
|------|--------|
| Feels personally crafted for each guest | Guest name appears naturally in ≥ 5 distinct content moments |
| Premium visual quality | Comparable to high-end agency wedding sites |
| Zero friction experience | Guest reaches RSVP section in < 90 seconds of reading |
| Mobile-first performance | Lighthouse score ≥ 85 on mobile |
| Smooth scroll feel | No jank; 60fps scroll animations on mid-range Android/iOS |
| Desktop & mobile parity | Layout adapts seamlessly at all breakpoints |

---

## 3. Non-Goals (Out of Scope for v1)

- RSVP data storage / backend (placeholder only in v1; integration in v2)
- Admin dashboard
- Multi-language support
- Authentication or login
- Booking or accommodation features
- Guest list management

---

## 4. Technology Stack

### 4.1 Core Framework

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | Vanilla HTML + CSS + JavaScript (ES Modules) | Zero build-step; deployable to any static host; easiest for one-page sites |
| Bundler (optional) | Vite | Near-instant HMR; simple config; ESM-native; ideal for vanilla JS projects |

> **Why not React / Next.js?** For a single-page, mostly static invitation site with rich animations, vanilla JS with GSAP is significantly leaner and avoids React's overhead. GSAP integrates more naturally with the DOM in a non-component paradigm.

---

### 4.2 Scroll & Animation Stack

#### Smooth Scrolling — **Lenis** (`@studio-freight/lenis`)
- **Why:** As of 2026, Lenis is the undisputed industry standard for momentum-based smooth scrolling. It is the only library that does not break CSS `position: sticky`, does not erase native Intersection Observer, and plays perfectly with GSAP ScrollTrigger. Weighs only ~3KB.
- **CDN:** `https://unpkg.com/lenis@1.3.23/dist/lenis.min.js`
- **Integration pattern:**
```javascript
const lenis = new Lenis({ autoRaf: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
```

#### Scroll Animations — **GSAP + ScrollTrigger** (v3, fully free as of 2025)
- **Why:** Best-in-class timeline sequencing, pinning, scrubbing, and stagger support. Now 100% free for commercial use. Pairs perfectly with Lenis. Every scroll-reveal, parallax, pinned section, and timeline card animation will be powered by ScrollTrigger.
- **CDN:**
  - `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js`
  - `https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js`

#### Text Reveal Animations — **GSAP SplitText** (included free)
- Character-by-character / word-by-word text reveals on scroll entry for headings and romantic copy lines.

#### Flower Petal Animation — **Custom Canvas Particle System**
- A hand-written lightweight `<canvas>` particle system rendering soft SVG-path petals (rose / cherry blossom shape).
- Runs continuously on the hero section; fades out gently as user scrolls past the fold.
- Uses `requestAnimationFrame` loop, fully GPU-composited.
- Alternative: `sakura.js` (vanilla JS, CSS-animation-based falling petals, < 5KB) — evaluated for fallback if canvas performance is suboptimal on low-end devices.

#### Countdown Timer — Custom JS (`setInterval` polling)
- Pure vanilla JS, no library needed. Updates every second.
- Displays Days / Hours / Minutes / Seconds in elegant serif typography.

---

### 4.3 Fonts & Typography

| Role | Font | Source |
|------|------|--------|
| Primary Headings | `Cormorant Garamond` (Light 300, Italic) | Google Fonts |
| Sub-headings & Labels | `Jost` (Light 300) | Google Fonts |
| Body & Romantic Copy | `Lora` (Regular 400, Italic) | Google Fonts |
| Monospace / Dates | `DM Mono` (Light) | Google Fonts |

All fonts served via `<link rel="preconnect">` + `display=swap` for performance.

---

### 4.4 Maps Integration

- **Embed method:** Google Maps Embed API via `<iframe>` (no custom JavaScript required, free unlimited usage, requires a free Google Cloud API key with Maps Embed API enabled).
- **URL pattern:**
```
https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=VENUE+ADDRESS
```
- iframe styled as responsive, borderless, with a soft shadow — blends into the venue section.
- A "Get Directions" CTA button opens Google Maps in a new tab.

---

### 4.5 Video Embed

- YouTube embed via standard `<iframe>` with privacy-enhanced mode (`youtube-nocookie.com`).
- Styled with custom poster image overlay and a play button overlay that removes itself on click (preventing autoplay).
- Rounded corners, soft shadow, responsive aspect ratio (`16:9`).

---

### 4.6 Image Handling

- All couple/venue images served as `<img>` with `loading="lazy"` and `decoding="async"`.
- Hero couple image uses CSS `filter: blur(6px)` with a gradient overlay for the blurred aesthetic. Image itself is full-bleed.
- Dynamic venue photo carousel: pure CSS `@keyframes` auto-scroll carousel with optional JS pause-on-hover.
- All images optimised as `.webp` with `.jpg` fallback via `<picture>` element.

---

### 4.7 Deployment Target (Recommendation)

| Option | Cost | Notes |
|--------|------|-------|
| **Vercel** | Free | Optimal for static sites; CDN-distributed globally; zero-config HTTPS |
| **Netlify** | Free | Equal alternative; form handling available for RSVP v2 |
| **GitHub Pages** | Free | Simplest if site is already in a GitHub repo |

---

## 5. UX Flow

```
[Browser opens URL]
        │
        ▼
[Name Capture Overlay — fullscreen modal popup]
Guest types their name → clicks "Enter" or presses Enter
        │
        ▼
[Name is stored in sessionStorage]
[Overlay fades out with a soft dissolve]
        │
        ▼
[One-page scrollable wedding invitation renders]
All dynamic name slots populated from sessionStorage
        │
        ▼ (user scrolls)
[Hero Section]
[Countdown Timer]
[Our Story Timeline]
[Venue & Location]
[Pre-Wedding Memories Video]
[RSVP Section]
[Footer]
```

---

## 6. Section-by-Section Specification

---

### 6.1 — Name Capture Overlay (Modal Popup)

**Trigger:** Fires immediately on page load, before any content is visible.

**Visual Design:**
- Full-viewport frosted glass overlay (`backdrop-filter: blur(20px)` + semi-transparent warm background).
- Centered card with:
  - A small floral SVG motif at the top.
  - Headline: *"You're invited."* (Cormorant Garamond, italic, large)
  - Sub-text: *"Before we begin, may we know your name?"*
  - Single text input field, minimal underline style (no border-box).
  - CTA button: *"Open Your Invitation →"*
- Gentle entrance animation: card fades up from 20px below (`gsap.from`).

**Behaviour:**
- Input is focused automatically on mount.
- Enter key submits.
- Name is trimmed and title-cased before storage.
- If `sessionStorage.getItem('guestName')` already exists (page refresh), overlay is skipped — the site renders immediately with the stored name.
- Overlay exits with `opacity: 0` + `scale(1.02)` GSAP animation (~600ms).

**Name Personalisation Slots (populated post-modal):**
1. Hero tagline: *"[Name], you are warmly invited…"*
2. Countdown intro: *"[Name], the day is almost here."*
3. RSVP header: *"[Name], will you join us?"*
4. RSVP confirmation message: *"Thank you, [Name]! We can't wait to celebrate with you."*
5. Footer sign-off: *"With all our love, we hope to see you soon, [Name]."*

---

### 6.2 — Hero Section

**Layout:** Full-viewport (`100svh`), no scroll until user begins scrolling.

**Visual Elements:**

| Element | Specification |
|---------|---------------|
| Background | Couple photo, full-bleed, `object-fit: cover`, blurred with CSS `filter: blur(5px) brightness(0.7)` |
| Colour overlay | Subtle warm gradient: `rgba(251,240,225,0.25)` to `rgba(0,0,0,0.35)` |
| Couple names | Large serif display text (Cormorant Garamond, ~96px desktop / ~52px mobile), centred, white with soft text-shadow |
| Wedding date | Smaller, letter-spaced label in `DM Mono`, below names |
| Guest personalisation line | *"[Name], you are warmly invited to share this day with us."* — italic Lora, centred |
| Scroll cue | Animated thin vertical line + "Scroll" label at the bottom, fades in after 2s |

**Flower Petal Animation:**
- HTML5 `<canvas>` element absolutely positioned over the hero, `pointer-events: none`, `z-index: 2`.
- Custom particle system: 40–60 petals rendered as SVG-path-derived shapes.
- Each petal has: random start X position across viewport width, random scale (0.4–1.2), random rotation speed, gentle sinusoidal horizontal drift, opacity fade-in at top and fade-out at bottom.
- Loop is continuous; petals recycle when they exit the bottom of the viewport.
- Canvas opacity is bound to scroll position via ScrollTrigger — fades to 0 as user scrolls past 80% of hero section height.

**Entry Animations (GSAP timeline, fires after modal exit):**
- `t=0`: Canvas petals begin.
- `t=0.3s`: Names fade in + slide up 30px.
- `t=0.7s`: Date fades in.
- `t=1.0s`: Guest personalisation line fades in (letter by letter using SplitText).
- `t=1.8s`: Scroll cue fades in.

---

### 6.3 — Countdown Timer Section

**Layout:** Full-width band, centred, minimal. ~40vh height.

**Background:** Solid warm cream (`#FAF6F0`) or very light floral texture (subtle SVG pattern at 3% opacity).

**Content:**
- Heading: *"[Name], the day is almost here."* (italic serif)
- Four large countdown units: `DD — HH — MM — SS`
- Labels below each unit: `Days`, `Hours`, `Minutes`, `Seconds` (small, letter-spaced, Jost Light)
- Numbers in large Cormorant Garamond, elegant and minimal

**Behaviour:**
- `setInterval` fires every 1000ms, recalculates difference from `TARGET_DATE` constant.
- Numbers animate with a brief vertical flip transition (CSS `transform: translateY`) on each change.
- When timer reaches zero, displays: *"Today is the day! 🌸"*

**Scroll Entry Animation:**
- Section pins briefly as user scrolls into it (ScrollTrigger `pin: true`, short).
- Countdown units stagger in from below with a 100ms stagger.

---

### 6.4 — Our Story / Timeline Section

**Layout:** Alternating two-column layout (desktop) / single-column stacked (mobile). Vertical centre line connecting cards.

**Per Card Content:**
- Left column: Venue or couple photo (rounded corners, soft drop shadow).
- Right column (alternates sides): Event/moment title, date, description paragraph.
- Thin horizontal divider line connecting to the centre spine.

**Timeline Cards (suggested moments — all placeholder, to be replaced):**
1. *How We Met* — Photo + short romantic anecdote.
2. *Our First Adventure* — Photo + story.
3. *The Proposal* — Photo + story.
4. *The Venue* — Venue exterior photo + venue name, city, address.
5. *The Ceremony* — Venue interior / ceremony hall photo + time, dress code.
6. *The Reception* — Reception hall photo + time, special notes.

**Scroll Animations:**
- Each card enters from its respective side (left cards slide in from left, right cards from right).
- ScrollTrigger `start: "top 80%"`, stagger between elements within each card.
- The centre line "draws" downward using an SVG `stroke-dashoffset` animation synced to scroll progress.
- Photos have a subtle parallax (move at 0.7x scroll speed vs. content).

**Mobile Adaptation:**
- Centre line shifts to left edge.
- Photos stack above text for each card.
- Entry animations shift to fade-up only (no horizontal).

---

### 6.5 — Pre-Wedding Memories Video Section

**Layout:** Centred, contained (max-width `800px`), with generous padding.

**Background:** Dark section (`#1A1410`) for cinematic contrast.

**Content:**
- Section label: `— A Glimpse of Us —` (small, letter-spaced, gold/champagne colour)
- Heading: *"Our Story, So Far."*
- YouTube embed: `youtube-nocookie.com`, privacy-enhanced mode, no related videos (`rel=0`).
- Custom video thumbnail overlay: couple photo as poster image, with a custom circular play button. On click — thumbnail fades out, iframe activates.
- Below video: small italic caption line.

**Scroll Entry Animation:**
- Section fades in with scale from `0.95` to `1.0` as it enters the viewport.
- Heading words stagger in from below.
- Video wrapper has a border reveal animation (CSS clip-path expanding from centre).

---

### 6.6 — Venue & Location Section

**Layout:** Two-panel (desktop): left = rotating venue photo gallery, right = venue details + embedded map.

**Venue Photo Gallery (Left):**
- 3–5 venue photos in an auto-rotating CSS carousel.
- Transition: cross-fade with 4s interval.
- Pause on hover (JS event listener toggles CSS `animation-play-state`).
- Rounded corners, tall portrait aspect ratio on desktop; wide landscape on mobile.

**Venue Details (Right):**
- Venue name in large serif.
- Address line (Jost Light, small).
- Date & Time block.
- Dress code line.
- "How to get there" link — opens Google Maps directions in new tab.
- Google Maps Embed `<iframe>`:
  - Borderless, rounded corners, responsive.
  - Soft shadow wrapper.
  - API key from Google Cloud Console (Maps Embed API, free unlimited usage).
  - `loading="lazy"` attribute.

**Mobile Adaptation:**
- Gallery collapses to full-width.
- Venue details stack below.
- Map spans full width.

**Scroll Entry Animations:**
- Gallery slides in from left, details fade in from right (desktop).
- Both fade-up on mobile.

---

### 6.7 — RSVP Section

**Layout:** Centred card on a warm textured or gradient background.

**Personalisation:**
- Heading: *"[Name], will you join us?"*
- Sub-heading: *"We would be honoured by your presence. Please let us know."*

**Form Fields:**

| Field | Type | Validation |
|-------|------|-----------|
| Name (pre-filled from session) | Text input (editable) | Required, min 2 chars |
| Attending? | Two large toggle buttons: **"Joyfully Attending 🥂"** / **"Regretfully Declining"** | Required selection |
| Number of guests | Number stepper (1–10), visible only if Attending | Required if attending |
| Dietary / Special notes | Optional textarea | Optional, max 300 chars |
| Submit | Full-width button: *"Send My RSVP →"* | — |

**Post-Submit State:**
- Form fades out.
- Confirmation card fades in:
  - If attending: *"Thank you, [Name]! We're so excited to celebrate with you. 🌸"* + confetti burst animation.
  - If declining: *"We'll miss you, [Name]. Thank you for letting us know, and we hope to celebrate with you soon."*
- **Note:** In v1, submission triggers a `console.log` of the RSVP object and a `sessionStorage` write. Backend integration (Supabase / Airtable / Notion API / Google Sheets) to be added in v2.

**Scroll Entry Animations:**
- Card scales up from `0.9` to `1.0` + fades in.
- Form fields stagger in (100ms between each).

---

### 6.8 — Footer

**Layout:** Minimal, centred, ~20vh.

**Content:**
- Small floral SVG divider.
- Couple initials monogram (CSS-drawn or inline SVG).
- *"With all our love, we hope to see you soon, [Name]."*
- Wedding date, repeated in small DM Mono.
- *"Made with love for the people who matter most."* — micro text.

---

## 7. Global Animation Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Ease curves** | `power2.out` for entries; `power1.inOut` for scrubbed animations |
| **Duration** | Entry animations: 0.6–1.0s. Transitions: 0.3–0.5s |
| **Stagger** | 0.08–0.15s between sibling elements |
| **Trigger offset** | `start: "top 80%"` (element enters view 80% down the viewport before animating) |
| **Once vs. repeat** | All scroll entry animations fire `once: true` — no re-triggering on scroll-back |
| **Scroll scrub** | Only the centre timeline line and petal canvas use `scrub: true`; all others are trigger-and-play |
| **Reduced motion** | All GSAP animations respect `prefers-reduced-motion: reduce` — skip or shorten to instant transitions |

---

## 8. Responsive Breakpoints

| Breakpoint | Width | Behaviour |
|------------|-------|-----------|
| Mobile S | < 375px | Single column, reduced font scale |
| Mobile M | 375px–767px | Single column, standard mobile layout |
| Tablet | 768px–1023px | Hybrid: some two-col, some stacked |
| Desktop | 1024px–1439px | Full two-column layouts |
| Large Desktop | ≥ 1440px | Max-width container (`1200px`) centred |

CSS approach: Mobile-first. Base styles for mobile, `@media (min-width: X)` overrides for larger screens.

---

## 9. Performance Requirements

| Metric | Target |
|--------|--------|
| Largest Contentful Paint (LCP) | < 2.5s |
| First Contentful Paint (FCP) | < 1.2s |
| Cumulative Layout Shift (CLS) | < 0.05 |
| Interaction to Next Paint (INP) | < 200ms |
| Total JavaScript (parsed) | < 250KB gzipped |
| Total CSS | < 30KB gzipped |

**Performance strategies:**
- All images in `.webp` format with `<picture>` fallback.
- `loading="lazy"` on all images below the fold.
- `font-display: swap` on all Google Fonts.
- GSAP and Lenis loaded via CDN (cached across sites).
- Canvas petal animation uses `offscreenCanvas` where available.
- YouTube iframe loaded only on user interaction (facade pattern).

---

## 10. Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | All interactive elements focusable; modal trap focus while open |
| ARIA labels | `aria-label` on all icon buttons, map iframe, video player |
| Colour contrast | All text on backgrounds ≥ 4.5:1 WCAG AA |
| Motion safety | GSAP checks `matchMedia('(prefers-reduced-motion: reduce)')` and disables scroll animations |
| Form accessibility | All inputs have associated `<label>` elements; error states have `aria-describedby` |
| Alt text | All images have descriptive `alt` attributes |

---

## 11. File Structure

```
wedding-invite/
├── index.html                  # Single page entry point
├── style/
│   ├── main.css                # Global styles, typography, custom properties
│   ├── overlay.css             # Name capture modal styles
│   ├── hero.css                # Hero section
│   ├── countdown.css           # Countdown timer
│   ├── timeline.css            # Our Story section
│   ├── video.css               # Pre-wedding video section
│   ├── venue.css               # Venue & map section
│   ├── rsvp.css                # RSVP form section
│   └── footer.css              # Footer
├── js/
│   ├── main.js                 # App init, Lenis + GSAP setup
│   ├── overlay.js              # Name capture logic, sessionStorage
│   ├── personalize.js          # DOM name slot injection
│   ├── petals.js               # Canvas flower petal animation
│   ├── countdown.js            # Timer logic
│   ├── timeline.js             # ScrollTrigger timeline animations
│   ├── venue-gallery.js        # Venue photo carousel
│   ├── video.js                # YouTube facade / play toggle
│   └── rsvp.js                 # RSVP form logic (v1: localStorage)
├── assets/
│   ├── images/
│   │   ├── couple-hero.webp
│   │   ├── venue-1.webp … venue-5.webp
│   │   ├── timeline-1.webp … timeline-4.webp
│   │   └── video-poster.webp
│   └── svg/
│       ├── petal.svg
│       ├── floral-divider.svg
│       └── monogram.svg
└── vite.config.js              # (optional, if using Vite)
```

---

## 12. Configuration Constants

All guest-facing copy and configuration lives in a single `config.js` file for easy editing by non-developers:

```javascript
// config.js — Edit this file to customise your wedding website

export const WEDDING = {
  // Couple
  partner1: "Ayesha",
  partner2: "Rayan",

  // Date & Time
  weddingDate: "2026-11-14T18:00:00+04:00",  // ISO 8601 with timezone
  ceremonyTime: "6:00 PM",
  receptionTime: "8:00 PM",

  // Venue
  venueName: "The Palace Ballroom",
  venueAddress: "Sheikh Zayed Road, Dubai, UAE",
  googleMapsEmbedKey: "YOUR_GOOGLE_API_KEY",
  googleMapsQ: "Palace+Ballroom+Dubai",
  googleMapsDirectionsURL: "https://maps.google.com/?q=...",

  // Video
  youtubeVideoId: "dQw4w9WgXcQ",  // Replace with your YouTube video ID

  // Dress Code
  dressCode: "Black Tie",

  // Social / Contact
  contactEmail: "ayesha.rayan.wedding@gmail.com",
};
```

---

## 13. Dependencies Summary

| Package | Version | Purpose | Load Method |
|---------|---------|---------|-------------|
| GSAP | 3.x | Scroll animations, timelines, text reveals | CDN |
| GSAP ScrollTrigger | 3.x (bundled) | Scroll-linked triggers and scrubbing | CDN |
| GSAP SplitText | 3.x (bundled) | Character/word text animation | CDN |
| Lenis | 1.3.x | Buttery smooth scroll | CDN |
| Google Fonts | — | Cormorant Garamond, Jost, Lora, DM Mono | `<link>` |
| Google Maps Embed | — | Interactive venue map | `<iframe>` |
| YouTube Embed | — | Pre-wedding memories video | `<iframe>` (lazy) |
| Custom Petals | — | Canvas particle animation | Local JS |

**No npm required for v1.** All libraries are loaded via CDN for zero build-step deployment.

---

## 14. v2 Roadmap (Post-launch)

| Feature | Priority | Notes |
|---------|---------|-------|
| RSVP backend (Supabase) | High | Real-time RSVP tracking + email notification |
| Admin dashboard | Medium | View RSVP list, headcount, dietary notes |
| RSVP backend (Google Sheets) | Medium | Via Google Apps Script webhook |
| WhatsApp / email sharing | Medium | Pre-crafted share message with invite URL |
| Custom domain | Low | e.g. `ayeshaandrayan.com` |
| Password protection | Low | Optional — restrict access to invited guests only |
| Multilingual support | Low | Arabic + English toggle |
| Analytics | Low | Simple Plausible or Fathom (privacy-first) |

---

## 15. Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| 1 | What is the exact wedding date and time? | Couple | ❌ Needed for config |
| 2 | What are the couple's names (spelling, order)? | Couple | ❌ Needed for config |
| 3 | What is the venue name and full address? | Couple | ❌ Needed for Maps embed |
| 4 | What is the YouTube video ID for pre-wedding memories? | Couple | ❌ Needed for video section |
| 5 | How many venue photos will be provided? | Couple | ❌ Minimum 3, max 5 |
| 6 | How many timeline/story photos will be provided? | Couple | ❌ Minimum 3, max 6 |
| 7 | Colour palette preference? | Couple | ❌ Default: warm ivory/gold/sage |
| 8 | RSVP guest limit (for the stepper max value)? | Couple | ❌ Default: 10 |
| 9 | RSVP backend preference for v2? | Couple | ❌ Supabase / Airtable / Google Sheets |
| 10 | Hosting preference? | Couple | ❌ Recommend Vercel (free) |

---

*This document will be updated as open questions are resolved. All sections marked with placeholder copy ("[Name]", venue details, dates) require final content from the couple before development is complete.*
