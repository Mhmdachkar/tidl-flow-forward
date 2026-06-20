# 13-quiz-flow.md

# TIDL Assessment & Medical Intake Flow

## Purpose

The assessment is the conversion engine of TIDL.

This is not:

* a survey
* a lead form
* a marketing quiz

This is:

* product discovery
* medical intake
* physician preparation
* patient qualification

The assessment should feel:

* professional
* medical
* guided
* reassuring
* trustworthy

The user should feel:

> "A doctor is going to review me."

Not:

> "I'm filling out a marketing form."

---

# Primary Goals

1. Understand patient goals.
2. Gather required medical information.
3. Prepare physician review.
4. Recommend the appropriate treatment.
5. Convert to checkout.

---

# Success Criteria

The patient should always understand:

* where they are
* how many steps remain
* why information is requested
* what happens next

---

# Flow Overview

```text
Landing Page
↓
Assessment
↓
Medical Intake
↓
Physician Review
↓
Checkout
↓
Order Confirmation
↓
Doctor Approval
↓
Pharmacy Shipment
```

---

# Total Length

Target:

5–8 minutes.

Maximum:

10 minutes.

---

# Step Structure

## Step 1 — Your Goal

Question:

"What are you looking to improve?"

Options:

* Weight loss
* Longevity
* Metabolic health
* Hormonal health
* Performance
* Recovery

Visual cards.

Large touch targets.

---

## Step 2 — About You

Collect:

* age
* sex
* height
* weight

Explain:

"This helps your physician review eligibility."

---

## Step 3 — Health History

Examples:

* diabetes
* heart conditions
* medications
* allergies
* previous treatments

Questions should be:

* simple
* conversational
* medically appropriate

---

## Step 4 — Lifestyle

Questions:

* exercise
* sleep
* eating habits
* goals

Purpose:

Help physicians understand context.

---

## Step 5 — Treatment History

Questions:

* previous GLP-1 usage
* previous medications
* previous outcomes

---

## Step 6 — Physician Review Notice

Large trust section.

Explain:

* licensed doctors review every assessment
* prescriptions require approval
* treatment eligibility varies

---

## Step 7 — Account Creation

Collect:

* email
* phone
* password

Explain:

"Save your progress and receive updates."

---

## Step 8 — Order & Checkout

If approved products exist:

* show recommendation
* pricing
* subscription details
* next steps

---

# Progress System

Required.

Example:

```text
Step 3 of 8
```

Progress bar:

* smooth animation
* persistent

---

# Save Progress

Users may leave.

System should:

* save progress
* resume later
* send reminder

---

# Mobile Experience

This is primarily a mobile experience.

Requirements:

* single question focus
* large spacing
* large buttons
* sticky next button

Avoid:

* long forms
* multi-column layouts

---

# Question Design

Good:

```text
Have you used GLP-1 medications before?
```

Bad:

```text
Have you previously been administered semaglutide compounds?
```

---

# Input Types

Use:

* cards
* segmented buttons
* sliders
* radio groups

Avoid:

* dropdowns
* long text fields

---

# Trust Elements

Persistent:

* physician reviewed
* secure
* private
* HIPAA compliant

---

# Doctor Messaging

Throughout the flow:

```text
A physician reviews every assessment.
```

```text
Treatment eligibility is determined by your doctor.
```

---

# Progress Animations

Use:

* GSAP
* Framer Motion

Transitions:

* slide
* fade
* blur

Duration:

500–700ms.

---

# Loading States

Doctor review screens:

* subtle motion
* progress indicators

Never fake:

* real-time doctor review

---

# Recommendation Screen

If eligible:

Show:

* product
* benefits
* next steps

CTA:

```text
Continue to Checkout
```

---

# Ineligible States

If treatment is not appropriate:

Show:

* supportive messaging
* physician recommendation

Never:

* force conversion

---

# Exit Recovery

If users abandon:

* email reminder
* SMS reminder
* resume link

Resume:

exact previous step.

---

# Accessibility

Minimum:

44px touch targets.

Large typography.

Keyboard support.

Screen reader support.

---

# Error Handling

Errors should be:

* clear
* specific

Example:

```text
Please select an option before continuing.
```

Avoid:

```text
Validation failed.
```

---

# Analytics Events

Track:

* started quiz
* completed step
* abandoned step
* completed quiz
* checkout started

---

# Future Features

Phase 2:

* intelligent recommendations
* dynamic branching
* AI assistance

---

# Forbidden Patterns

Do NOT use:

* marketing countdowns
* fake urgency
* quiz scores
* gamification
* spinning wheels
* health grades

This is medical intake.

Not entertainment.

---

# Design References

Experience should feel similar to:

* Hims
* Ro
* Levels
* Modern telehealth

Not:

* Buzzfeed quizzes
* Typeform marketing flows
* Lead generation funnels

---

# Success Metric

The user reaches the end and thinks:

> "A doctor is now reviewing my information."

If the user feels they completed a marketing survey, the experience has failed.
