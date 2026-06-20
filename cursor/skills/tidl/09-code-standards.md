# 09-code-standards.md

# TIDL Engineering Standards

---

# Purpose

This document defines the engineering standards for TIDL.

Every developer, AI agent, Cursor session, Claude session, and contributor must follow these standards.

These rules exist to ensure:

* maintainability
* scalability
* performance
* accessibility
* animation quality
* mobile performance

---

# Core Philosophy

Build systems.

Not pages.

Build components.

Not sections.

Build reusable experiences.

Not one-off implementations.

---

# Technology Stack

Framework:

* React 19
* TypeScript
* TanStack Start

Styling:

* Tailwind CSS v4

Animations:

* GSAP
* ScrollTrigger
* Lenis

3D:

* React Three Fiber
* Drei

Forms:

* React Hook Form
* Zod

UI:

* shadcn/ui

---

# Folder Structure

Required:

```text
src/
│
├── components/
│   ├── sections/
│   ├── ui/
│   ├── animations/
│   ├── quiz/
│   ├── checkout/
│   ├── account/
│   └── product/
│
├── hooks/
│
├── lib/
│
├── routes/
│
├── animations/
│
├── providers/
│
└── types/
```

---

# Section Architecture

Every homepage section:

One file.

Example:

```text
components/
└── sections/
    ├── HeroSection.tsx
    ├── TrustSection.tsx
    ├── PenSection.tsx
    ├── HowItWorksSection.tsx
    ├── ReviewsSection.tsx
```

Never:

```text
index.tsx
2400 lines
```

---

# Maximum File Size

Recommended:

300 lines.

Maximum:

500 lines.

If larger:

Split.

---

# Component Rules

Components should:

* do one thing
* be reusable
* accept props
* avoid business logic

Avoid:

* giant components
* deeply nested JSX
* duplicated layouts

---

# Route Rules

Each route:

One purpose.

Examples:

```text
/
/quiz
/products
/products/:slug
/checkout
/account
```

Avoid:

Single-page applications with every feature inside one route.

---

# TypeScript Rules

Strict mode required.

No:

```typescript
any
```

Prefer:

```typescript
type
interface
```

All API responses:

typed.

All props:

typed.

---

# Tailwind Rules

Allowed:

* utility classes
* component composition

Avoid:

200-character class strings.

Extract complex patterns.

---

Example:

```typescript
const cardStyles =
"rounded-3xl border bg-white p-8";
```

---

# Animation Philosophy

Motion should feel:

* slow
* expensive
* premium

Avoid:

* bounce
* elastic
* aggressive motion

---

# GSAP Rules

Always use:

```typescript
gsap.context()
```

Cleanup:

required.

---

Use:

```typescript
useLayoutEffect()
```

for timelines.

---

Use:

```typescript
ScrollTrigger.matchMedia()
```

for breakpoints.

---

Never:

Create global timelines.

---

# ScrollTrigger Rules

Allowed:

* reveal animations
* parallax
* pinning

Avoid:

* excessive pins
* overlapping triggers
* scroll hijacking

---

Maximum pinned sections:

3.

---

# Animation Properties

Animate:

* transform
* opacity
* filter

Avoid:

* top
* left
* width
* height
* margin

---

# Lenis Rules

Single instance only.

Global provider.

Never:

Initialize Lenis inside sections.

---

# React Three Fiber Rules

Only use R3F for:

* hero objects
* premium products

Avoid:

* decorative scenes
* large environments

---

Lazy load:

```typescript
Suspense
IntersectionObserver
```

---

Only mount when visible.

---

# Mobile Animation Rules

Desktop and mobile timelines must differ.

Required:

```typescript
gsap.matchMedia()
```

Example:

```typescript
mobile
tablet
desktop
```

Never run desktop timelines on phones.

---

# Framer Motion

Use only for:

* small interactions
* hover effects
* presence transitions

Avoid:

Large scroll systems.

GSAP owns scroll animation.

---

# State Management

Local state first.

Context only when necessary.

Avoid:

Global stores without reason.

---

# Forms

Required:

* React Hook Form
* Zod validation

Forms should:

* validate immediately
* show errors clearly
* support mobile keyboards

---

# Accessibility

Required:

* keyboard support
* focus states
* labels
* semantic HTML

All buttons:

must be accessible.

---

# Performance Budget

Target:

95+ Lighthouse.

---

JavaScript:

minimum possible.

---

Avoid:

* unnecessary libraries
* large dependencies
* duplicate animations

---

# Lazy Loading

Required:

* videos
* Three.js
* heavy sections
* media

---

# Images

Required:

* WebP
* AVIF
* lazy loading

---

Never:

Load full-resolution assets.

---

# Dependency Rules

Remove unused libraries.

Current candidates:

* recharts
* embla
* unused framer-motion features

---

Every dependency:

must have a reason.

---

# Naming Rules

Components:

```typescript
HeroSection
TrustSection
QuizProgress
```

Hooks:

```typescript
useScrollReveal
useLenis
useQuiz
```

---

Avoid:

```typescript
Component1
SectionNew
TestCard
```

---

# Error Handling

All forms:

must handle errors.

All API calls:

must handle errors.

All loading states:

must exist.

---

# SEO

Each route requires:

* title
* description
* canonical
* OpenGraph

---

# Responsive Rules

Mobile first.

Never:

Desktop first.

---

Breakpoints:

```text
sm
md
lg
xl
```

Use:

* flex
* grid
* clamp()

Avoid:

fixed widths.

---

# Security

Never expose:

* API secrets
* tokens
* credentials

Environment variables only.

---

# Code Review Questions

Before shipping:

1. Is this reusable?
2. Is this mobile-first?
3. Is this accessible?
4. Is this performant?
5. Is this maintainable?
6. Is this typed?
7. Is this animated correctly?

---

# Things To Avoid

* giant files
* duplicated components
* unnecessary dependencies
* desktop-first design
* animation abuse
* untyped props
* excessive state
* large canvases

---

# Engineering Goal

The codebase should feel:

* modular
* scalable
* clean
* maintainable

The website should feel:

* premium
* smooth
* fast

The architecture should support:

* new treatments
* new product lines
* new portals
* future telehealth services

without requiring major rewrites.
