# 10-things-to-avoid.md

# Things To Avoid

## Purpose

This document defines patterns, designs, features, experiences, and implementations that should never appear inside TIDL.

If any future implementation conflicts with this document, this document takes priority.

Many of these items were explicitly rejected by the client.

Others conflict with the business model.

---

# The Biggest Rule

TIDL is not:

* an app company
* a supplement company
* a fitness company
* a SaaS startup
* a dashboard product

TIDL is:

> A premium telehealth company.

Everything should support that.

---

# DO NOT BUILD A MOBILE APP

Client statement:

> We do not have an app.

Remove:

* app screens
* app onboarding
* app dashboards
* mobile app previews
* phone interfaces
* fake app screenshots

---

Incorrect:

* "Manage your health in the app."
* "Download the app."

Correct:

* "Access your account."
* "View your orders."
* "Continue your care."

---

# DO NOT CREATE DASHBOARDS

Avoid:

* analytics cards
* health dashboards
* metrics screens
* tracking interfaces
* productivity widgets

The current phone section is incorrect.

---

# DO NOT CREATE A 90-DAY PROGRAM

Client statement:

> There is no 90-day plan.

Avoid:

* milestones
* weekly progress
* program phases
* 90-day journeys
* protocol timelines

The treatment is ongoing care.

---

# DO NOT GUARANTEE APPROVAL

Never say:

* guaranteed approval
* everyone qualifies
* instant prescriptions
* approved today

Always communicate:

* physician review
* eligibility
* clinical decision

---

# DO NOT LET AI PRACTICE MEDICINE

AI can:

* educate
* explain
* recommend products

AI cannot:

* diagnose
* prescribe
* approve treatment
* answer medical questions

Medical questions go to physicians.

---

# DO NOT FEEL LIKE A SUPPLEMENT COMPANY

Avoid:

* bottles everywhere
* bodybuilding language
* performance claims
* aggressive wellness messaging

Avoid phrases:

* optimize your body
* hack your health
* biohack your life

---

# DO NOT FEEL LIKE FITNESS BRANDS

Avoid:

* athlete branding
* gym culture
* sports marketing
* performance coaching

Avoid:

* dark sports themes
* energy drink aesthetics
* competition language

---

# DO NOT COPY THE MAC FIGMA

The MAC Figma is:

* inspiration
* motion reference
* storytelling reference

It is NOT:

* the website structure
* the information architecture
* the customer journey

Do not copy:

* layouts directly
* colors
* sports energy

---

# DO NOT FEEL LIKE A HOSPITAL

Avoid:

* hospital blue
* clinical portals
* sterile interfaces
* medical forms everywhere

The feeling should be:

premium healthcare.

Not hospital software.

---

# DO NOT FEEL LIKE A STARTUP

Avoid:

* SaaS cards
* purple gradients
* startup illustrations
* abstract blobs

Avoid:

* AI startup aesthetics
* fintech aesthetics

---

# DO NOT USE GENERIC STOCK PHOTOS

Avoid:

* smiling doctors
* people holding clipboards
* fake hospitals
* generic telehealth images

Prefer:

* premium lifestyle
* authentic people
* healthcare environments

---

# DO NOT OVERUSE ANIMATION

Animation should feel:

* expensive
* subtle
* controlled

Avoid:

* bounce
* elastic
* shaking
* spinning
* exaggerated effects

---

# DO NOT CREATE EMPTY SECTIONS

Large empty spaces reduce trust.

Avoid:

```text
Huge whitespace
+
One sentence
```

Use:

* content
* trust
* imagery
* subtle backgrounds

---

# DO NOT OVERUSE PARALLAX

Use:

small movements.

Avoid:

large scroll effects.

The website should feel:

smooth.

Not experimental.

---

# DO NOT USE HOVER AS PRIMARY INTERACTION

Many users are mobile.

Hover must never:

* reveal critical information
* hide buttons
* hide navigation

Everything important must remain accessible.

---

# DO NOT USE TINY TEXT

Minimum body text:

16px.

Avoid:

12px.

13px.

14px.

---

# DO NOT HIDE NAVIGATION ON MOBILE

Current issue:

Desktop links disappear.

No replacement exists.

Always provide:

* hamburger menu
* mobile drawer
* accessible navigation

---

# DO NOT USE LARGE PINNED SECTIONS

Avoid:

* long scroll traps
* multiple pinned sections
* horizontal scrolling

Mobile users scroll quickly.

---

# DO NOT USE HEAVY THREE.JS SCENES

Use Three.js only for:

* hero products
* premium objects

Avoid:

* environments
* large scenes
* decorative canvases

---

# DO NOT CREATE FAKE DATA

Avoid:

* heart rates
* biomarkers
* statistics
* health metrics

Unless they are real.

Fake health data reduces trust.

---

# DO NOT USE ECOMMERCE LANGUAGE

Avoid:

* Add To Cart
* Buy Now
* Limited Offer
* Flash Sale

Prefer:

* Start Assessment
* Learn More
* Continue Care

---

# DO NOT CREATE MEDICAL CLAIMS

Never say:

* guaranteed weight loss
* clinically proven results
* works for everyone

Claims require legal review.

---

# DO NOT OVERCOMPLICATE THE QUIZ

The quiz is:

* short
* guided
* easy

Avoid:

* overwhelming forms
* large questionnaires
* intimidating language

---

# DO NOT CREATE MULTI-COLUMN MOBILE LAYOUTS

Mobile:

one column.

Always.

Avoid:

* compressed grids
* tiny cards
* crowded layouts

---

# DO NOT SHIP GIANT FILES

Avoid:

```text
index.tsx
2500 lines
```

Target:

300 lines.

Maximum:

500 lines.

---

# DO NOT DUPLICATE COMPONENTS

Create:

reusable systems.

Avoid:

copy-paste components.

---

# DO NOT BUILD FEATURES THAT DO NOT EXIST

Current examples:

❌ app

❌ dashboards

❌ 90-day plans

❌ tracking systems

❌ health scores

Only build:

what the business actually provides.

---

# Failure Signals

The design has failed if someone says:

* "This feels like an app."
* "This feels like a supplement company."
* "This feels like SaaS."
* "This feels like a fitness brand."
* "This feels like a hospital."
* "This feels like an energy drink company."

---

# Success Signals

The design succeeds if someone says:

* "This feels legitimate."
* "This feels medical."
* "This feels premium."
* "This feels trustworthy."
* "This feels easy."
* "This feels like modern healthcare."

---

# Final Rule

When making decisions, always ask:

> Does this make TIDL feel more like a premium telehealth company?

If the answer is no:

Do not build it.
