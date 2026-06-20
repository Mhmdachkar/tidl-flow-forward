# 08-mobile-first.md

# Mobile First Design Requirements

---

# Purpose

TIDL is a mobile-first telehealth platform.

Most users will discover TIDL through:

* social ads
* search engines
* AI recommendations
* email campaigns
* text messages

The majority of users will experience the product on mobile devices.

Desktop is secondary.

The entire product must be designed mobile-first.

Desktop should expand the experience.

Desktop should not define the experience.

---

# Core Principle

Never:

* design desktop first
* shrink desktop layouts
* scale down desktop components

Instead:

1. Design mobile.
2. Optimize tablet.
3. Expand to desktop.

---

# Mobile Goals

The user should understand within 5 seconds:

* what TIDL is
* what treatment is offered
* what happens next
* where to click

---

# Target Devices

Primary:

* iPhone 13–16
* Samsung Galaxy devices

Secondary:

* tablets
* desktop

---

# Breakpoints

```css
Mobile:
320–639px

Tablet:
640–1023px

Desktop:
1024px+

Large Desktop:
1440px+
```

---

# Hero Requirements

Immediately visible:

* headline
* description
* CTA
* product image

No large spacing.

No oversized images.

No excessive animation delays.

---

Mobile order:

```text
Headline
↓
Description
↓
CTA
↓
Trust
↓
Product
```

---

Maximum hero height:

100svh.

Avoid:

140vh hero sections.

---

# Mobile Navigation

Current implementation problem:

No mobile navigation.

Requirements:

* hamburger menu
* slide drawer
* sticky navigation
* visible CTA

---

Navigation items:

* Treatments
* How It Works
* Reviews
* FAQ
* Start Assessment

---

# Mobile Typography

Headline:

32–48px.

Subheadline:

16–20px.

Body:

16px minimum.

Buttons:

16–18px.

Never use:

12px.

13px.

14px body text.

---

# Spacing Rules

Current issue:

Large empty spaces.

Maximum section padding:

```css
py-16
```

Preferred:

```css
py-10
py-12
```

Avoid:

```css
py-32
py-36
py-48
```

on mobile.

---

# Image Rules

Images should:

* fit viewport
* remain visible
* never clip

Avoid:

* oversized crops
* hidden faces
* cut products

---

# 3D Objects

Products:

* remain centered
* preserve depth
* preserve shadows

Reduce:

* rotation
* parallax

on smaller devices.

---

# Animation Philosophy

Desktop:

cinematic.

Mobile:

fast enough to feel responsive.

---

Desktop:

1.8–3s

Mobile:

0.8–1.5s

---

# GSAP Mobile Rules

Use:

```javascript
gsap.matchMedia()
```

Required breakpoints:

* mobile
* tablet
* desktop

Never run desktop animations on mobile.

---

# ScrollTrigger Rules

Avoid:

* long pin sections
* horizontal scroll
* excessive scrub

Mobile users scroll quickly.

Animations should respect this behavior.

---

# Section Rules

---

## Hero

Immediately visible.

No large delays.

---

## Trust

Visible above the fold.

---

## Product

Centered.

Floating.

---

## How It Works

Vertical timeline.

---

## Reviews

Single-column cards.

---

## FAQ

Full-width accordion.

---

## CTA

Large button.

Full width.

---

# Cards

Cards become:

```text
Desktop:
3–4 columns

Tablet:
2 columns

Mobile:
1 column
```

---

Minimum card width:

100%.

Avoid:

Horizontal scrolling.

Except:

Reviews.

---

# Product Sections

Products should:

* float
* center align
* remain large

Hover interactions become:

Tap interactions.

---

# Video Sections

Video must:

* autoplay muted
* support tap play
* maintain aspect ratio

Maximum height:

60vh.

---

# Quiz Requirements

Progress bar must remain visible.

Buttons:

Large touch targets.

Minimum:

48px height.

---

Back button:

Always accessible.

---

# Forms

Input height:

56px minimum.

Spacing:

16–24px.

Keyboard safe.

No hidden fields.

---

# Checkout

Single-column only.

Order summary collapsible.

Sticky checkout button.

---

# Account Portal

Cards.

Large touch targets.

No complex tables.

---

# Performance Requirements

Target:

60 FPS.

---

Animation budget:

Only animate:

* transform
* opacity
* filter

Never animate:

* width
* height
* top
* left

---

# Image Optimization

Required:

* WebP
* AVIF
* lazy loading

---

# Three.js Requirements

Only mount:

When visible.

Lazy load:

* canvases
* models

Disable heavy effects.

---

# Empty Space Rules

Whitespace should:

support content.

Whitespace should never:

create confusion.

---

# Mobile Backgrounds

Background effects:

* simplified waves
* reduced particles
* smaller blur effects

Reduce complexity by 50%.

---

# Accessibility

Minimum tap target:

48px.

Color contrast:

WCAG AA.

Visible focus states.

Readable text.

---

# Failure Conditions

The experience fails if:

* users cannot navigate
* CTAs are hidden
* products are cropped
* animations stutter
* large empty areas appear
* text is too small

---

# Final Goal

The mobile experience should feel:

* fast
* trustworthy
* premium
* easy

Users should be able to:

* understand TIDL
* trust TIDL
* start the assessment

within the first few seconds.

Desktop should enhance the experience.

Mobile should define the experience.
