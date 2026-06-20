# 16-ai-search-experience.md

# TIDL AI Search & Recommendation Experience

## Purpose

The AI Search is not:

* customer support
* a chatbot
* a floating assistant
* an FAQ bot

The AI Search is the primary product discovery experience.

Users describe:

* goals
* symptoms
* concerns
* outcomes

The system helps them discover appropriate treatments.

Medical decisions remain with physicians.

---

# Core Principle

The AI helps users understand options.

The physician determines eligibility.

---

# User Examples

```text
"I want to lose 30 pounds."

"I'm struggling with energy."

"I've gained weight after pregnancy."

"I want to improve my metabolic health."

"I want to age better."
```

---

# Goals

1. Reduce friction.
2. Help discovery.
3. Educate.
4. Recommend pathways.
5. Move users toward assessment.

---

# The Experience Should Feel Like

* ChatGPT
* Perplexity
* Levels Health
* Apple Intelligence

Not:

* Intercom
* Drift
* Zendesk
* support chat

---

# Entry Points

The AI search should appear:

* Homepage hero
* Dedicated AI page
* Product pages
* Mobile navigation

---

# Homepage Example

Headline:

```text
Describe your health goal.
```

Input:

```text
What would you like help with?
```

Examples:

* Lose weight
* Improve energy
* Sleep better
* Healthy aging

---

# Dedicated Page

Route:

```text
/ai
```

Layout:

Desktop:

```text
-----------------------
| Sidebar | Chat Area |
-----------------------
```

Mobile:

Single-column experience.

---

# Welcome Screen

Display:

```text
What can we help you improve?

Examples:

• Weight loss
• Longevity
• Energy
• Recovery
• Metabolic health
```

---

# Suggested Prompts

Cards:

* I want to lose weight.
* I feel tired.
* I want more energy.
* I want to improve my health.
* I want to age better.

---

# Conversation Structure

## User Message

```text
I want to lose 25 pounds.
```

## AI Response

```text
Weight management may involve physician-supervised treatment options.

Several treatments may be appropriate depending on your medical history.
```

---

# Recommendation Cards

Display:

* treatment category
* outcome
* short explanation

Example:

```text
Weight Management

Physician-supervised GLP-1 care.

Learn More
```

---

# Recommendation Rules

AI may:

* educate
* explain
* guide

AI may not:

* diagnose
* prescribe
* guarantee

---

# Physician Escalation

If medical questions occur:

```text
A physician can review this question during your assessment.
```

---

# Trust Messaging

Persistent footer:

```text
Medical eligibility is determined by a licensed physician.
```

---

# AI Personality

Should feel:

* warm
* knowledgeable
* calm
* clinical

Not:

* funny
* casual
* robotic

---

# Tone Example

Good:

```text
Based on your goals, physician-guided treatment may be appropriate.
```

Bad:

```text
You definitely need this medication.
```

---

# Conversation UI

Messages:

* large bubbles
* generous spacing
* soft shadows

User:

right aligned.

Assistant:

left aligned.

---

# Typing Indicator

Subtle.

Examples:

* dots
* pulse

Avoid:

* exaggerated animations

---

# Suggested Follow-up Questions

Examples:

* How does the pen work?
* What happens after the assessment?
* How long does treatment take?

---

# Product Recommendations

Cards should include:

* image
* outcome
* short description
* CTA

CTA:

```text
Start Assessment
```

Not:

```text
Buy Now
```

---

# Empty State

```text
Describe your health goals to begin.
```

Large input.

Suggested prompts.

---

# Mobile Experience

Mobile first.

Requirements:

* large input
* sticky composer
* full-width messages

---

# AI Search Header

Display:

```text
AI Health Guide
```

Subtext:

```text
Educational information only.
Treatment decisions are made by physicians.
```

---

# Search History

Optional.

Examples:

* Previous conversations
* Recent topics

Future phase.

---

# AI Search Sidebar

Desktop:

* recent topics
* recommended categories
* saved conversations

---

# Educational Content

AI may explain:

* GLP-1
* metabolism
* physician review
* dosing

---

# Escalation Rules

Medical questions:

Doctor.

Emergencies:

Immediate physician guidance.

---

# Forbidden Responses

Never:

* diagnose
* prescribe
* guarantee outcomes
* discuss emergencies
* provide medical advice

---

# Example Response

```text
Weight management treatments may be appropriate depending on your medical history and physician evaluation.

A short assessment can help determine eligibility.
```

CTA:

```text
Start Assessment
```

---

# Animations

Messages:

* fade up
* slight slide

Cards:

* scale
* blur reveal

Duration:

300–500ms.

---

# GSAP Usage

Use:

* staggered message appearance
* recommendation card reveal

Avoid:

* dramatic motion
* large parallax

---

# Accessibility

Keyboard navigation.

Screen readers.

High contrast.

Large touch targets.

---

# Analytics

Track:

* conversation started
* recommendation shown
* assessment started
* drop-off

---

# Design References

Experience should feel similar to:

* ChatGPT
* Perplexity
* Apple Intelligence

Not:

* customer support chat
* live chat widgets

---

# Future Features

Phase 2:

* persistent history
* personalized recommendations
* refill assistance
* treatment reminders

---

# Success Metric

The user should think:

> "TIDL understands my goals and is guiding me toward the right treatment."

The AI should feel like a knowledgeable health guide.

The physician remains the medical authority.
