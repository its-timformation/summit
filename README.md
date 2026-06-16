# Summit — Ski Fitness

A single-page, install-to-home-screen PWA for building ski fitness toward January. Everything
runs on-device (localStorage) — no login, no backend, no running costs.

## Files
- `index.html` — the whole app (React via CDN, glassmorphic UI)
- `exercises.js` — built-in exercise library (how-tos, equipment, rep/weight recommendations)
- `parser.js` — turns pasted AI workout text into a structured plan
- `manifest.json`, `sw.js`, `icon-*.png` — PWA bits

## What it does
- **Plans → phases → routines → exercises**, all editable.
- **Paste from AI**: drop in a ChatGPT plan and it builds the structure for you (then fix anything).
- Each exercise shows **recommended sets/reps/weight/duration + how to do it + equipment**, pulled
  from the library and/or the pasted text, with manual override.
- **Start workout** from the bulging centre button → pick a routine → log every set (with timers for
  holds) → save.
- **Progress**: per-plan and overall stats, a weekly bar chart, and a per-exercise trend line.
- **Settings**: export/restore a JSON backup (important — data lives only on this device).

## Deploy free on Cloudflare Pages (recommended — same as Lectio)

### Option A — GitHub auto-deploy (set up once, then `git push`)
1. Put this folder in a repo (e.g. `its-timformation/summit`) and push to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings: **Framework preset = None**, **Build command = (blank)**,
   **Build output directory = `/`** (root). Save & deploy.
4. Live at `https://summit.pages.dev`. Add a custom domain under the project's **Custom domains** tab
   (CNAME on Cloudflare DNS, like pints/Lectio). Every push now redeploys automatically.

### Option B — one-line CLI deploy (no Git needed)
```bash
npm i -g wrangler
wrangler login
./deploy.sh
```

That's it — open the `.pages.dev` URL on your phone and use the browser's **Share → Add to Home
Screen** to install it.
