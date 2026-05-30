# Intro Pop-up Design â€” SuperBoy & SuperGirl Wedding Invitation

**Version:** 2.0 (As Built)
**Component:** `src/components/NameCaptureModal.tsx`

This document describes the final intro pop-up that captures the guest's name before revealing the main invitation site.

---

## Purpose

When the site loads, the guest is greeted by a full-screen pop-up that asks for their name. The name is stored in `sessionStorage` and used to personalize every subsequent section of the invitation. The pop-up only appears when no name is stored, so refreshing within the same browser tab won't show it again.

---

## When It Shows

- **First visit in a tab:** shown
- **Refresh in the same tab:** not shown (name persists via `sessionStorage`)
- **New tab / closed browser:** shown again (sessionStorage is per-tab/session)
- **`prefers-reduced-motion` users:** still shown, but with animations collapsed to 1ms

The choice of `sessionStorage` over `localStorage` is deliberate â€” wedding invitation links are often opened on shared/family devices where multiple guests may enter their own name, so per-session storage is the friendlier default.

---

## Visual Structure

### Background (full-screen)

- **Crossfading blurred couple photos:** all 5 couple photos (`couple1.jpg` â€“ `couple5.jpg`) cycle every 6.5 seconds with a 2.2-second crossfade
- Each photo styled with `filter: blur(14px) brightness(0.65) saturate(1.05)`
- A subtle 18-second `scale 1 â†’ 1.05` zoom animation runs on the entire background container for cinematic effect
- **Warm rose-gold radial overlay:** `radial-gradient(ellipse at center, rgba(120, 70, 40, 0.25) 0%, rgba(35, 20, 15, 0.65) 70%, rgba(20, 10, 8, 0.85) 100%)`
- **Bokeh glow patches:** two radial gradients (champagne at 20%/30%, blush at 80%/70%) layered on top
- **Petal canvas:** 45 desktop / 20 mobile petals drifting across the screen above the blurred background

### Centered Card

- Width: 90% on mobile, max 500px on desktop
- Background: ivory (`#fffaf3`) with `backdrop-blur-md`
- Border: 1px champagne (`rgba(198, 161, 91, 0.55)`)
- Border radius: 24px
- Shadow: layered â€” `0 30px 80px rgba(30, 18, 12, 0.45)` + inset `0 0 0 1px rgba(255, 250, 243, 0.6)` for an ivory inner highlight
- **Hand-drawn floral SVG ornaments** in the top-right and bottom-left corners (champagne strokes, gold/champagne fill dots)
- Padding: `px-8 py-12` mobile, `px-12 py-14` desktop

### Card Content (top to bottom)

1. Gold heart icon `â™¡`
2. Heading: `Welcome!` â€” Cormorant Garamond, `text-4xl md:text-5xl`, deep-brown
3. Subtext (uppercase tracked): `PLEASE LET US KNOW YOUR NAME BEFORE YOU CONTINUE` â€” Montserrat, muted-brown
4. Input field
5. Submit button
6. Couple names line: `SuperBoy & SuperGirl` â€” Great Vibes, gold
7. Date footer: `24 NOVEMBER 2026 â€¢ UDAIPUR` â€” Jost tracked label

### Input field

- Pill-shaped (`rounded-full`)
- Cream background, champagne border
- User SVG icon on the left
- Placeholder: `Enter your name` (Lora, muted-brown 60%)
- Cormorant Garamond text once typed
- Focus state: gold border + gold ring + soft glow
- Maxlength: 60 characters
- Autofocuses after the entrance animation finishes (~900ms)

### Submit button

- Champagneâ†’gold gradient pill
- Label: `Enter â™¡` (Montserrat tracked uppercase)
- Width: full on mobile, ~72% centered on desktop
- Hover: `-translate-y-0.5` lift + an absolute-positioned glow halo fade-in
- Active: `scale-[0.97]` press
- Disabled state during the 350ms post-submit transition

---

## Animations (Choreography)

| Time | Element | Animation | Source |
|---|---|---|---|
| 0s | Background overlay | Fade in | Framer Motion |
| 0â€“18s | Background container | Slow `scale 1 â†’ 1.05` | Framer Motion |
| Continuous | Couple photos | 2.2s crossfade every 6.5s | Framer Motion |
| Continuous | Petals | Bezier physics fall loop | Custom Canvas |
| 0.2s | Card | `scale 0.9 â†’ 1`, `y 16 â†’ 0`, fade in (`cubic-bezier(0.22, 1, 0.36, 1)`, 0.7s) | Framer Motion |
| 0.5s | Heart icon â™¡ | Fade + slide up | Framer Motion |
| 0.6s | Heading "Welcome!" | Fade + slide up | Framer Motion |
| 0.7s | Subtext | Fade + slide up | Framer Motion |
| 0.85s | Input field | Fade + slide up | Framer Motion |
| 0.9s | Auto-focus | Cursor enters the input | JS timeout |
| 1.0s | Submit button | Fade + slide up | Framer Motion |
| 1.2s | Couple names line | Fade in | Framer Motion |
| 1.3s | Date footer | Fade in | Framer Motion |

### Validation states

- **Empty submit:** input gets a rose border, rose ring, and a 0.4s shake animation. Inline error in rose color: `Please enter your name to continue`. Cursor re-focuses the input.
- **Name too long (>60 chars):** inline error: `Please use a shorter name`
- **Error clears** when the user types again

### Exit

- On valid submit:
  1. Submit button enters a brief disabled state (350ms) so the user sees the press animation
  2. `writeStoredName(name)` persists the trimmed name to `sessionStorage`
  3. App state updates â†’ modal fades out, main content (`MainContent`) fades + slides up (Framer Motion `AnimatePresence` cross-fade)

---

## Component API

```typescript
type NameCaptureModalProps = {
  onComplete: (name: string) => void;
};
```

The parent (`App.tsx`) handles persistence and state update:

```tsx
{!guestName && (
  <NameCaptureModal
    onComplete={(name) => {
      writeStoredName(name);  // sessionStorage
      setGuestName(name);
    }}
  />
)}
```

---

## Personalization Engine

The captured name flows through `usePersonalization(name)`, which returns ready-to-use personalized strings used throughout the site:

```typescript
type Personalization = {
  name: string;
  displayName: string;            // title-cased
  greeting: string;               // "Dear Aditya,"
  heroLine: string;               // "Dear Aditya, together with their families, they joyfully invite you to celebrate their union"
  countdownLine: string;          // "Aditya, the countdown to our forever beginsâ€¦"
  videoCaption: string;           // "Aditya, we'd love for you to relive this chapter with us"
  rsvpOpening: string;            // "Aditya, will you grace us with your presence?"
  thankYouAccept: string;         // "We can't wait to see you, Aditya â™¡"
  thankYouDecline: string;        // "We'll miss you, Aditya â€” your blessings mean the world to us â™¡"
};
```

---

## Colors Used

```css
--color-ivory: #fffaf3;          /* card background */
--color-cream: #f7efe4;          /* input background */
--color-blush: #f4d7d7;          /* bokeh accent */
--color-rose: #d9a6a6;           /* error state */
--color-champagne: #c6a15b;      /* borders, decorative SVGs, button gradient start */
--color-gold: #b88935;           /* heart icon, names, button gradient end */
--color-deep-brown: #4a3328;     /* primary text */
--color-muted-brown: #7a5a45;    /* subtext, placeholder */
```

---

## Fonts Used

- **Heading "Welcome!":** Cormorant Garamond (serif)
- **Couple names line:** Great Vibes (decorative script)
- **Subtext, error message, button label, date footer:** Montserrat / Jost (sans, tracked uppercase)
- **Input field text:** Cormorant Garamond
- **Placeholder text:** Lora

---

## Responsive Behavior

| Breakpoint | Card width | Padding | Heading | Floral corners | Petals |
|---|---|---|---|---|---|
| Mobile (< 768px) | 90% | `px-8 py-12` | `text-4xl` | `w-20 h-20` | 20 |
| Desktop (â‰¥ 768px) | up to 500px | `px-12 py-14` | `text-5xl` | `w-24 h-24` | 45 |

---

## Accessibility

- `aria-label="Your name"` on the input
- `aria-invalid={true}` on the input when the error state is active
- Inline error message has `role="alert"` so screen readers announce it
- Decorative SVGs (heart, floral corners) are `aria-hidden`
- The card receives keyboard focus naturally via the autofocused input
- Submit on Enter key (form `onSubmit`) works without mouse interaction