# Implementation Plan: SuperBoy & SuperGirl Wedding Invitation

This plan outlines the phase-by-phase execution of the luxury digital wedding invitation. Each phase is designed to be small, incremental, and leaves the website in a fully runnable state that can be tested in the browser.

## User Review Required

Please review the phases below and let me know if you approve. 
I have a few clarifying questions in the "Open Questions" section below that we should answer before I begin.

## Open Questions

> [!WARNING] 
> **To the User:** Please answer these questions before we proceed:
> 1. **Framework Confirmation:** The PRD specifies React 19 + Vite 8 + Tailwind CSS v4. Since React 19 and Tailwind v4 are quite new, do you want me to stick strictly to these bleeding-edge versions, or fall back to React 18 / Tailwind v3 if there are any dependency conflicts?
> 2. **Assets:** There is `Haldi.png` and `haldi Ceremony.png` in the Assets folder. I will use `Haldi.png` as referenced in the PRD. Is that correct?
> 3. **Fonts:** I will load Great Vibes, Cormorant Garamond, Jost, Lora, and Montserrat directly from Google Fonts via the `index.html`. Is that acceptable?

## Phase-wise Execution Plan

### Phase 1: Project Initialization & Global Setup
- Scaffold a new Vite + React + TypeScript project.
- Install core dependencies (`framer-motion`, `gsap`, `@gsap/react`, `lenis`, `tailwindcss`, `@tailwindcss/vite`).
- Set up the global CSS with Tailwind v4 `@theme` block and custom keyframes.
- Create `src/config.ts` to centralize all wedding content (names, dates, strings, etc.).
- Move images from the `Assets` folder into `public/images/`.
- **Runnable State:** A blank React app with a correct build configuration, correct styling variables, and accessible images.

### Phase 2: Name Capture Modal & Personalization Hooks
- Create the `usePersonalization.ts` hook for managing `sessionStorage` and generating customized strings.
- Build the `NameCaptureModal` component with its complex entrance choreography using Framer Motion.
- Set up the `App.tsx` layout to conditionally render the modal or the main content.
- **Runnable State:** App shows the Name Capture modal with blurred background and validation. On submit, it logs the name, saves to session storage, and reveals a placeholder main page.

### Phase 3: Hero Section & Global Petals Canvas
- Build the custom HTML5 Canvas `PetalCanvas` component for the falling petals.
- Build the `HeroSection` with the 5 crossfading background images.
- Implement GSAP text stagger animations for the couple names and word-fade for the headline.
- Integrate Lenis smooth scrolling in `MainContent`.
- **Runnable State:** Modal captures name -> Reveals the fully animated Hero section with falling petals and smooth scrolling.

### Phase 4: Countdown Section
- Implement the `useCountdown` hook for live ticker logic.
- Build the `FlipDigit` primitive component using pure CSS 3D transforms (rotateX crossfade).
- Assemble the `CountdownSection` and add GSAP ScrollTrigger entrance animations.
- **Runnable State:** Scroll past the hero to see a live, working countdown to the wedding date.

### Phase 5: Timeline Section
- Build the `TimelineSection` using the alternating grid layout (responsive for mobile vs desktop).
- Implement the growing center line using a DOM div and GSAP ScrollTrigger scrub.
- Add scroll entrance animations (cards sliding in, heart markers springing in, photo parallax).
- **Runnable State:** Scroll past the countdown to see the fully animated timeline.

### Phase 6: Venue & Map Section
- Build the `VenueMapSection`.
- Implement the 5.5s CSS crossfade for the venue photos on the left card.
- Build the custom map placeholder on the right that lazy-loads a Google Maps iframe on click.
- **Runnable State:** Venue map section is visible and the map click-to-load feature works.

### Phase 7: Video Section & RSVP Form
- Build the `VideoSection` with the lazy-loaded YouTube iframe (thumbnail swap).
- Build the `RSVPSection` hybrid form.
- Use Framer Motion `AnimatePresence` for the conditional guest count dropdown.
- Implement form submission to `console.log` and the "Thank you" cross-fade state.
- **Runnable State:** Video section plays smoothly; RSVP form can be submitted and shows the personalized thank-you message.

### Phase 8: Final Polish & Footer
- Build the `Footer` component.
- Harmonize all section background gradients so there are zero visible seams between sections.
- Verify responsiveness across mobile, tablet, and desktop breakpoints.
- Ensure `prefers-reduced-motion` is honored across all animations.
- **Runnable State:** The final, polished, fully operational digital invitation.

---

Let me know if you are ready to approve this plan or if you have any changes!
