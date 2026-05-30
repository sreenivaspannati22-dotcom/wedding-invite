# Design Specification â€” SuperBoy & SuperGirl Wedding Invitation

**Version:** 2.0 (As Built)
**Wedding:** SuperBoy & SuperGirl â€¢ 24 November 2026 â€¢ Iconic Hotels & Resorts, Udaipur

This document captures the design language and section-by-section visual specs as implemented in the final shipped site.

---

# Overall Design Mood

A premium one-page Indian wedding invitation. Smooth, scrollable, animated, mobile + desktop responsive. The aesthetic is:

- Minimal, elegant, classic, romantic
- Soft, premium, cinematic
- Editorial â€” not flashy, not trendy
- Connected â€” sections blend seamlessly via harmonized background gradients
- Personalized â€” every textual block addresses the guest by name

There is no navbar, no about section, no menu, no extra pages â€” a clean, emotional, single-page experience.

---

# Color Palette

```css
--color-ivory: #fffaf3;
--color-cream: #f7efe4;
--color-blush: #f4d7d7;
--color-rose: #d9a6a6;
--color-champagne: #c6a15b;
--color-gold: #b88935;
--color-deep-brown: #4a3328;
--color-muted-brown: #7a5a45;
--color-overlay-dark: rgba(35, 20, 15, 0.55);
```

Section background gradients (harmonized so each section's top color exactly matches the previous section's bottom color):

| Section | Top â†’ Bottom |
|---|---|
| Hero | Dark warm overlay on blurred couple photos â†’ ivory (`#fffaf3`) via 35â€“40vh fade band |
| Countdown | `#fffaf3` â†’ `#faf0dd` â†’ `#f4e8d3` |
| Timeline | `#f4e8d3` â†’ `#fdf6e9` â†’ `#fffaf3` |
| Venue & Map | `#fffaf3` â†’ `#fbf1de` â†’ `#fdf2e2` |
| Video | `#fffaf3` â†’ `#fdf2e2` â†’ `#fbeede` |
| RSVP | `#fbeede` â†’ `#f6d8d8` â†’ `#fdeede` |
| Footer | `#fffaf3` |

---

# Typography

| Role | Font |
|---|---|
| Couple names (hero, footer) | **Great Vibes** (decorative script) |
| Section headings | **Cormorant Garamond** (serif, often italic) |
| Body / personalized text | **Lora** |
| Section eyebrows + form labels (uppercase tracked) | **Jost** Light 300 |
| Buttons + form inputs | **Montserrat** |

All loaded via Google Fonts with `preconnect`. Font weights are deliberately restrained â€” large emotional moments lean on serif/script; UI lean on geometric sans.

---

# Site Structure (Final)

```
1. Hero Section
2. Countdown Section
3. Wedding Timeline Section
4. Venue & Map Section          â† NEW vs v1
5. Couple Memories Video Section
6. RSVP Section
7. Final Footer
```

A name-capture popup blocks access on first visit until a name is provided (see `popupdesign.md`).

---

# Section 1 â€” Hero

**Background:**
- Full-screen crossfade through all 5 couple photos (8s/image)
- `background-position: center 25%` so faces sit in the upper third without being cropped
- `filter: blur(10px) brightness(0.65) saturate(1.05)` â€” softened, dreamy, but the photo's composition is still readable
- Warm radial-gradient mesh overlay (ivory â†’ blush â†’ champagne) + dark linear vignette for legibility

**Content (vertically centered, with generous breathing room):**

- Eyebrow line:
  `JOIN US FOR THE WEDDING OF`  
  Montserrat tracked uppercase, flanked by hairline champagne markers

- Couple names â€” **stacked on three lines**:
  - `SuperBoy` â€” Great Vibes, gold, clamp 3remâ€“6rem, character-by-character stagger reveal
  - `&` â€” Great Vibes, champagne, clamp 2remâ€“3.25rem, comfortable margin top/bottom
  - `SuperGirl` â€” Great Vibes, gold, clamp 3remâ€“6rem, character stagger

- Sub-line:
  `Together Forever`  
  Great Vibes, ivory/85, smaller scale so it sits as a delicate subtitle

- Personalized headline (word-by-word fade-up):
  `Dear [Name], together with their families, they joyfully invite you to celebrate their union`
  Lora, balanced text-wrap

- Date block:
  Champagne hairlines bracketing:
  `24 NOVEMBER 2026`  
  `UDAIPUR, INDIA`
  Jost tracked uppercase

**Bottom transition:**
- Generous fade band (`35vh` mobile / `40vh` desktop) that dissolves the dark hero gradually into the ivory of the section below â€” no hard horizontal seam
- The scroll indicator was removed in iteration 2 since the countdown sits directly below and the cue was visually marking the very seam we were trying to hide

**Animations:**
- Background image slow crossfade (continuous)
- Petals floating diagonally (continuous, global)
- Couple names: character stagger
- Headline: word fade-up
- Date: fade-up after the names settle

---

# Section 2 â€” Countdown

**Background:** Linear gradient `#fffaf3 â†’ #faf0dd â†’ #f4e8d3` with an SVG fractal-noise grain overlay at 18% opacity for parchment texture. Thin champagne dividers at top and bottom of the section.

**Content:**
- Tracked-uppercase eyebrow: `COUNTING DOWN TO OUR FOREVER`
- Italic serif personalized line:
  `[Name], the countdown to our forever beginsâ€¦`
  (After 24 Nov 2026 passes, this auto-flips to `[Name], our forever has begun â™¡`)
- Four counter blocks â€” `DD` / `HH` / `MM` / `SS` (2Ã—2 mobile, 1Ã—4 desktop):
  - Each digit is a `FlipDigit` component â€” on tick, the old digit rotates out (rotateX 0 â†’ -90Â°, opacity 1 â†’ 0) while the new digit rotates in (rotateX 90 â†’ 0Â°, opacity 0 â†’ 1). 500ms concurrent. Clean â€” no overlap ghosts.
  - Large Cormorant Garamond serif numbers with tabular numerals
  - Thin champagne hairline beneath each number
  - Jost tracked-uppercase label: Days / Hours / Minutes / Seconds

**Animation:**
- ScrollTrigger entrance at `top 80%` â€” label fades up, then 4 blocks slide-up stagger 0.12s

---

# Section 3 â€” Wedding Timeline

**Background:** Linear gradient `#f4e8d3 â†’ #fdf6e9 â†’ #fffaf3`

**Heading:**
- Tracked eyebrow: `THE CELEBRATION`
- Main heading (Cormorant Garamond): `Our Wedding Timeline`
- Subheading (Great Vibes, gold): `Celebrating love, laughter & happily ever after`

**Layout (4 events, all on 24 November 2026 at Iconic Hotels & Resorts, Udaipur):**

| # | Event | Time | Image |
|---|---|---|---|
| 1 | Haldi Ceremony | 11:00 AM onwards | `Haldi.png` |
| 2 | Mehendi & Sangeet | 2:00 PM onwards | `venuelawn.png` |
| 3 | Wedding Ceremony (Phere) | 12:00 AM â€” midnight muhurat | `phereweddingceremony.png` |
| 4 | Reception & Dinner | 8:00 PM onwards | `dinnerbuffet.png` |

**Desktop layout:**
- Center vertical line (champagne, 2px) with heart markers
- Alternating: photo-left/card-right, card-left/photo-right, repeat
- Cards and photos in matching-size grid columns

**Mobile layout:**
- Single column, line moves to the left edge (`left-6`)
- Photo stacks above card within each row, heart markers on the left
- Parallax disabled on touch devices (`matchMedia("(pointer: coarse)")`)

**Event card design:**
- Ivory background, rounded 24px, thin champagne border, soft shadow
- Floral SVG corner ornaments (top-right + bottom-left)
- Tracked-uppercase date in champagne
- Title in Cormorant Garamond serif
- Hairline champagne divider
- Body description in Lora
- Icon-prefixed lines for time (clock icon) and venue (map-pin icon)
- Hover: `-translate-y-1` lift

**Event photo design:**
- 4:3 / 5:4 rounded card
- Thin champagne border, soft shadow
- Dark gradient at the bottom for visual weight
- Image overflows by 20% top/bottom so it can parallax-translate without revealing whitespace

**Center timeline line (iteration-2 rewrite):**
- A real DOM `<div>` whose `height` grows 0% â†’ 100% as the user scrolls (driven by ScrollTrigger scrub, `invalidateOnRefresh: true`)
- A faint champagne hairline track sits behind it so the unfilled portion is still visible
- This replaces the SVG `strokeDashoffset` approach, which broke under non-uniform SVG scaling when images caused the section height to reflow

**Heart markers:**
- Circular ivory background with a champagneâ†’gold gradient heart inside
- Aligned exactly on the timeline line on both mobile and desktop
- Spring scale 0 â†’ 1 with `back.out(2)` easing on scroll entry

**Animations:**
- Heading: stagger fade-up at `top 80%`
- Each row: card slides in from its side, photo slides in from the opposite side (60px x-translation on desktop, 30px y on mobile)
- Photo parallax: `yPercent -8 â†’ +8` scrubbed with scroll (desktop only)
- Center line: grows with scroll
- Heart markers: spring scale in

---

# Section 4 â€” Venue & Map (NEW in iteration 2)

**Background:** Linear gradient `#fffaf3 â†’ #fbf1de â†’ #fdf2e2`

**Heading:**
- Tracked eyebrow: `THE VENUE`
- Main heading: `Where It All Happens`
- Subheading (Great Vibes, gold): `Iconic Hotels & Resorts`

**Layout:** Two-column grid (single column on mobile)

**Left â€” Framed venue photo card:**
- 4:5 aspect ratio rounded card with layered ivory + champagne borders and deep amber drop-shadow
- Crossfades every 5.5s through 4 venue photos:
  - `venuentrace.png` â†’ `venuelawn.png` â†’ `ringceremonyengagement.png` â†’ `poolpartyside.png`
- Progress dots in top-right corner (active dot widens to `w-6`)
- Bottom overlay text:
  - `THE CELEBRATION` (eyebrow)
  - `Iconic Hotels & Resorts` (serif)
  - `24 NOVEMBER 2026 â€¢ UDAIPUR, INDIA` (tracked label)

**Right â€” Venue address + Map preview:**
- Address card:
  - `FIND US HERE` (eyebrow)
  - `Iconic Hotels & Resorts` (serif)
  - Full venue address in Lora body
- **Stylized custom map placeholder:**
  - SVG roads (curved champagne paths) + simulated buildings (rounded rects at 18% opacity)
  - Large gold pin (champagneâ†’gold gradient with ivory inner circle) at the center with a soft pulse glow underneath
  - "Tap to load map" pill button (champagneâ†’gold gradient, ivory text) at the bottom
- On click, the placeholder is swapped for a `<iframe>` of Google Maps search embed (no API key required)
- **"Open in Google Maps"** button below with map-pin icon â€” deep-links to Google Maps for navigation

**Animations:**
- Heading: stagger fade-up
- Photo frame: slides in from left
- Map card: slides in from right
- All at `top 80%`, GSAP ScrollTrigger

---

# Section 5 â€” Couple Memories Video

**Background:** Linear gradient `#fffaf3 â†’ #fdf2e2 â†’ #fbeede`

**Heading:**
- Tracked eyebrow: `OUR STORY`
- Main heading: `Our Love Story`
- Subheading (Great Vibes, gold): `A journey of love, laughter & memories`
- Hand-drawn floral SVG flourish underneath the heading

**Video frame:**
- 16:9 centered card, max-width 800px (full width on mobile)
- **Layered borders:** 1px gold inside, 6px ivory + 1px gold halo outside
- Deep amber drop-shadow
- Desktop only: flanking floral SVG flourishes left and right of the frame

**Lazy-load pattern:**
- Initial state: YouTube thumbnail (`hqdefault.jpg`) with darkened gradient overlay
- Large central play button â€” champagneâ†’gold gradient circle (20Ã—20 mobile, 24Ã—24 desktop), 4px ivory inner ring, gold glow
- On click â†’ swap to `<iframe>` from `youtube-nocookie.com` with `?autoplay=1&rel=0&modestbranding=1`
- Reserved `aspect-video` ratio prevents layout shift

**Caption (below the frame):**
- Italic Cormorant Garamond, muted-brown:
  `[Name], we'd love for you to relive this chapter with us`

**Animations:**
- Heading: stagger fade-up
- Frame: scale 0.94 â†’ 1 + fade
- Caption: fade-up

---

# Section 6 â€” RSVP

**Background:** Linear gradient `#fbeede â†’ #f6d8d8 â†’ #fdeede` with large champagne floral SVG decorations in bottom-left and bottom-right corners

**Heading:**
- Tracked eyebrow: `WILL YOU BE THERE?`
- Main heading: `Kindly RSVP`
- Subheading (Great Vibes, gold): `We look forward to celebrating with you`

**Form card:**
- Ivory background with translucency + backdrop blur
- Champagne border, soft shadow

**Personalized opening line (italic):**
`[Name], will you grace us with your presence?`

**Hybrid form fields:**

1. **Name** â€” pill-shaped cream input, pre-filled with the captured guest name, editable

2. **Attendance toggle (two styled buttons in a grid):**
   - `Yes, I'll attend â™¡` â€” active state fills with champagneâ†’gold gradient
   - `Sorry, I can't make it`
   - Inactive: cream background, champagne border, hover gold border

3. **Number of guests (conditional dropdown):**
   - Only appears when "Yes" is selected (Framer Motion `AnimatePresence` height+opacity expand)
   - Options: `Only me` / `2 people` / `3 people` / `4 people` / `5+ people`
   - Custom champagne chevron icon

4. **Optional message** â€” textarea with `"(optional)"` label hint, max 500 chars

5. **Submit button** â€” champagneâ†’gold gradient pill, 70% width on desktop, hover lift + glow halo, active scale 0.97
   - Label: `Send RSVP â™¡`

**States:**
- **Default:** form visible
- **Submitted:** form cross-fades to thank-you panel:
  - Gold â™¡ icon
  - "Thank you!" heading
  - Personalized message â€” `thankYouAccept` ("We can't wait to see you, [Name] â™¡") or `thankYouDecline` ("We'll miss you, [Name] â€” your blessings mean the world to us â™¡") depending on attendance
  - Tracked footer: `24 NOVEMBER 2026 â€¢ UDAIPUR, INDIA`
- **Error:** inline `role="alert"` message + shake animation on the relevant input

**Submit behavior (v1):**
- Structured payload `{ name, attendance, guestCount, message, submittedAt }` logged to `console.log`
- No network request â€” placeholder for future backend integration

**Animations:**
- Heading: stagger fade-up
- Form fields: ScrollTrigger stagger fade-up (`opacity 0, y 18, stagger 0.1s`)
- Submit button: hover lift, active scale

---

# Section 7 â€” Footer

- Champagne hairline + gold â™¡ + champagne hairline divider
- `With love,` (Great Vibes, gold)
- `SuperBoy & SuperGirl` (Great Vibes, gold, larger)
- `24 NOVEMBER 2026 â€¢ UDAIPUR, INDIA` (Jost tracked label, muted-brown)
- Solid ivory background

---

# Global Visual Elements

## Floating Petals (Canvas)

- Fixed, full-screen, behind all sections (z-index 5)
- 55 desktop / 25 mobile petals (auto-detected via `matchMedia`)
- Each petal: bezier-drawn rounded oval with subtle inner highlight
- Palette: ivory, soft blush, dusty rose, champagne tint, cream
- Physics per petal: slow fall (0.3â€“0.8 px/frame), sinusoidal horizontal sway, slight rotation, randomized opacity 0.3â€“0.85
- DevicePixelRatio-aware, pauses on `visibilitychange`
- Visually links sections together as the user scrolls â€” petals float across the entire page, not just one section

## Cross-section blending

All section background gradients are calibrated so each section's top color exactly matches the previous section's bottom color (see palette table above). The hero gets a 35â€“40vh fade band at its bottom that dissolves the dark blurred photo background into the ivory of the countdown.

## Smooth scroll

- Lenis is initialized after the popup is dismissed
- Wired into the GSAP ticker so ScrollTrigger updates stay in sync
- `syncTouch: false` so iOS keeps native momentum scrolling
- Honors `prefers-reduced-motion` (skipped entirely in that case)

## Reduced motion

- CSS animations collapse to 1ms via `@media (prefers-reduced-motion: reduce)`
- GSAP `globalTimeline.timeScale(100)` â€” all timed animations finish effectively instantly
- Lenis is skipped â€” browser's default scroll is used

---

# Image Asset Inventory (final)

All in `/public/images/`:

| File | Used in |
|---|---|
| `couple1.jpg` â€“ `couple5.jpg` | Popup background crossfade + Hero background crossfade |
| `Haldi.png` | Timeline event 1 (Haldi Ceremony) |
| `venuelawn.png` | Timeline event 2 (Mehendi & Sangeet) + Venue Map crossfade |
| `phereweddingceremony.png` | Timeline event 3 (Wedding Phere) |
| `dinnerbuffet.png` | Timeline event 4 (Reception & Dinner) |
| `venuentrace.png` | Venue Map crossfade |
| `ringceremonyengagement.png` | Venue Map crossfade |
| `poolpartyside.png` | Venue Map crossfade |
| `pop-uppage.png` | (reference asset, not used in code) |

---

# Design Feel

The final site feels like:

- A luxury Indian wedding invitation
- A cinematic love story
- Minimal but emotional
- Smooth and modern
- Classic, not trendy
- Elegant, not flashy
- Beautiful and connected on both desktop and mobile

---

# What Was Deliberately Excluded

- Navbar
- About section
- Long paragraphs
- Multiple pages
- Heavy dark theme
- Cluttered layout
- Tech startup styling