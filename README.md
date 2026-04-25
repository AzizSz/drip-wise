# DripWise — V60 Pour Over Calculator

A smart V60 pour over coffee calculator with bean profiles, brew recipes, ratio guide, and a built-in brew timer. Built with Next.js 14 and Tailwind CSS.

## Live Demo

| Platform | URL |
|----------|-----|
| GitHub Pages | https://AzizSz.github.io/drip-wise/ |
| Vercel | https://drip-wise.vercel.app |

## Features

- **Two-way calculator** — enter water or coffee amount and the other is calculated instantly
- **Ratio selector** — presets from 1:10 to 1:17, plus a custom ratio slider
- **Hot / Iced toggle** — iced mode splits water into brew water + ice (60/40)
- **Bean profile panel** — pick a bean from the library or enter your own; unlocks smart recommendations
- **Smart recommendations** — suggested ratio, water temperature, grind size, and flavor tips per bean
- **Step-by-step recipe** — pour steps with volumes and timing
- **Brew timer** — guided timer that walks you through each pour step
- **Bean library** — 12 pre-loaded specialty beans (Ethiopia, Kenya, Panama Geisha, and more)
- **Ratio guide** — visual reference for how ratio affects strength and flavor
- **Settings** — save default ratio and preferences to local storage
- **PWA ready** — installable on mobile

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- [Next.js 14](https://nextjs.org) — App Router, static generation
- [Tailwind CSS v3](https://tailwindcss.com) — utility-first styling
- [Lucide React](https://lucide.dev) — icons
- [Radix UI](https://radix-ui.com) — accessible primitives (slider, switch, collapsible)
- Local Storage — preferences and saved beans, no backend needed

## Deployment

The app deploys to two platforms from the `master` branch:

- **GitHub Pages** — via GitHub Actions (`.github/workflows/deploy.yml`). Builds with `output: export` and `basePath: /drip-wise`.
- **Vercel** — standard Next.js deployment at root path, no basePath needed.

Both are handled automatically by `next.config.mjs` using the `GITHUB_ACTIONS` environment variable to toggle the static export flags.

---

Made by Abdulaziz-Saleh
