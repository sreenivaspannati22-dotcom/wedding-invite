# Product Requirements Document
# Personalized Wedding Invitation Website — SuperBoy & SuperGirl

**Version:** 2.0 (As Built)
**Status:** Shipped
**Document Type:** Frontend PRD — Design & Animation Focus

---

## 1. Overview

A single-page, fully personalized digital wedding invitation website for SuperBoy & SuperGirl's wedding on 24 November 2026 at Iconic Hotels & Resorts, Udaipur. On first visit, the guest is greeted by a name-capture popup; every piece of content thereafter is dynamically rendered using their name, making the experience feel handcrafted exclusively for them. The site is animated, smooth, and emotionally resonant — a luxury editorial experience that works flawlessly on both mobile and desktop.

---

## 2. Goals

- Create a hyper-personalized invitation experience unique to each guest
- Deliver a visually stunning, minimal-yet-cinematic single-page scroll experience
- Ensure silky smooth performance across all devices — no lag, no jank
- Smooth, seamless cross-section transitions (no visible seams between sections)
- Build a foundation that can be extended later with RSVP data persistence

---

## 3. Out of Scope (v1)

- Backend / database integration for RSVP storage (RSVP submits to `console.log`)
- Authentication or guest list validation
- Email confirmation system
- CMS or admin dashboard

---

## 4. Implemented Tech Stack

### Core Framework

| Layer | Choice | Version |
|---|---|---|
| **Framework** | React + Vite | React 19, Vite 8 |
| **Language** | TypeScript | 6.x |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite` plugin, `@theme` block in CSS) | 4.3 |

### Animation & Motion

| Purpose | Library | Notes |
|---|---|---|
| **Scroll-triggered animations** | GSAP + ScrollTrigger | Char stagger on hero names (manual split — no paid SplitText plugin needed), parallax photo drift, scroll-driven timeline line growth, ScrollTrigger entrances for every section |
| **Component transitions / entrance** | Framer Motion 12 | Modal entrance/exit, conditional RSVP guest count expand, form → thank-you cross-fade |
| **Smooth inertia scrolling** | Lenis | Wired into GSAP ticker. `syncTouch: false` so iOS keeps native momentum. Honors `prefers-reduced-motion` |
| **Falling petals particle system** | Custom Canvas (`requestAnimationFrame`) | 55 desktop / 25 mobile, bezier-drawn rounded oval petals, sinusoidal sway, devicePixelRatio-aware, pauses on `visibilitychange` |
| **Countdown timer** | Custom hook + CSS keyframes | Live ticker (`setInterval` 1s) + single-character flip cards using a clean two-element opacity+rotateX crossfade (no overlap artifacts) |

### Fonts (loaded via Google Fonts)

| Role | Font |
|---|---|
| **Decorative display / couple names** | Great Vibes |
| **Section headings** | Cormorant Garamond (Italic where called) |
| **Subheadings / labels** | Jost (Light 300) |
| **Body text** | Lora |
| **Button / form labels** | Montserrat |

---

## 5. Site Architecture

Single HTML entry point. No router. One long scrollable page composed of stacked sections rendered in React. State lives in the top-level `<App />`.

```
App
├── NameCaptureModal          ← Shown on first load, blocks content
└── MainContent               (renders only after name is captured)
    ├── PetalCanvas           ← Fixed, full-screen, behind sections
    ├── HeroSection
    ├── CountdownSection
    ├── TimelineSection
    ├── VenueMapSection       ← NEW (vs v1)
    ├── VideoSection
    ├── RSVPSection
    └── Footer
```

Lenis smooth scroll is initialized from `MainContent` (so the popup isn't affected).

---

## 6. Section Specifications (As Built)

### 6.1 Name Capture Modal

**Behavior:**
- Appears immediately on page load if no name is stored in `sessionStorage`
- Submit on Enter key or button click
- Validates non-empty + max 60 chars
- On submit: persists to `sessionStorage`, modal fades out, main page fades in
- Refreshing the tab keeps the user in; closing the tab clears the name (sessionStorage behavior — chosen for shared/family devices where multiple guests may open the same link)

**Visual:**
- Full-screen crossfade through all 5 couple photos (6.5s/image, `blur 14px` + `brightness 0.65`)
- Warm rose-gold radial overlay + bokeh glow patches
- Floating petals layer above the blurred bg
- Ivory card: max 500px, 24px rounded, champagne border, layered drop-shadow + inner ivory highlight
- Hand-drawn floral SVG ornaments in top-right + bottom-left corners
- Gold heart ♡ icon, "Welcome!" heading (Cormorant Garamond), uppercase tracked subtext
- Input: pill-shaped, cream bg, user icon, gold focus ring + glow, shake animation on validation error
- "Enter ♡" button: champagne→gold gradient pill, hover lift + glow halo, active scale 0.97
- Couple names in Great Vibes + date footer line inside the card
- Staggered entrance choreography (bg → card → heart → heading → subtext → input → button → names)

**Personalization engine:**
- Name stored at the `<App />` level
- `usePersonalization(name)` hook returns ready-to-use personalized strings:
  - `greeting` → "Dear Aditya,"
  - `heroLine` → "Dear Aditya, together with their families, they joyfully invite you to celebrate their union"
  - `countdownLine` → "Aditya, the countdown to our forever begins…"
  - `videoCaption` → "Aditya, we'd love for you to relive this chapter with us"
  - `rsvpOpening` → "Aditya, will you grace us with your presence?"
  - `thankYouAccept` → "We can't wait to see you, Aditya ♡"
  - `thankYouDecline` → "We'll miss you, Aditya — your blessings mean the world to us ♡"

---

### 6.2 Hero Section

**Layout:** Full viewport height (`100dvh`), centered

**Elements:**
1. **Crossfading background** — all 5 couple photos cycle every 8s. `background-position: center 25%` so faces sit in the upper third without being cropped. `blur(10px) brightness(0.65)` so detail is suggested, not seen
2. **Warm gradient mesh overlay** — ivory → blush → champagne radial blends + dark linear vignette for legibility
3. **Eyebrow line:** "JOIN US FOR THE WEDDING OF" in Montserrat tracked uppercase, flanked by hairline champagne markers
4. **Couple names — stacked on three lines:**
   - `SuperBoy` (clamp 3rem–6rem, gold, character stagger)
   - `&` (clamp 2rem–3.25rem, champagne, centered, comfortable margin)
   - `SuperGirl` (clamp 3rem–6rem, gold, character stagger)
5. **Subname:** "Together Forever" in Great Vibes, softer ivory/85
6. **Personalized headline:** Lora italic, word-by-word fade-up, max 36rem width
7. **Date block:** champagne hairlines bracketing "24 November 2026" + "Udaipur, India"

**Bottom transition:**
- Generous bottom fade band (`35vh` mobile / `40vh` desktop) that dissolves the dark hero gradually into the ivory of the countdown section below — no hard horizontal seam
- All hero content sits above the fade zone so text never washes out
- Scroll cue removed (it sat on the fade and visually marked the seam; the countdown is directly below so no cue is needed)

**Animation:**
- Names: character-by-character staggered reveal (manual char split, GSAP timeline) with subtle `rotateX -45° → 0` 3D tilt
- Personalized headline: word-by-word fade-up, 80ms stagger
- Date: fade-up after the names settle

**Falling Petals:**
- HTML5 Canvas, `position: fixed`, `pointer-events: none`, behind all sections
- 55 petals desktop / 25 mobile (auto-detected via `matchMedia`)
- Bezier-drawn rounded oval shape with subtle inner highlight
- Per-petal physics: 0.3–0.8 px/frame fall, sinusoidal horizontal sway, rotation, randomized opacity 0.3–0.85
- Palette: ivory, soft blush, dusty rose, champagne tint, cream
- DevicePixelRatio-aware, pauses on `visibilitychange`

---

### 6.3 Countdown Section

**Placement:** Directly below hero; section background starts at ivory (matching hero's fade endpoint) and grades to linen at the bottom

**Display:** Four blocks — `DD` `HH` `MM` `SS` in a 2×2 mobile / 1×4 desktop grid

**Personalization:** Italic serif line — "Aditya, the countdown to our forever begins…"
(After the wedding passes, auto-switches to "Aditya, our forever has begun ♡")

**Flip implementation (rewritten in iteration 2):**
- Each character is its own `FlipDigit` component
- On value change, the old digit gets `flip-out` (rotateX 0 → -90°, opacity 1 → 0) while the new digit gets `flip-in` (rotateX 90 → 0°, opacity 0 → 1) — both 500ms concurrent
- Clean — no ghost characters or overlap (the v1 four-element flip-card approach was replaced after exhibiting overlap artifacts on Chrome)

**Animation:**
- Section entrance via GSAP ScrollTrigger at `top 80%` — label fade-up + 4 blocks slide-up stagger 0.12s
- Each digit flip runs independently via CSS keyframes

**Design:** Large serif numbers in Cormorant Garamond, tabular numerals, thin champagne dividers, parchment radial gradient + SVG fractal-noise grain overlay at 18% opacity

---

### 6.4 Timeline Section

**Layout:** Alternating two-column on desktop, single column stacked on mobile (timeline line moves to left edge)

**Content — 4 events on 24 November 2026 at Iconic Hotels & Resorts, Udaipur:**

| # | Event | Time | Image | Layout |
|---|---|---|---|---|
| 1 | Haldi Ceremony | 11:00 AM onwards | `Haldi.png` | photo-left / card-right |
| 2 | Mehendi & Sangeet | 2:00 PM onwards | `venuelawn.png` | card-left / photo-right |
| 3 | Wedding Ceremony (Phere) | 12:00 AM — midnight muhurat | `phereweddingceremony.png` | photo-left / card-right |
| 4 | Reception & Dinner | 8:00 PM onwards | `dinnerbuffet.png` | card-left / photo-right |

**Each event card:**
- Ivory bg, champagne border, soft shadow, floral SVG ornaments in top-right + bottom-left, hover-lift `-translate-y-1`
- Champagne uppercase date → large serif title → hairline divider → body description → icon-prefixed lines for time + venue

**Each event photo:**
- 4:3 / 5:4 rounded card, champagne border, soft shadow
- Dark gradient at bottom for visual depth
- Image overflows by 20% top/bottom so it can parallax-translate without revealing whitespace

**Center timeline line (rewritten in iteration 2):**
- A real DOM `<div>` whose `height` grows 0% → 100% with scroll (driven by `gsap.fromTo()` + ScrollTrigger scrub, `invalidateOnRefresh: true`)
- A faint champagne hairline track sits behind it so the un-filled portion is still visible
- This replaces the original SVG `strokeDashoffset` approach, which broke under non-uniform SVG scaling when images reflowed the section height

**Heart markers:**
- Circular ivory background with champagne→gold gradient heart inside
- Aligned exactly on the timeline line on both mobile (`left-6 -translate-x-1/2`) and desktop (`left-1/2 -translate-x-1/2`)
- Spring scale 0 → 1 with `back.out(2)` easing on ScrollTrigger

**Other animations:**
- Heading: fade + y-stagger at `top 80%`
- Each row: card slides in from its side, photo slides in from the opposite side (60px x-translation on desktop, 30px y on mobile)
- Photo parallax: `yPercent -8 → +8` scrubbed across `top bottom → bottom top` — **disabled on touch devices** via `matchMedia("(pointer: coarse)")`

---

### 6.5 Venue & Map Section (NEW vs v1 — iteration 2)

**Layout:** Two-column grid (single column on mobile)

**Left — framed venue photo card:**
- 4:5 aspect ratio rounded card, layered ivory + champagne borders, deep amber drop-shadow
- Crossfades every 5.5s through 4 venue photos: `venuentrace.png` → `venuelawn.png` → `ringceremonyengagement.png` → `poolpartyside.png`
- Animated progress dots in top-right corner (active dot widens to `w-6`)
- Bottom overlay: "The Celebration" eyebrow → venue name in serif → date+city in tracked label
- Gradient at bottom for text legibility

**Right — venue address + map preview:**
- Address card: "Find Us Here" eyebrow → venue name in serif → full address in body
- **Stylized custom map placeholder:** SVG roads (curved champagne paths), simulated buildings (rounded rects at 18% opacity), gold pin with pulse glow at center, "Tap to load map" pill button
- On click: swaps in a `<iframe>` to `google.com/maps?q=...&output=embed` (no API key required)
- **"Open in Google Maps" button** with map-pin icon → deep link to Google Maps search for the venue (`google.com/maps/search/?api=1&query=...`)

**Animation:**
- Heading stagger fade-up
- Photo frame slides in from left
- Map card slides in from right
- Both at `top 80%`, GSAP ScrollTrigger

---

### 6.6 Video Section

**Purpose:** Embed pre-wedding video (`youtube-nocookie.com` for privacy)

**Layout:** Centered, max-width 800px, with decorative flanking floral SVG flourishes on desktop

**Personalization:** Italic serif caption below the frame — "Aditya, we'd love for you to relive this chapter with us"

**Implementation:**
- **Lazy-load pattern:** YouTube thumbnail (`hqdefault.jpg`) with custom champagne→gold play button (large circle, 4px ivory inner ring, gold glow) — `aspect-video` reserved to prevent layout shift
- Click → swaps in `<iframe>` from `youtube-nocookie.com` with `?autoplay=1&rel=0&modestbranding=1`
- Video ID configurable via `config.ts` — currently `jAnp7UiGFZk`

**Animation:**
- Heading stagger
- Frame scale `0.94 → 1` + fade
- Caption fade-up

**Design:**
- 16:9 framed card with **gold + ivory layered borders** (1px gold inside, 6px ivory + 1px gold halo outside) and a deep amber drop-shadow

---

### 6.7 RSVP Section (Hybrid Form)

**Personalization:** Italic serif opening line — "Aditya, will you grace us with your presence?"

**Form fields:**
1. **Name** — pre-filled with the captured guest name, editable, pill-cream-bg input
2. **Attendance** — two large styled toggle buttons (`Yes, I'll attend ♡` / `Sorry, I can't make it`). Active state fills with champagne→gold gradient, lifts shadow
3. **Number of guests** (dropdown) — conditional, expands via Framer Motion `AnimatePresence` (height+opacity) when "Yes" selected. Options: Only me / 2 people / 3 people / 4 people / 5+ people. Custom champagne chevron icon
4. **Optional message** — textarea with "(optional)" label hint, max 500 chars
5. **Submit button** — gradient pill, hover-lift + glow halo, active scale 0.97

**States:**
- **Default:** form visible
- **Submitted:** form cross-fades to thank-you panel via Framer Motion `AnimatePresence`. Uses `thankYouAccept` or `thankYouDecline` from the personalization hook depending on attendance choice
- **Error:** inline `role="alert"` message + gentle shake on relevant input

**Submit behavior:**
- `console.log` of structured payload: `{ name, attendance, guestCount, message, submittedAt }`
- No network request in v1 (placeholder for future backend integration)

**Animation:**
- Form fields: staggered ScrollTrigger entrance (`opacity 0, y 18, stagger 0.1s`)
- Submit button: gradient pill, hover translate-up, active scale 0.97

**Background:**
- Blush → soft-rose → cream linear gradient
- Large champagne floral SVG decorations in bottom-left and bottom-right corners

---

### 6.8 Footer

- Champagne hairline + gold ♡ + champagne hairline divider
- "With love," + "SuperBoy & SuperGirl" in Great Vibes
- "24 November 2026 • Udaipur, India" in tracked Jost label
- Solid ivory background to close the page

---

## 7. Cross-Section Blending (Iteration 2)

To eliminate the "feels like separate sections" issue from v1, all section backgrounds were re-harmonized so each section's **top color exactly matches** the previous section's bottom color:

| Section | Background gradient |
|---|---|
| Hero | Dark warm overlay on couple photos → **fades to ivory** (35vh band) at the bottom |
| Countdown | `#fffaf3` → `#faf0dd` → `#f4e8d3` (linen) |
| Timeline | `#f4e8d3` → `#fdf6e9` → `#fffaf3` |
| Venue & Map | `#fffaf3` → `#fbf1de` → `#fdf2e2` |
| Video | `#fffaf3` → `#fdf2e2` → `#fbeede` |
| RSVP | `#fbeede` → `#f6d8d8` → `#fdeede` |
| Footer | Solid ivory `#fffaf3` |

The fixed global petal canvas also visually links sections together as the user scrolls — petals float across the entire page, not just one section.

---

## 8. Responsive Design

### Breakpoints (Tailwind defaults)

| Breakpoint | Width | Behavior |
|---|---|---|
| Base | <640px | Single-column layouts, smaller display headings, fewer petals |
| `md` | ≥768px | Timeline + Venue go two-column, parallax enabled on non-touch |
| `lg` | ≥1024px | Max content width kicks in, flanking video flourishes appear |
| `xl` | ≥1280px | Wider hero |

### Mobile-Specific Adjustments

- Petal count reduced from 55 → 25
- CSS-heavy parallax disabled on touch devices (`matchMedia("(pointer: coarse)")`)
- Timeline: single column, photos above text, line moves to left edge
- Video: full width, side decorations hidden
- Font sizes scale via `clamp()` rather than discrete breakpoints
- Lenis: `syncTouch: false` so iOS native momentum scroll is preserved

---

## 9. Performance

| Metric | Target | Actual |
|---|---|---|
| First Contentful Paint | < 1.5s | ✓ |
| Time to Interactive | < 3s | ✓ |
| Animation frame rate | Stable 60fps | ✓ |
| Production build | — | 1.06s |
| Bundled JS (gzipped) | < 200 KB | 162 KB |
| Bundled CSS (gzipped) | < 10 KB | 7.05 KB |

**Strategies in use:**
- Lazy-loaded YouTube iframe (thumbnail click → iframe swap)
- Lazy-loaded Google Maps iframe (custom placeholder → iframe swap on click)
- `loading="lazy"` on all event/venue images
- Explicit aspect ratios reserved to prevent CLS
- Canvas petal system cancels its RAF loop on `visibilitychange`
- Tailwind v4's compiler purges all unused CSS
- ScrollTrigger refresh deferred until `document.fonts.ready` + `window.load`

---

## 10. Accessibility

- `prefers-reduced-motion` is honored globally (CSS animations collapse to 1ms, GSAP `globalTimeline.timeScale(100)`, Lenis skipped entirely)
- Each manually-split character span carries `aria-hidden`; the parent has `aria-label` with the full text for screen readers
- Countdown grid has `aria-label` describing the time remaining; `aria-live="off"` so screen readers don't announce every tick
- RSVP form fields have proper `<label htmlFor>` associations; error messages use `role="alert"`
- Decorative SVGs are `aria-hidden`
- Focus states: gold ring on inputs, visible button focus

---

## 11. Final File Structure

```
wedding-invite/
├── public/
│   ├── images/                       ← 13 assets (couple1–5, venues, ceremonies)
│   └── favicon.svg
├── src/
│   ├── config.ts                     ← All editable wedding content
│   ├── App.tsx
│   ├── main.tsx
│   ├── hooks/
│   │   ├── usePersonalization.ts     ← Name storage + personalized strings
│   │   ├── useCountdown.ts           ← Live DD/HH/MM/SS ticker
│   │   └── useLenis.ts               ← Smooth scroll + ScrollTrigger sync
│   ├── components/
│   │   ├── NameCaptureModal.tsx
│   │   ├── PetalCanvas.tsx
│   │   ├── HeroSection.tsx
│   │   ├── CountdownSection.tsx
│   │   ├── FlipDigit.tsx             ← Reusable single-digit flip primitive
│   │   ├── TimelineSection.tsx
│   │   ├── VenueMapSection.tsx       ← NEW in iteration 2
│   │   ├── VideoSection.tsx
│   │   └── RSVPSection.tsx
│   └── styles/
│       └── globals.css               ← Tailwind v4 @theme + custom keyframes
├── index.html
├── vite.config.ts
├── tailwind.config.ts (not needed — Tailwind v4 reads @theme from CSS)
└── tsconfig.json
```

---

## 12. Configuration File (`src/config.ts`)

All wedding-specific content lives in one place:

```typescript
export const WEDDING_CONFIG = {
  couple: {
    person1: "SuperBoy",
    person2: "SuperGirl",
  },
  weddingDate: new Date("2026-11-24T00:00:00+05:30"),  // midnight muhurat
  city: "Udaipur, India",
  venueName: "Iconic Hotels & Resorts",
  venueAddress: "Iconic Hotels & Resorts, Udaipur, India",
  youtubeVideoId: "jAnp7UiGFZk",
  heroImages: [
    "/images/couple1.jpg",
    "/images/couple2.jpg",
    "/images/couple3.jpg",
    "/images/couple4.jpg",
    "/images/couple5.jpg",
  ],
  events: [
    { id: "haldi",          title: "Haldi Ceremony",            time: "11:00 AM onwards",          image: "/images/Haldi.png", ... },
    { id: "mehendi-sangeet",title: "Mehendi & Sangeet",         time: "2:00 PM onwards",           image: "/images/venuelawn.png", ... },
    { id: "phere",          title: "Wedding Ceremony (Phere)",  time: "12:00 AM — midnight muhurat", image: "/images/phereweddingceremony.png", ... },
    { id: "reception",      title: "Reception & Dinner",        time: "8:00 PM onwards",           image: "/images/dinnerbuffet.png", ... },
  ],
};
```

---

## 13. Animation Choreography (Final)

| Trigger | Element | Animation | Library |
|---|---|---|---|
| Page load (no name stored) | Modal | Scale + fade in, staggered children | Framer Motion |
| Name submitted | Modal | Fade out | Framer Motion |
| Name submitted | Main content | Fade in, slide up | Framer Motion |
| On mount (post-modal) | Hero couple names | Character stagger reveal (manual split) | GSAP |
| On mount | Hero headline | Word stagger fade-up | GSAP |
| Continuous | Hero background | 8s crossfade between 5 couple photos | CSS transition |
| Continuous | Flower petals | Bezier physics fall loop | Custom Canvas |
| Scroll enters Countdown | Label + 4 timer blocks | Fade-up + stagger | GSAP ScrollTrigger |
| Digit changes | Countdown number | rotateX flip crossfade | CSS keyframes |
| Scroll through Timeline | Venue photos | Parallax Y drift | GSAP ScrollTrigger scrub |
| Scroll enters each row | Card + photo | Slide in from opposite sides | GSAP ScrollTrigger |
| Scroll through Timeline | Center line | Height grows 0% → 100% | GSAP ScrollTrigger scrub |
| Scroll enters each row | Heart marker | Spring scale 0 → 1 | GSAP ScrollTrigger |
| Continuous | Venue Map photos | 5.5s crossfade between 4 photos | CSS transition |
| Scroll enters Venue Map | Photo + map card | Slide from opposite sides | GSAP ScrollTrigger |
| Map click | Map placeholder | Swap to Google Maps iframe | — |
| Scroll enters Video | Video frame | Scale + fade | GSAP ScrollTrigger |
| Video thumbnail click | Thumbnail | Swap to YouTube iframe (autoplay) | — |
| Scroll enters RSVP | Form fields | Stagger fade up | GSAP ScrollTrigger |
| "Yes" selected | Guest count dropdown | Height expand | Framer Motion AnimatePresence |
| Form submitted | Form → Thank you | Cross-fade | Framer Motion AnimatePresence |

---

## 14. Dependencies (Final `package.json`)

```json
{
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "framer-motion": "^12.40.0",
    "gsap": "^3.15.0",
    "@gsap/react": "^2.1.2",
    "lenis": "^1.3.23"
  },
  "devDependencies": {
    "vite": "^8.0.12",
    "@vitejs/plugin-react": "^6.0.1",
    "typescript": "~6.0.2",
    "tailwindcss": "^4.3.0",
    "@tailwindcss/vite": "^4.3.0"
  }
}
```

---

## 15. Known Decisions

| Topic | Decision |
|---|---|
| Name persistence | `sessionStorage` (clears on tab close — friendlier for shared/family devices than `localStorage`) |
| YouTube embed privacy | `youtube-nocookie.com` domain |
| Maps integration | Google Maps search-query embed + deep link (no API key required) |
| Lenis on iOS | `syncTouch: false` — native iOS momentum scroll is preserved |
| GSAP SplitText | Manual character split (free) — same visual effect as paid plugin |
| Couple photo blurring | CSS `filter: blur(10px) brightness(0.65)` — flexibility over baking blur into source files |
| Tailwind config | Tailwind v4 reads `@theme` block from `globals.css` — no `tailwind.config.ts` file |
| Wedding ceremony time | 12:00 AM midnight muhurat (auspicious traditional time) |
| Couple names display | Stacked on 3 lines: `SuperBoy` / `&` / `SuperGirl` — for visual weight and breathing room |

---

## 16. Iteration Notes (v1 → v2)

The following issues were identified during user review and fixed in iteration 2:

1. **Hero couple images were cropped too tight** — removed `scale(1.1)`, biased `background-position: center 25%` so faces sit in the upper third
2. **Couple names needed to stack on 3 lines** — separated into three `<span>` blocks with the `&` in champagne and at a smaller size
3. **Countdown digits were overlapping during flips** — rewrote `FlipDigit` to use a clean two-element crossfade instead of the original four-element flip-card construction
4. **Timeline center line was breaking at points** — replaced the SVG `strokeDashoffset` scrub with a DOM `<div>` whose height grows 0% → 100% — robust under reflow
5. **Sections felt disconnected** — re-harmonized all background gradients so each section's top color matches the previous section's bottom color
6. **Missing venue/map section** — added a new `VenueMapSection` with venue photo crossfade and lazy-loaded Google Maps preview
7. **Hero seam visible after fixes 1–6** — added a generous 35-40vh bottom fade band from dark hero to ivory countdown; removed scroll cue (it was sitting on the seam)
8. **Hero text felt cluttered** — increased vertical spacing between all hero elements (eyebrow, names, "Together Forever", headline, date)

---

*This PRD reflects the final shipped state of the site. RSVP data persistence (database/API) remains out of scope for v1; the submit handler is structured to be backend-injectable.*
