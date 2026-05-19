
# Instamart Health Rater — Demo & Scoring Module

Lightweight client-side demo and reusable scoring module that computes a 0–100 health score and A–E grade for grocery products. Designed for quick integration into product cards on Instamart.

Quick start (dev):

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Run tests:

```bash
npm test
```

What’s included:
- `src/scoring.js` — scoring function `scoreProduct(nutrients, ingredients)`
- `src/components/GradeChip.jsx` — small UI chip component
- `src/App.jsx`, `src/main.jsx` — demo app wiring
- `src/mock/products.json` — sample products used in demo
- `test/scoring.test.js` — basic node-based tests

Notes:
- The module expects nutrition values per 100g (or converted per 100g) for: `protein`, `fiber`, `sugar`, `saturatedFat`, `sodium`, `calories`.
- After Builders Club approval you can map Instamart product fields to these inputs and compute scores client-side.

Next steps in this repo:
- `SUBMISSION.md` — Builders Club submission draft (ready to copy/paste)
- `DEMO_SCRIPT.md` — 60–90s demo walkthrough script
- `DEPLOY.md` — simple deploy instructions for Netlify/GitHub Pages

Repository: https://github.com/DotaP27/swiggy-health-rating-system

