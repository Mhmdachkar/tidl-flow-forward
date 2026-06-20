# 15-account-portal.md

# TIDL Patient Portal & Account Experience

## Purpose

The account portal is not an ecommerce account.

It is a healthcare dashboard.

Patients return here to:

* track orders
* manage treatments
* reorder medication
* view physician updates
* access support
* monitor progress

The experience should feel:

* calm
* medical
* trustworthy
* organized

Not:

* Shopify account
* ecommerce dashboard
* crypto dashboard

---

# Primary Goals

1. Reduce patient anxiety.
2. Increase retention.
3. Simplify reorders.
4. Provide transparency.
5. Encourage adherence.

---

# Navigation Structure

```text
Dashboard
Orders
Treatment
Messages
Reorder
Support
Settings
```

Mobile:

Bottom navigation:

* Home
* Orders
* Treatment
* Support
* Account

---

# Dashboard

The dashboard answers one question:

> What happens next?

Display:

* current status
* next action
* recent activity

Example:

```text
Your physician review is complete.

Your prescription has been approved.

Your medication is preparing for shipment.
```

---

# Status Card

Large card.

States:

* Assessment received
* Physician review
* Prescription approved
* Pharmacy preparing
* Shipped
* Delivered

Visual:

Timeline.

---

# Order Tracking

Display:

* order number
* status
* shipment progress
* tracking number

Example:

```text
Order #10482

Shipped

Expected Tuesday.
```

---

# Timeline Component

```text
✓ Assessment

✓ Physician Review

✓ Prescription

✓ Pharmacy

→ Shipping

Delivery
```

Animations:

* progress fill
* soft reveal

---

# Treatment Card

Display:

* treatment name
* dosage
* physician instructions
* refill date

Example:

```text
GLP-1 Weight Management

2.5mg

Next refill: July 18
```

---

# Reorder System

One-click reorder.

Requirements:

* saved treatment
* saved address
* physician review if needed

CTA:

```text
Request Refill
```

---

# Reminder System

Patients receive:

* SMS reminders
* email reminders
* refill notifications

Portal displays:

```text
Your next refill is approaching.
```

---

# Messages

Patients may contact:

* support
* care team

Medical questions:

Escalated to physicians.

Never answered by AI.

---

# Support Center

Categories:

* shipping
* orders
* billing
* medication
* physician questions

Quick actions:

* contact support
* resend tracking
* request help

---

# Physician Information

Display:

* physician review status
* consultation date

Example:

```text
Reviewed by a licensed physician.
```

Avoid:

* fake physician profiles

---

# Treatment Progress

Optional future feature.

Examples:

* weight changes
* adherence
* milestones

Phase 2.

---

# Delivery Information

Display:

* shipping address
* expected arrival
* carrier

Cold-chain information if needed.

---

# Empty States

Examples:

```text
No active orders.

Start your assessment.
```

---

# Notifications

Examples:

* order shipped
* physician review complete
* refill available

Notification center:

Top-right icon.

---

# Security

Display:

* secure account
* protected information
* encrypted access

---

# Authentication

Supported:

* email/password
* magic links
* MFA (future)

---

# Mobile Experience

This is primarily a mobile product.

Requirements:

* large touch targets
* sticky navigation
* simple cards

Avoid:

* tables
* dashboards
* dense interfaces

---

# Account Homepage

Priority order:

1. Current status
2. Next action
3. Active treatment
4. Orders
5. Support

---

# Refill Experience

Flow:

```text
Refill Reminder
↓
Request Refill
↓
Physician Review
↓
Payment
↓
Shipment
```

---

# Support Escalation

Medical issues:

Doctor.

Shipping issues:

Support.

Billing:

Customer service.

---

# Future Features

Phase 2:

* appointment scheduling
* progress tracking
* personalized plans
* biomarker reports

---

# Animations

Subtle.

Use:

* fade
* slide
* progress

Avoid:

* floating objects
* dramatic motion

The portal should feel calm.

---

# Accessibility

WCAG AA.

Keyboard support.

Screen reader support.

Minimum 44px targets.

---

# Analytics

Track:

* portal login
* reorder started
* reorder completed
* support opened
* treatment viewed

---

# Forbidden Patterns

Do NOT include:

* achievement badges
* gamification
* streaks
* points
* leaderboards

This is healthcare.

Not fitness.

---

# Design References

Portal experience should feel similar to:

* One Medical
* modern patient portals
* healthcare dashboards

Not:

* ecommerce accounts
* SaaS analytics tools

---

# Example Dashboard

```text
Good afternoon.

Your prescription has been approved.

Your medication is preparing for shipment.

Expected delivery:
Tuesday, July 21

Need help?
Contact support.
```

---

# Success Metric

The patient should feel:

> I know exactly where my treatment is and what happens next.

The portal should reduce anxiety and increase trust.

It is a healthcare experience, not an ecommerce account.
