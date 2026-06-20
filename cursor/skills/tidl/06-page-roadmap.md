# 06-information-architecture.md

# TIDL Information Architecture

This document defines the complete website architecture for TIDL.

It acts as the single source of truth for:

* Routes
* Pages
* User flows
* Navigation
* Page hierarchy
* Future expansion

No pages should be invented outside this structure without approval.

---

# Site Structure

```
/
├── Home
├── Category Pages
│   ├── Weight Loss
│   ├── Longevity
│   ├── Metabolic Health
│   ├── Hormonal Health
│   ├── Performance
│   └── Recovery
│
├── Product Pages
│   └── Individual treatments
│
├── Quiz
│
├── Checkout
│
├── Confirmation
│
├── Patient Account
│
├── AI Search
│
├── How TIDL Works
│
├── Doctors
│
├── Pharmacy
│
├── Science
│
├── Reviews
│
├── FAQ
│
├── About
│
├── Contact
│
└── Legal
```

---

# Primary Navigation

Desktop:

* Treatments
* How It Works
* Science
* Reviews
* FAQ
* Start Assessment

Right side:

* Search
* Account

---

# Mobile Navigation

Menu:

* Treatments
* How It Works
* Science
* Reviews
* FAQ
* Account
* Start Assessment

CTA remains fixed.

---

# User Flow

```
Homepage

↓

Category

↓

Product

↓

Quiz

↓

Doctor Review

↓

Checkout

↓

Confirmation

↓

Account

↓

Reorder
```

---

# Route: /

# Homepage

Purpose:

Sell the brand.

Explain the telehealth process.

Introduce the pen.

Build trust.

Drive quiz starts.

---

## Sections

### 1 Hero

* Headline
* Subheadline
* Primary CTA
* Pen object
* Animated background

---

### 2 Trust Bar

* Licensed doctors
* Secure checkout
* Physician-guided care
* Board-certified providers

---

### 3 The Pen

* What it is
* Why it matters
* Comparison

---

### 4 How TIDL Works

1. Learn
2. Quiz
3. Doctor review
4. Prescription
5. Pharmacy
6. Ongoing care

---

### 5 Category Cards

Health goals.

---

### 6 AI Search

Conversational discovery.

---

### 7 Reviews

Real patients.

---

### 8 Science

Clinical education.

---

### 9 FAQ

Common questions.

---

### 10 Final CTA

Start assessment.

---

# Route: /weight-loss

# Weight Loss Category

Purpose:

Primary revenue page.

---

Sections:

* Hero
* GLP-1 explanation
* Products
* Pen explanation
* Physician process
* FAQ
* CTA

---

# Route: /longevity

Focus:

* healthy aging
* cellular health
* prevention

---

# Route: /metabolic

Focus:

* metabolism
* insulin
* energy

---

# Route: /hormonal

Focus:

* hormone balance
* optimization

---

# Route: /performance

Focus:

* recovery
* optimization

---

# Route: /recovery

Focus:

* recovery
* resilience

---

# Product Architecture

```
/products/

├── lirosome
├── tirosane
├── tidl-core
└── tidl-cycle
```

---

# Product Page Structure

## 1 Hero

Outcome.

Product.

CTA.

---

## 2 Benefits

Expected outcomes.

---

## 3 How It Works

Mechanism.

---

## 4 Ingredients

Clinical information.

---

## 5 The Pen

Delivery method.

---

## 6 Safety

Important information.

---

## 7 Pricing

Subscription.

---

## 8 Reviews

Social proof.

---

## 9 FAQ

Questions.

---

## 10 CTA

Start assessment.

---

# Route: /quiz

The most important route.

This is the conversion engine.

---

# Quiz Flow

## Step 1

Goal selection.

---

## Step 2

Basic information.

---

## Step 3

Medical history.

---

## Step 4

Lifestyle.

---

## Step 5

Review.

---

## Step 6

Account.

---

## Step 7

Checkout.

---

# Quiz Requirements

* progress bar
* save progress
* resume later
* no dead ends
* mobile first
* doctor review messaging

---

# Route: /checkout

Purpose:

Payment.

---

Sections:

* order summary
* shipping
* payment
* taxes
* HSA/FSA
* disclosures

---

# Route: /confirmation

Order complete.

---

Content:

* thank you
* next steps
* doctor review
* expected timeline

---

# Route: /account

Patient dashboard.

Features:

* orders
* tracking
* reorder
* messages
* profile

---

# Route: /account/reorder

Simple reorder flow.

* previous prescription
* confirm
* payment
* ship

---

# Route: /search

AI search.

Purpose:

Help users discover treatments.

---

Capabilities:

* recommendations
* education
* products

Cannot:

* diagnose
* prescribe

---

# Route: /how-it-works

Dedicated process page.

---

Sections:

1. Learn.
2. Quiz.
3. Doctor.
4. Prescription.
5. Pharmacy.
6. Delivery.
7. Ongoing care.

---

# Route: /doctors

Explain:

* physician network
* state coverage
* licensing

---

# Route: /pharmacy

Explain:

* compounding
* shipping
* fulfillment

---

# Route: /science

Educational hub.

Topics:

* GLP-1
* metabolism
* hormones
* longevity

---

# Route: /reviews

Patient stories.

---

Content:

* testimonials
* before/after
* ratings

---

# Route: /faq

Common questions.

Examples:

* Is this prescription?
* How long does shipping take?
* Who reviews me?
* Is insurance accepted?

---

# Route: /about

Company.

Mission.

Vision.

Story.

---

# Route: /contact

Support.

Concierge.

Medical escalation.

---

# Legal Routes

```
/privacy
/terms
/accessibility
/medical-disclaimer
/shipping
/refunds
```

---

# Footer Architecture

Company:

* About
* Science
* Reviews

Support:

* FAQ
* Contact

Legal:

* Privacy
* Terms

Account:

* Login

CTA:

* Start Assessment

---

# SEO Architecture

Homepage:

Brand.

Category pages:

Commercial intent.

Product pages:

Treatment intent.

Science pages:

Informational intent.

---

# AI Search Optimization

Content should answer:

* ChatGPT
* Perplexity
* Claude
* Gemini

Pages must:

* use structured data
* answer real questions
* contain educational content

---

# Mobile Hierarchy

Priority:

1. CTA
2. Product
3. Trust
4. Process
5. Benefits

Avoid:

* large gaps
* decorative sections
* long animations

---

# Future Routes

Phase 2:

```
/clinic
/clinic/orders
/clinic/patients
```

---

Phase 3:

```
/portal
/messages
/care-plans
/recommendations
```

---

# Route Priority

## Critical

* Home
* Quiz
* Checkout
* Product pages

---

## High

* How It Works
* Science
* FAQ

---

## Medium

* Reviews
* Doctors
* Pharmacy

---

## Future

* B2B portal
* Advanced concierge
* Personalized care

---

# Navigation Priority

Desktop:

1. Treatments
2. How It Works
3. Science
4. Reviews
5. FAQ
6. Start Assessment

---

# Success Criteria

Every visitor should understand:

1. What TIDL is.
2. What the treatment is.
3. How doctors are involved.
4. How prescriptions work.
5. How the pen works.
6. What happens next.
7. How to begin.

If users leave confused about the process, the architecture has failed.

---

# Final Principle

The website is not a collection of pages.

It is a guided medical journey.

Every route should move the user one step closer to:

* trust
* understanding
* physician review
* treatment
* ongoing care
