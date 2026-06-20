# 14-checkout-flow.md

# TIDL Checkout Experience

## Purpose

The checkout is not simply a payment form.

The checkout is where the user commits to:

* physician review
* medical treatment
* prescription process
* ongoing care

The experience should feel:

* secure
* medical
* trustworthy
* transparent

Not:

* ecommerce
* supplement store
* Shopify checkout

---

# Primary Goals

1. Reduce anxiety.
2. Explain what happens next.
3. Build trust.
4. Complete payment.
5. Prepare physician review.

---

# User Journey

```text
Quiz Complete
↓
Treatment Recommendation
↓
Checkout
↓
Payment
↓
Doctor Review
↓
Prescription
↓
Pharmacy Shipment
```

---

# Information Hierarchy

1. Recommended treatment
2. Physician review notice
3. Pricing
4. Shipping
5. Payment
6. Next steps

---

# Checkout Layout

Desktop:

```text
-------------------------
| Left      | Right     |
|           |           |
| Forms     | Summary   |
|           |           |
-------------------------
```

Mobile:

Single column.

Sticky summary at bottom.

---

# Section 1 — Treatment Summary

Display:

* treatment name
* dosage
* physician review required
* estimated timeline

Example:

```text
GLP-1 Weight Loss Program

Physician reviewed.
Prescription required.
Delivered to your door.
```

---

# Section 2 — Pricing

Display:

* monthly price
* consultation fee
* shipping cost
* taxes

Never hide costs.

No surprise charges.

---

# Subscription Information

Clearly explain:

* recurring billing
* refill schedule
* cancellation policy

Avoid:

* hidden subscriptions
* small print

---

# HSA / FSA

Display:

```text
HSA/FSA cards may be accepted.
```

Include:

* eligibility information
* support links

---

# Section 3 — Shipping

Collect:

* name
* address
* phone

Display:

* estimated delivery
* cold shipping if applicable

---

# Section 4 — Payment

Supported:

* credit cards
* debit cards
* Apple Pay
* Google Pay
* HSA/FSA

---

# Security Messaging

Persistent indicators:

* secure payment
* encrypted data
* protected information

Example:

```text
Your information is securely encrypted.
```

---

# Physician Notice

Required section.

Example:

```text
A licensed physician will review your information before prescribing treatment.
```

The customer is paying for:

* evaluation
* physician review
* treatment process

Not guaranteed medication.

---

# Prescription Disclosure

Example:

```text
Treatment eligibility is determined by a physician.
```

---

# Order Summary

Always visible.

Contains:

* treatment
* billing cycle
* shipping
* taxes
* total

---

# What Happens Next

After payment:

1. Doctor reviews.
2. Prescription issued if appropriate.
3. Pharmacy prepares medication.
4. Order ships.
5. Tracking sent.

---

# Mobile Requirements

Single-column layout.

Sticky footer:

```text
Total
Continue
```

Large buttons.

Large fields.

---

# Input Fields

Use:

* autofill
* address suggestions
* card autofill

Avoid:

* long forms
* multiple pages

---

# Error States

Clear messaging.

Example:

```text
Please enter a valid card number.
```

Avoid:

```text
Payment failed.
```

---

# Success Screen

After payment:

Headline:

```text
Thank you.
Your physician review has begun.
```

Display:

* order number
* timeline
* support

---

# Confirmation Timeline

Example:

```text
Assessment received.

Doctor review.

Prescription approval.

Pharmacy shipment.

Delivery.
```

---

# Support Access

Always available:

* chat
* email
* phone

Medical issues:

physician escalation.

---

# Animations

Minimal.

Recommended:

* fade
* slide
* progress

Avoid:

* parallax
* large motion
* floating effects

Trust is more important than excitement.

---

# Accessibility

WCAG AA.

Large buttons.

Keyboard support.

Screen reader support.

---

# Analytics Events

Track:

* checkout started
* payment completed
* checkout abandoned
* payment failed

---

# Legal Requirements

Display:

* terms
* privacy
* medical disclaimer

User agreement required.

---

# Trust Indicators

Show:

* licensed physicians
* secure checkout
* encrypted payment
* prescription required

---

# Forbidden Patterns

Do NOT use:

* countdown timers
* urgency banners
* fake scarcity
* sales popups
* discounts ending soon

This is healthcare.

Not ecommerce.

---

# Design References

Experience should feel similar to:

* Hims
* Ro
* modern healthcare checkouts

Not:

* Shopify
* Amazon
* supplement stores

---

# Success Metric

The customer should think:

> "My information has been securely submitted, and a physician will now review my case."

If the user feels they simply purchased a product, the checkout has failed.
