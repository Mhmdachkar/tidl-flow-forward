# 19-infrastructure.md

# TIDL Technical & Business Infrastructure

---

# Purpose

This document defines the real-world infrastructure behind TIDL.

It covers:

* the medical platform
* the doctor network
* the pharmacy network
* the data layer
* the AI layer
* the payment system
* the text concierge
* lifecycle messaging

This is not a visual or UX document.

This is the operational reality that all front-end work must support.

---

# How The Site Connects To The Business

The website is the front.

The platform and pharmacies are the back.

When a customer checks out:

```text
Customer checks out on site
↓
Order flows into PrescribeRx
↓
LocumTele doctor reviews and prescribes
↓
Licensed pharmacy makes and ships
↓
Every step triggers an automatic update
↓
Customer notified, account updated, data recorded
```

Nothing is entered twice.

---

# PrescribeRx

PrescribeRx is the core technology platform.

It:

* receives the medical intake
* routes the order
* holds the patient portal
* holds the clinic portal
* provides the clinical knowledge base that powers on-site AI search
* manages the doctor review workflow
* records prescriptions

TIDL displays this experience on its own site.

TIDL does not rebuild the medical system.

---

# LocumTele

LocumTele is the licensed telemedicine doctor network.

* Separate contract from PrescribeRx
* Same chief medical director leads both
* LocumTele doctors are already switched on inside PrescribeRx

Every patient intake is reviewed by a LocumTele physician.

No AI prescriptions.

No automated approvals.

---

# The TIDL Data Layer

## What It Is

A single TIDL-owned data store that records:

* every customer
* every order
* every event
* every ad
* every piece of content

It sits on top of every other system.

Every channel reads from it and writes to it.

This is what the AI tools learn from over time.

---

## Privacy Architecture

Private health information (PHI) stays inside PrescribeRx.

It never enters the TIDL data layer.

The TIDL data layer holds:

* safe marketing data
* behavioral data
* purchase history
* engagement history

---

## Medical Signals (Locked Down Area)

A separate restricted area inside the data layer holds:

* what treatments someone was interested in
* how far they progressed in the quiz
* whether they started but did not complete

This is used ONLY for:

* re-engagement (email, text)
* product recommendations on site

This is NEVER sent to:

* advertising platforms
* third-party tools
* external systems

This separation is legally and ethically required.

---

# Pharmacy Network

TIDL works with a network of licensed pharmacies.

Each order is:

* prepared to order
* packed cold where needed
* shipped directly to the patient

Redundancy:

If one pharmacy is out of stock, the order automatically reroutes to another.

No manual intervention required.

---

# Payment System

## At Launch

PrescribeRx collects payment and reconciles to TIDL.

Reason:

A payment account in TIDL's own name takes time to set up.

---

## Post-Launch

TIDL moves to its own payment account.

TIDL then:

* collects directly
* controls refunds immediately
* keeps card on file in PrescribeRx for reorders and follow-on consults

No waiting on outside parties.

---

## Supported Payment Methods

* Credit cards
* Debit cards
* Apple Pay
* Google Pay
* HSA cards
* FSA cards

---

# Text Concierge

The text concierge is a distinct product feature.

It is a friendly text-based assistant that:

* helps first-time buyers through ordering
* handles reorders
* answers product questions
* triggers the how-to pen video at shipment

---

## At Launch

Welcome message only.

---

## Post-Launch

Fuller assistant with:

* safety guardrails
* reorder handling
* support escalation

---

## Rules

Medical questions are never answered by the text assistant.

Medical questions escalate to physicians.

---

# Pen Video Delivery

After the order ships, the customer receives:

* a text message
* containing a how-to video for the pen

The video covers:

* how to use the pen
* dosing instructions
* storage instructions

The pen is new to most people.

A smooth first experience matters.

This is triggered automatically when the pharmacy marks the order as shipped.

---

# Lifecycle Messaging

A planned series of automated emails and texts over time:

1. Welcome message
2. Care after delivery
3. Reminder before reorder
4. Win-back for lapsed customers
5. Reactivation of existing TIDL list

---

## Launch Status

Lifecycle messaging must be fully designed by July launch.

Lifecycle messaging switches on after launch.

---

# AI Layer

The AI layer is TIDL-owned.

It runs on top of the data layer.

It includes:

* the text concierge
* lifecycle messaging engine
* recommendations engine
* a watcher that monitors changes in medicine regulations

---

## AI Search

The on-site search and chat are powered by:

PrescribeRx's clinical knowledge base.

The TIDL AI layer styles the answers.

Results feed back into the system so it improves over time.

---

## AI Rules

AI may:

* educate
* recommend categories
* explain products
* style answers from PrescribeRx knowledge base

AI may not:

* diagnose
* prescribe
* answer medical questions directly
* guarantee eligibility

---

# B2B Clinic Portal

## Purpose

Clinics currently selling gray-market product need a legitimate alternative.

TIDL offers:

* a path where clinic patients see a real doctor
* receive a real prescription
* medication made by a licensed pharmacy

---

## At Launch

Handled manually.

---

## Post-Launch

Self-service B2B portal.

Route:

```text
/clinic
/clinic/orders
/clinic/patients
```

---

# Automated Order Updates

Every step of the order journey updates automatically.

Steps:

1. Prescribed
2. Shipped
3. Delivered

Each step:

* triggers the correct message to the customer
* updates the customer account
* applies correct state tax
* records in the data layer

Nothing is entered twice.

---

# Launch Timeline

## By July

* Site live and mobile-first
* Intake and checkout working end to end
* Welcome text sending
* Pen video sending on shipment
* Basic account working
* AI search live
* Lifecycle messaging fully designed

---

## After Launch

* Lifecycle messaging switches on
* Fuller text assistant goes live with safety guardrails
* B2B clinic portal moves from manual to self-service

---

## Phase 2

* Search and AI content marketing
* Paid advertising
* Social and creator campaigns

---

## Future

* Personalized patient portals
* Template reused across new product lines

---

# Non-Negotiable Rules (From PRD)

Every customer sees a real doctor and gets a real prescription.

Any medical question goes to a human — never a bot.

Claims are cleared with legal counsel before going live.

Adults only — gated to 18+.

The look is premium and medical, with the pen as the hero object.

---

# Conflict Resolution: "Add to Cart" Language

The DOCX uses "add to cart" in the context of AI search.

The MD files (`10-things-to-avoid.md`, `16-ai-search.md`) forbid "Add to Cart" language.

Resolution:

The AI search CTA must always read:

```text
Start Assessment
```

or

```text
Learn More
```

Never:

```text
Add to Cart
Buy Now
```

The DOCX reference to "add to cart" is informal shorthand for "begin the intake."

The formal language remains consistent with existing MD files.
