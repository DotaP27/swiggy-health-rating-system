# Builders Club Submission — Instamart Health Rater

Proposal Title: Instamart Health Rater — Nutrition-grade chips for product cards

Overview
- Problem: Customers find nutrition labels confusing when shopping quickly on Instamart.
- Solution: A client-side score (0–100) and grade (A–E) displayed as a small chip on product cards, computed from nutrition facts and ingredient cues.

Demo & Repo
- GitHub: (replace with your repo URL)
- Live demo: (replace with deployed demo URL)

Technical summary
- Client-side TypeScript/JavaScript scoring module (`src/scoring.js`) that normalizes nutrient inputs, applies weights, and adjusts by ingredient keywords.
- Demo built with React + Vite showing `GradeChip` on product cards.
- No backend required; runs in-browser. If API keys must be kept secret, a minimal serverless proxy can be used.

What I need from Swiggy
- Builders Club API access and sample product schema or sandbox endpoint.
- Test API key or scoped token for client-side fetches.
- (Optional) A short technical contact for field mapping edge-cases.

Privacy & Security
- Scores computed client-side; no user-identifying data collected.
- If server-side proxy is used, it will only proxy product read requests and not store personal data.

Success criteria for a pilot
- Pilot on a curated category (e.g., breakfast cereals): show chips on product listings for 100% of the category.
- Engagement: at least 10% CTR on chips to reveal nutrition breakdown.
- Agreement: manual spot-check grade agreement ≥85% vs. nutritionist on 100 items.

Deliverables
- Working codebase, README, tests, demo, deployment instructions, 60–90s walkthrough script.

Contact
- GitHub: (your handle) — include link
- Email / LinkedIn: (your contact)
