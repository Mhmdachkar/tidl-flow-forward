# 07-animation-system.md

# TIDL Motion & Animation System

## Philosophy

Animation is not decoration.

Animation communicates:

* trust
* quality
* premium value
* scientific precision
* clinical confidence

The website should never feel:

* playful
* gaming-oriented
* startup-generic
* overly energetic
* aggressive

The motion language should feel closer to:

* Apple
* Linear
* Arc Browser
* WHOOP
* Levels Health
* Hims
* Aesop

Motion should feel:

* intentional
* slow
* confident
* expensive
* effortless

---

# Motion Principles

## 1. Everything has weight

Elements do not appear instantly.

They emerge.

They settle.

They breathe.

---

## 2. Motion is layered

Foreground:

* 100%

Midground:

* 50%

Background:

* 20%

This creates depth.

---

## 3. Motion supports hierarchy

Primary elements:

* larger movement

Secondary elements:

* smaller movement

Decorative elements:

* nearly invisible movement

---

# Timing System

## Micro interactions

Duration:
150ms–300ms

Examples:

* button hover
* card hover
* icon movement

---

## Component reveals

Duration:
800ms–1400ms

Examples:

* cards
* images
* feature blocks

---

## Hero animations

Duration:
1600ms–2800ms

Examples:

* hero text
* hero object
* background waves

---

## Section transitions

Duration:
1200ms–2000ms

Examples:

* entering sections
* scrolling reveals

---

# Easing

Preferred:

```javascript
power3.out
power4.out
expo.out
sine.inOut
```

Avoid:

```javascript
bounce
elastic
back
```

No playful motion.

---

# Hero System

The hero should feel alive.

Components:

* floating hero object
* animated wave background
* subtle particles
* layered text animation

---

## Hero Text

Animation:

* y: 40px → 0
* opacity: 0 → 1
* blur: 12px → 0

Duration:
1.6–2.2 seconds

Stagger:
0.08–0.12

---

## Hero Background

Continuous motion:

* slow wave movement
* subtle breathing
* small rotation
* low-opacity particles

Movement should be almost subconscious.

---

## Hero Object

Objects:

* pen
* medical ring
* clinical shape

Animation:

* float 10–15px
* duration 6–10 seconds
* infinite loop

---

# Scroll Motion

Use GSAP ScrollTrigger.

Every section should have:

* entrance
* active state
* exit

---

## Parallax Layers

Background:
0.15

Mid:
0.30

Foreground:
0.50

---

# Section Reveals

Default:

```javascript
opacity: 0 → 1
y: 40 → 0
blur: 10px → 0
```

Duration:

1.0–1.4 seconds

---

# Product Cards

Cards should feel physical.

No flat appearance.

Effects:

* slight float
* shadow movement
* depth scaling

Hover:

```javascript
scale: 1.03
y: -8
```

Mobile:

tap interactions.

---

# Image Motion

Images should:

* slightly float
* respond to scroll
* have subtle depth

Never static.

---

# Background Motion

Backgrounds should contain:

* soft particles
* wave systems
* gradients
* clinical diagrams

Opacity:

2–8%

Maximum.

---

# Mobile Motion

Mobile uses independent animation values.

Never reuse desktop motion.

---

## Mobile Duration

0.8–1.4 seconds

---

## Mobile Distance

20px–30px

---

## Mobile Performance

Use:

```javascript
gsap.matchMedia()
```

Disable:

* heavy blur
* large parallax
* pinned sections

if necessary.

---

# ScrollTrigger Rules

Allowed:

* scrub
* pin
* stagger
* reveal

Avoid:

* excessive pinning
* stacked pin sections
* scroll hijacking

Maximum:

2 pinned sections per page.

---

# Page-Specific Motion

## Home

Cinematic.

---

## Quiz

Fast.

Focused.

Minimal.

---

## Product Page

Premium.

Slow.

Educational.

---

## Checkout

Very little animation.

Trust first.

---

## Account

Minimal motion.

Functional.

---

# Libraries

Primary:

* GSAP
* ScrollTrigger
* Lenis

Optional:

* Framer Motion
* Motion One

3D:

* React Three Fiber
* Drei

---

# GPU Rules

Animate only:

* transform
* opacity
* filter

Avoid:

* width
* height
* top
* left
* margin

---

# Accessibility

Respect:

```javascript
prefers-reduced-motion
```

Reduce:

* parallax
* floating
* particles

Maintain usability.

---

# Forbidden Effects

Do NOT use:

* bounce
* elastic effects
* excessive rotation
* large zooms
* flashy animations
* gaming effects
* particle explosions
* neon glows

---

# Final Goal

The motion system should make TIDL feel:

* medical
* premium
* scientific
* trustworthy
* expensive

The user should feel that every movement was intentionally engineered.

Animation should communicate confidence, not excitement.
