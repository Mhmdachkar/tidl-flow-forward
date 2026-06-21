# 20-docx-missing-specs.md

# TIDL Missing Specs From Docx

---

# Purpose

This document captures the items described in `TIDL.com Overview_08JUN26.docx` that still do not have dedicated MD specs.

The order below is intentional:

1. Non-API items first.
2. API-dependent items last.

---

# Source of Truth

Primary source:

`TIDL.com Overview_08JUN26.docx`

Cross-checked against:

- `00-project-overview.md`
- `11-current-audit.md`
- `13-quiz-flow.md`

---

# Missing Items List

The following features are documented in the docx but do not yet have full standalone specs:

1. SMS/Text concierge + reorder by text
2. Education/how-to video (pen tutorial sent on delivery)
3. 18+ age gate
4. Clinic/wholesale portal (manual at launch)
5. Lifecycle messaging (welcome, reorder reminder, win-back)
6. Incomplete quiz resume (continue where user stopped)
7. SEO + AI answer optimization (Google + LLM answer surfaces)

---

# Phase A — Non-API Specs First

## A1) 18+ Age Gate Spec

Create:

`21-age-gate.md`

Must define:

- Trigger: first site entry and deep-link entry.
- UX: compliant gate, not a joke gate.
- State behavior: remember verified users for a reasonable window.
- Failure path: under-18 blocked route and legal copy.
- Accessibility: keyboard and screen-reader behavior.

Acceptance:

- Every public entry route is gated.
- User cannot bypass gate by direct deep-link.
- Mobile and desktop parity.

---

## A2) Education / Pen Tutorial Spec

Create:

`22-education-video.md`

Must define:

- Where video appears (post-purchase and account/order context).
- Content blocks: how to inject, dosing basics, storage, safety reminders.
- Trigger timing relative to shipping status.
- Backup non-video content for low bandwidth / no autoplay.
- Compliance note: educational, not diagnosis.

Acceptance:

- User can always find "How to use your pen" after order ships.
- Video is optional, guidance is still accessible as text steps.

---

## A3) Clinic / Wholesale Flow Spec

Create:

`23-clinic-wholesale.md`

Must define:

- Launch mode: handled manually (no self-serve portal yet).
- Lead capture flow for clinics.
- Human handoff process and SLA expectations.
- Qualification fields and legal disclaimers.
- Future migration path to self-serve portal.

Acceptance:

- Clinics can request partnership without dead ends.
- Internal team receives actionable intake information.

---

## A4) Quiz Resume Spec

Create:

`24-quiz-resume.md`

Must define:

- Resume token/session behavior.
- Save points (every step vs critical steps).
- Return entry points (email/text/deep link).
- What happens when data becomes stale.
- UX copy for "resume where you left off".

Acceptance:

- User can leave and return to the exact saved step.
- No forced restart unless required by policy.

---

## A5) SEO + AI Answer Optimization Spec

Create:

`25-seo-ai-optimization.md`

Must define:

- Metadata rules per route (title, description, OG, canonical).
- Structured data strategy (Organization, MedicalOrganization, FAQ, Product where valid).
- Content model for answer-ready pages (clean Q/A blocks, source transparency, medical review attribution).
- Internal linking strategy for treatment, process, and trust pages.
- Measurement KPIs (impressions, CTR, branded/non-branded, citation visibility tracking).

Acceptance:

- All core routes pass metadata/schema checklist.
- FAQ and process content are machine-readable and human-clear.

---

# Phase B — API-Dependent Specs (Keep at End)

## B1) SMS/Text Concierge + Reorder by Text

Create:

`26-sms-concierge.md`

Must define:

- Provider abstraction (no vendor lock in naming at architecture level).
- Message intents: first-time help, reorder, support triage, escalation.
- Human escalation rules for medical questions.
- Idempotency and safety for reorder commands.
- Consent, opt-in/opt-out, quiet hours, audit logging.

Acceptance:

- Users can reorder safely by text without duplicate orders.
- Medical questions route to humans, never automated medical advice.

---

## B2) Lifecycle Messaging

Create:

`27-lifecycle-messaging.md`

Must define:

- Event-driven campaigns: welcome, post-delivery care, pre-refill reminder, win-back.
- Channel routing: email vs SMS and fallback logic.
- Frequency caps and suppression rules.
- Content guardrails for medical claims.
- Attribution model for conversion impact.

Acceptance:

- Campaigns are event-based and suppress correctly.
- Users do not receive conflicting or duplicate journeys.

---

# API Work Last Rule

Any implementation that requires external messaging/automation APIs must start only after Phase A specs are approved.

This includes:

- SMS send/receive infrastructure
- Delivery status webhooks tied to messaging
- Automated lifecycle orchestration
- API-level retries, idempotency, and queue processing

---

# Recommended Next Documentation Order

1. `21-age-gate.md`
2. `22-education-video.md`
3. `23-clinic-wholesale.md`
4. `24-quiz-resume.md`
5. `25-seo-ai-optimization.md`
6. `26-sms-concierge.md` (API)
7. `27-lifecycle-messaging.md` (API)

---

# Done Criteria

This gap is considered resolved when:

- All seven missing topics have dedicated spec files.
- Phase A specs are approved before API engineering starts.
- API specs explicitly include safety, compliance, and human escalation.

