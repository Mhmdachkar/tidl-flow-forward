# TIDL Launch Roadmap

## Purpose

This document defines the exact implementation roadmap required to launch TIDL.

The goal is:

- launch by deadline
- satisfy client requirements
- support LegitScript approval
- support LocumTele review
- provide complete telehealth UX

This roadmap takes priority over visual improvements.

Working software is more important than additional animations.

---

# Current Status

## Completed

✅ Landing page UI

✅ Premium visual design

✅ GSAP animations

✅ Clinical design direction

✅ Brand identity

✅ Hero experience

✅ Product visuals

---

## Missing

❌ Quiz

❌ Product pages

❌ Checkout

❌ Confirmation

❌ Account

❌ Patient portal

❌ Doctor flow

❌ Pharmacy flow

❌ Trust system

❌ FAQ

❌ Reviews

❌ AI search experience

---

# Priority Levels

P0 = Launch blocker

P1 = Required for launch

P2 = Post-launch

P3 = Future

---

# PHASE 0

# Homepage Fixes

Priority: P0

The homepage currently contains business contradictions.

---

## Remove App References

Remove:

- Phone app section
- Dashboard cards
- App UI
- App language

Client statement:

> We do not have an app.

---

## Remove 90-Day Program

Remove:

- protocol timeline
- milestone journey
- 90-day program language

Replace with:

- ongoing care
- physician follow-up
- treatment support

---

## Add Trust Section

Required:

- licensed physicians
- prescription treatment
- privacy
- secure checkout

---

## Add How TIDL Works

Flow:

1. Learn
2. Assessment
3. Physician review
4. Prescription
5. Pharmacy ships
6. Ongoing care

---

## Add FAQ

Required.

---

## Add Reviews

Required.

---

## Add Mobile Navigation

Required.

---

# Deliverable

Homepage version 2.

---

# PHASE 1

# Quiz

Priority: P0

The quiz is the most important page.

Nothing else converts without it.

---

Route:

/quiz

---

Goals:

- qualify patients
- collect medical information
- educate
- create trust

---

Requirements:

- progress bar
- save progress
- mobile-first
- large buttons
- no dead ends

---

Steps:

1. Goal selection
2. Basic information
3. Medical history
4. Lifestyle
5. Eligibility
6. Account
7. Review

---

Output:

Eligibility package.

---

Dependencies:

Checkout.

Doctor flow.

---

Deliverable:

Working assessment.

---

# PHASE 2

# Product Detail Pages

Priority: P0

Routes:

/products/glp-1
/products/weight-loss
/products/testosterone

---

Required sections:

- hero
- benefits
- how it works
- physician review
- safety
- FAQs
- reviews

---

Required CTA:

Start Assessment.

---

Avoid:

Add to Cart.

---

Deliverable:

Complete PDP system.

---

# PHASE 3

# Checkout

Priority: P0

Routes:

/checkout

---

Requirements:

- order summary
- consultation fee
- treatment fee
- shipping
- taxes

---

Payment methods:

- cards
- HSA
- FSA

---

Required:

- HIPAA notice
- consent
- legal agreements

---

Deliverable:

Functional checkout.

---

# PHASE 4

# Confirmation

Priority: P1

Route:

/confirmation

---

Show:

- order received
- physician review
- next steps
- support

---

Timeline:

Assessment
↓
Doctor review
↓
Prescription
↓
Pharmacy
↓
Shipping

---

Deliverable:

Post-purchase experience.

---

# PHASE 5

# Account Portal

Priority: P1

Route:

/account

---

Sections:

- orders
- status
- tracking
- support
- reorder

---

The account is informational.

Not a medical dashboard.

---

Deliverable:

Patient account.

---

# PHASE 6

# Doctor Experience

Priority: P1

Routes:

/how-it-works
/physicians

---

Explain:

- physician review
- prescription process
- telehealth laws

---

Show:

- real doctors
- credentials
- states served

---

Deliverable:

Medical trust.

---

# PHASE 7

# Pharmacy Flow

Priority: P1

Explain:

- prescription
- fulfillment
- cold shipping
- delivery

---

Required for:

LegitScript.

---

Deliverable:

Prescription legitimacy.

---

# PHASE 8

# AI Search Experience

Priority: P2

Routes:

/search

---

Features:

- goal search
- educational recommendations
- treatment guidance

---

AI may:

- educate

AI may not:

- diagnose

---

Medical questions:

Escalate to physician.

---

Deliverable:

Search experience.

---

# PHASE 9

# Reviews

Priority: P1

Sections:

- homepage
- product pages

---

Types:

- testimonials
- ratings
- photos

---

Avoid:

fake reviews.

---

# PHASE 10

# FAQ

Priority: P1

Topics:

- physicians
- prescriptions
- shipping
- safety
- costs

---

# PHASE 11

# Legal

Priority: P0

Routes:

/privacy
/terms
/medical-disclaimer

---

Requirements:

- HIPAA
- privacy
- disclosures

---

# PHASE 12

# SEO

Priority: P1

Every route requires:

- title
- description
- OG image

---

Schema:

- Organization
- MedicalOrganization
- FAQ
- Product

---

# PHASE 13

# Performance

Priority: P1

Targets:

Lighthouse:

95+

---

CLS:

<0.1

---

LCP:

<2.5s

---

INP:

<200ms

---

# Mobile Requirements

Every phase:

- mobile first
- responsive
- touch friendly

---

# Animation Requirements

Animation enhances.

Animation never blocks.

---

Animation priority:

1. Trust
2. Clarity
3. Conversion

---

# Launch Checklist

Homepage:
□

Quiz:
□

Product pages:
□

Checkout:
□

Confirmation:
□

Account:
□

Doctor flow:
□

Pharmacy flow:
□

Reviews:
□

FAQ:
□

Legal:
□

SEO:
□

Mobile:
□

Performance:
□

---

# Required Before LegitScript

Required:

- physician explanation
- prescription flow
- pharmacy explanation
- medical disclaimers
- privacy policy
- terms
- secure checkout

---

# Required Before Advertising

Required:

- conversion flow
- quiz
- checkout
- tracking
- analytics

---

# Required Before Scale

Required:

- account
- reorder
- AI search
- lifecycle messaging

---

# Future Phase

P3

- B2B portal
- advanced AI
- personalization
- clinic dashboard
- advanced recommendations

---

# Final Goal

A visitor should:

Learn.
Trust.
Start assessment.
Receive physician review.
Receive medication.
Continue care.

The website exists to facilitate that journey.

Every feature should support it.