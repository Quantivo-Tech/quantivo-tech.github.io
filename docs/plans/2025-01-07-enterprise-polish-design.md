# Enterprise Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bridge the quality gap between the animated hero/pinned sections and the static content below, making the entire page feel like cohesive high-end software.

**Architecture:** CSS-first approach for visual polish, React state for toggle interaction, Framer Motion for animations.

**Tech Stack:** React, Framer Motion, Tailwind CSS, SVG for path animations

---

## Section 1: "Why QuantivoTech" Cards - Glassmorphism 2.0

### Task 1.1: Update glass-card CSS

**Files:**
- Modify: `src/index.css`

**Changes:**
```css
.glass-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid transparent;
  will-change: backdrop-filter, transform;
  transform: translateZ(0);
}

/* Light Catch gradient border */
.glass-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.05) 20%,
    transparent 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Mobile optimization */
@media (max-width: 768px) {
  .glass-card {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  }
}
```

### Task 1.2: Update "Why QuantivoTech" typography

**Files:**
- Modify: `src/App.tsx` (Why QuantivoTech section)

**Changes:**
- Card headers: `text-3xl font-semibold tracking-tight text-white` (add letter-spacing: -0.02em)
- Body text: `text-lg leading-relaxed text-slate-400`

---

## Section 2: Stats Section - Prestige & Momentum

### Task 2.1: Update StatCard component

**Files:**
- Modify: `src/components/stat-card.tsx`

**Changes:**
1. Reduce count-up duration: 2000ms → 1500ms
2. Enhanced entrance animation:
```tsx
initial={{ opacity: 0, y: 30, scale: 0.9 }}
whileInView={{ opacity: 1, y: 0, scale: 1 }}
transition={{
  duration: 0.5,
  delay,
  type: "spring",
  stiffness: 200,
  damping: 20,
  mass: 0.8
}}
```
3. Add "bloom" effect on count complete:
   - Scale pop: 1 → 1.05 → 1 over 0.3s
   - Text shadow: 0 0 15px rgba(56,189,248,0.2) → 0.5 → 0.2
4. Add aria-live="polite" after animation for accessibility
5. Disable text-shadow on mobile

### Task 2.2: Update useCountUp hook

**Files:**
- Modify: `src/hooks/useCountUp.ts`

**Changes:**
- Add onComplete callback
- Reduce default duration to 1500ms

---

## Section 3: Testimonial Section - Punch & Credibility

### Task 3.1: Restyle testimonial quote

**Files:**
- Modify: `src/App.tsx` (testimonial section)

**Changes:**
1. Quote text: `text-2xl sm:text-3xl lg:text-4xl font-light tracking-tighter leading-[1.4]`
2. Pull quote highlight:
```tsx
<span className="bg-gradient-to-r from-sky-500/10 to-transparent px-2 py-1 rounded-sm text-sky-400 font-medium">
  Best agency decision we've made.
</span>
```
3. Attribution layout:
   - Monochrome abstract logo (SVG) on left
   - Name: `text-white font-medium`
   - Title/Company: `text-slate-500 text-sm tracking-wide uppercase`
4. Card padding: `px-8 md:px-16`

### Task 3.2: Add staggered entrance animation

**Changes:**
1. Quote mark fades in first (opacity 0.1)
2. Main quote fades + slides up (50ms delay)
3. Pull quote bloom effect (300ms delay)
4. Attribution slides up (200ms delay)

---

## Section 4: "How It Works" - Path Animation

### Task 4.1: Refactor ProcessTimeline to use SVG path

**Files:**
- Modify: `src/components/process-timeline.tsx`

**Changes:**
1. Replace div-based line with SVG path using `stroke-dasharray` and `pathLength`
2. Add "plasma tip" glowing dot at line leading edge:
```tsx
<motion.div
  className="absolute w-4 h-4 rounded-full bg-sky-400"
  style={{
    top: lineHeight,
    filter: "blur(8px)",
    boxShadow: "0 0 20px rgba(56,189,248,0.8)"
  }}
/>
```

### Task 4.2: Add active step detection and circle states

**Changes:**
1. Calculate exact scroll positions for each circle
2. Circle states:
   - Inactive: `bg-white/10`, `text-white/40`
   - Active: Full gradient + pulsing glow
   - Completed: Solid gradient, no pulse
3. Animate circle fill when line reaches it (duration: 0.3s)

### Task 4.3: Add spotlight effect on cards

**Changes:**
- Inactive cards: `opacity-40 grayscale`
- Active card: `opacity-100 grayscale-0` + subtle inner glow

---

## Section 5: Contact Section - Toggle & Dynamic Form

### Task 5.1: Create persona toggle component

**Files:**
- Modify: `src/App.tsx` (contact section)

**Changes:**
1. Add state: `const [userType, setUserType] = useState<"brand" | "influencer">("brand")`
2. Toggle design with Framer Motion `layoutId` for sliding pill:
```tsx
<div className="glass-card inline-flex p-1.5 rounded-full mb-12">
  <motion.div layoutId="toggle-pill" className="absolute inset-y-1.5 rounded-full bg-gradient-to-r ..." />
  <button>I'm a Brand</button>
  <button>I'm an Influencer</button>
</div>
```
3. Add `whileTap={{ scale: 0.95 }}` for tactile feedback

### Task 5.2: Implement form transition

**Changes:**
1. Wrap forms in `AnimatePresence mode="wait"`
2. Form transitions:
```tsx
initial={{ opacity: 0, x: 20, rotateY: 10 }}
animate={{ opacity: 1, x: 0, rotateY: 0 }}
exit={{ opacity: 0, x: -20, rotateY: -10 }}
```
3. Container `min-height` to prevent jumping
4. Single centered form: `max-w-xl mx-auto`

### Task 5.3: Add ambient glow and input polish

**Changes:**
1. Background glow (600px) that changes color with toggle:
   - Brand: Sky/Blue gradient
   - Influencer: Teal/Emerald gradient
2. Input focus states: `focus:shadow-[0_0_20px_rgba(56,189,248,0.3)]`
3. Button glow: `shadow-[0_0_30px_rgba(56,189,248,0.4)]`
4. Button hover: glow expands to 40px, scale 1.02x

---

## Section 6: Technical Precision

### Task 6.1: Style scrollbar

**Files:**
- Modify: `src/index.css`

**Changes:**
```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
html {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.15) transparent;
}
```

### Task 6.2: Update footer logo

**Files:**
- Modify: `src/App.tsx` (footer section)

**Changes:**
- Logo size: `w-8 h-8` → `w-10 h-10`
- Add glow: `shadow-lg shadow-sky-500/20`
- Text: `font-medium` → `text-xl font-medium`

---

## Implementation Order

1. Section 6 (CSS-only, quick wins)
2. Section 1 (Glass card CSS)
3. Section 2 (Stats animation)
4. Section 3 (Testimonial styling)
5. Section 4 (Process timeline - most complex)
6. Section 5 (Contact toggle - requires new state logic)

## Performance Checklist

- [ ] Lazy load heavy assets
- [ ] Test on mobile for blur performance
- [ ] Verify no layout shift during AnimatePresence transitions
- [ ] Check accessibility (aria-live, focus states)
- [ ] Test scrollbar in Firefox and Safari
