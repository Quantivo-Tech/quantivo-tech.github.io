# QuantivoTech Influencer Marketing Website Redesign

## Overview

Redesign of QuantivoTech from a tech services company to a full-service influencer marketing agency connecting SaaS brands with SMB business owner influencers.

## Business Model

- **Service:** Full-service influencer marketing agency (matchmaking, contracts, campaign management, reporting)
- **Brands (paying clients):** SaaS/Tech companies with marketing budgets
- **Influencers (talent):** SMB business owners with authentic local/niche audiences
- **Differentiators:**
  1. Niche focus: SaaS × SMB influencer specialization (unique positioning)
  2. Personal touch: Boutique, hands-on service vs. big agency approach

## Target Audience

Primary design target: SaaS marketing teams (the paying customers)
- Modern, bold, tech-forward aesthetic appeals to them
- Influencer side needs clear "get brand deals" value prop

## Visual Direction

### Overall Style
- **Dark gradient background** (deep navy → black) flowing continuously top to bottom
- **No colored section breaks** - one unified scroll experience
- **3D depth throughout:**
  - Three.js floating geometric shapes (cubes, spheres, torus)
  - Glassmorphism on cards and panels
  - Isometric illustrations for icons/graphics
  - Layered parallax effects

### Preserved Elements (from current site)
- Three.js water shader effect on hero headline
- Particle field with mouse parallax
- Framer Motion scroll animations
- Floating navigation appearing on scroll
- Custom cursor with glow effect

### Color Palette
- Background: Deep navy → black gradient
- Accent: Vibrant blues/purples for CTAs and highlights
- Secondary: Teal/green accents for influencer-side elements
- Text: White primary, muted gray secondary
- Glassmorphism: Semi-transparent whites with blur

### Typography
- Keep Raleway + Inter font pairing
- Large, bold headlines
- Clean, readable body copy

## Page Structure

### Section 1: Hero
**Layout:** Full viewport, dark gradient background with particle field

**3D Elements:**
- Water shader text on headline (preserved from current)
- Floating 3D geometric shapes (soft-edged cubes, spheres, torus) slowly rotating
- Slight blur on background shapes for depth layers
- Glassmorphic decorative panels at angles

**Content:**
- Headline: "Where SaaS Brands Meet Real Influence" (water shader effect)
- Subhead: "The bridge between ambitious brands and influential business owners."
- Dual CTAs (glassmorphic buttons):
  - "I'm a Brand → Find Influencers"
  - "I'm an Influencer → Get Brand Deals"

**Animation:**
- Staggered fade-in for text
- Buttons slide up with spring physics
- 3D shapes drift with parallax on mouse move
- Scroll indicator at bottom

---

### Section 2: Trust Bar + Value Split

**Trust Bar:**
- Heading: "Trusted by forward-thinking brands"
- 6 grayscale logo placeholders in glassmorphic container
- Staggered fade-in animation
- Logos gain color on hover

**Value Split (two glassmorphic cards side by side):**

*Left Card - For Brands:*
- Icon: Target/bullseye in glowing orb
- Headline: "Scale Your Reach"
- Bullets:
  - Access vetted business influencers
  - Full campaign management
  - Transparent reporting & ROI tracking

*Right Card - For Influencers:*
- Icon: Handshake/growth in glowing orb
- Headline: "Monetize Your Audience"
- Bullets:
  - Get matched with relevant brands
  - Fair, transparent deals
  - We handle the business side

**Animation:**
- Cards float up on scroll (whileInView)
- Subtle 3D tilt on hover following mouse
- Soft shadow depth underneath

---

### Section 3: Why QuantivoTech (Differentiators)

**Layout:** Centered section with floating glassmorphic panel, large 3D torus rotating slowly behind

**Content (two vertical cards):**

*Card 1 - Niche Focus:*
- Isometric illustration: Network connecting SaaS icons to business figures
- Headline: "Built for B2B Influence"
- Copy: "We specialize in one thing: connecting SaaS brands with business owners who have real audiences. No lifestyle fluff - just authentic voices your buyers trust."

*Card 2 - Personal Touch:*
- Isometric illustration: Single person vs. crowd of faceless figures
- Headline: "Boutique, Not Factory"
- Copy: "No account managers juggling 50 clients. You get hands-on partnership, direct communication, and a team that actually knows your brand."

**Animation:**
- Cards slide in from alternate sides on scroll
- Isometric illustrations have subtle float/bob
- Background 3D torus rotates, responds to scroll

---

### Section 4: Results / Social Proof

**Layout:** Horizontal row of 3-4 floating stat cards, cluster of 3D spheres orbiting behind

**Stats (placeholders):**
- "500+" - Influencer Partners
- "98%" - Client Satisfaction
- "10x" - Average Campaign ROI
- "24hr" - Response Time

**Testimonial (glassmorphic card below stats):**
- Quote: "QuantivoTech found us the perfect partners - business owners whose audiences actually convert. Best agency decision we've made."
- Attribution: Placeholder name, SaaS Company
- Avatar placeholder

**Animation:**
- Stats count up from 0 on scroll
- Each stat card floats with offset timing
- 3D sphere cluster responds to mouse parallax
- Testimonial fades in with scale-up

---

### Section 5: How It Works

**Layout:** Three-step horizontal timeline (vertical on mobile), glassmorphic cards connected by glowing line, small 3D shapes floating around each step

**Steps:**

*Step 1 - "Tell Us Your Goals"*
- Isometric icon: Chat bubble/form
- Copy: "Share what you're looking for - whether you're a brand seeking reach or an influencer ready to partner."

*Step 2 - "We Find the Perfect Match"*
- Isometric icon: Puzzle pieces connecting
- Copy: "Our team handpicks partners based on audience fit, values, and goals. No algorithms - real curation."

*Step 3 - "Launch & Grow"*
- Isometric icon: Rocket/growth chart
- Copy: "We handle the campaign end-to-end. You get results, reports, and a lasting partnership."

**Animation:**
- Steps reveal sequentially on scroll
- Connecting line draws itself between steps
- 3D shapes rotate and drift gently
- Cards lift on hover with shadow increase

---

### Section 6: Dual CTA / Contact

**Layout:** Two large glassmorphic panels side by side (stacked on mobile), large 3D torus/abstract shape centered behind

**Left Panel - For Brands:**
- Gradient border: Blue/purple
- Headline: "Ready to Reach New Audiences?"
- Copy: "Tell us about your brand and goals. We'll show you what's possible."
- Form fields: Company Name, Your Name, Email, What are you looking for? (textarea)
- CTA: "Get Started" (vibrant accent)

**Right Panel - For Influencers:**
- Gradient border: Teal/green
- Headline: "Ready to Land Brand Deals?"
- Copy: "Tell us about your audience. We'll match you with the right opportunities."
- Form fields: Your Name, Email, Social Profile Link, Tell us about your audience (textarea)
- CTA: "Apply Now" (vibrant accent)

**Animation:**
- Panels float up with staggered timing
- 3D tilt on hover
- Button glow pulse on hover
- Background shape rotates continuously

---

### Section 7: Footer

**Layout:** Minimal, maintains dark gradient flow, faint particles continuing from hero

**Content:**

*Left - Brand:*
- QuantivoTech logo (CPU icon + wordmark)
- Tagline: "Connecting brands with influential voices."

*Center - Quick Links:*
- For Brands
- For Influencers
- About Us
- Contact

*Right - Connect:*
- Email: hello@quantivotech.com
- Social icons: LinkedIn, Twitter/X, Instagram (glassmorphic circles)

*Bottom Bar:*
- Subtle gradient separator line
- "© 2025 QuantivoTech. All rights reserved."
- Privacy Policy | Terms of Service

**Animation:**
- Footer fades in on scroll
- Social icons scale-up with glow on hover
- Links have underline slide-in on hover

---

## Technical Implementation Notes

### Preserve from Current Codebase
- React + TypeScript + Vite stack
- Framer Motion animation system
- Three.js ShaderText component (water ripple effect)
- Particle field with parallax
- useCursor hook for custom cursor
- useScrollSections hook for navigation
- Tailwind CSS design system
- Radix UI component primitives

### New Technical Requirements
- Additional Three.js 3D objects (floating shapes, torus, spheres)
- Glassmorphism CSS (backdrop-filter: blur)
- Count-up animation for stats
- Drawing line animation for timeline
- Form handling for dual contact forms
- Responsive stacking for mobile

### Performance Considerations
- Lazy load 3D elements below fold
- Reduce particle count on mobile
- Use requestAnimationFrame throttling (already in place)
- Consider reduced motion media query

---

## Assets Needed

### Placeholders (to be replaced later)
- 6 client logos for trust bar
- Testimonial quote, name, company, avatar
- Stats numbers (update with real data as available)

### To Create/Source
- Isometric illustrations for:
  - Network/connection graphic
  - Single person vs. crowd
  - Chat bubble/form
  - Puzzle pieces
  - Rocket/growth chart
  - Icons for value prop cards
- 3D geometric shapes (can be generated with Three.js)

---

## Success Metrics

- Clear dual-path user journey (brand vs. influencer)
- Professional, modern aesthetic appealing to SaaS marketing teams
- Unified scroll experience without jarring section breaks
- Preserved impressive animations from current site
- Mobile-responsive design
- Fast load times despite 3D elements
