# Packadive

> **Never forget your dive gear again.**  
> Packadive helps you organize, track, and manage all your diving equipment—and everything you need for the trip—with **smart checklists** built for your next dive trip.

**Live App (Vercel):** <https://www.packadive.com/>
**Live API:** <https://api.packadive.com>
**Backend Repo:** <https://github.com/Joefb/packadive-backend>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Local Development](#local-development)
- [End-to-End Run (Frontend + Backend)](#end-to-end-run-frontend--backend)
- [Configuration Notes](#configuration-notes)
- [Dive Conditions Data Sources](#dive-conditions-data-sources)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Dive trips are gear-heavy! Before the trip all gear must be checked to
ensure it's ready for the dive. Checking and packing can be stressful, especially if you have a lot of gear or are new to diving.
It’s easy to forget something important, which can lead to a frustrating day at the dive site—or worse, a missed dive.
On top of that there are all of your regular items that need to be packed for the trip like clothes, toiletries, etc.
Camping at the dive site and forget to pack your sleeping bag? Ugh... not again!
**Packadive** to the rescue!

**Packadive** is a checklist-driven packing companion that helps divers:

- create item-specific checklists,
- track packing progress in real time,
- and check conditions before heading out—on a UI designed to work great on mobile.

---

## Key Features

### Smart Checklist Management

- Create **unlimited checklists** for different item lists like Scuba, Camping, Need.
- Add, edit, and manage items as your kit evolves

### Real-time Progress Tracking

- **Visual progress** for what’s packed vs. what’s still needed
- Designed to be fast while you’re actively packing on mobile

### Dive Conditions & Weather Checker

- Real-time conditions + **7-day forecast**
- Helps plan last-minute changes (exposure suit, backups, etc.)

### Mobile-Friendly Design

- Built for phone/tablet use
- Perfect for packing on-the-go

---

## Tech Stack

### Frontend

- **Framework:** React
- **Tooling:** Vite
- **Styling/UI:** Tailwind CSS + Material UI / Material Tailwind components
- **State management:** React state + **2 Context providers** + hooks
  - `AuthProvider` (auth/session)
  - `ListProvider` (checklists/items)

### Backend

- Flask (Python), JWT auth, PostgreSQL (prod) / SQLite (dev)  
  Repo: <https://github.com/Joefb/packadive-backend>

### Hosting

- **Frontend:** Vercel
- **Backend:** Self-hosted — Flask API and PostgreSQL each run in their own Podman container (Postgres in a rootless container) on a private network on a self-hosted server. Public access is exposed via a Cloudflare Tunnel, so no inbound ports are opened on the host.

---

## Architecture

```text
React (Vercel or localhost)
   |
   | HTTPS/HTTP (JSON)
   v
Cloudflare Tunnel (prod only — no inbound ports on host)
   |
   v
Flask REST API — Podman container (self-hosted) or localhost
   |
   v
PostgreSQL — separate rootless Podman container, private network (prod) / SQLite (dev)
```

---

## Local Development

### Prerequisites

- Node.js (LTS recommended)
- Backend running (either the deployed self-hosted API or locally)

### Setup

```bash
git clone https://github.com/Joefb/packadive.git
cd packadive
npm install
npm run dev
```

Open:

- <http://localhost:5173>

---

## End-to-End Run (Frontend + Backend)

This project uses **two repos**:

- Frontend: <https://github.com/Joefb/packadive>
- Backend: <https://github.com/Joefb/packadive-backend>

### Option A — Use the deployed backend (fastest)

Backend is already deployed (self-hosted, behind a Cloudflare Tunnel):

- **API:** <https://api.packadive.com>

1) Run frontend locally:

```bash
git clone https://github.com/Joefb/packadive.git
cd packadive
npm install
npm run dev
```

1) Open:

- <http://localhost:5173>

1) Use the app:

- Sign up / log in
- Create a checklist
- Add items
- Toggle item statuses to update progress
- Open **Dive Conditions** to fetch weather/forecast data

> If the frontend is set to call a local API by default, update the API base URL inside the frontend Context(s) to use the deployed API URL.

### Option B — Run everything locally (recommended for development)

1) Start the backend locally (see backend repo README):

- Start API at `http://127.0.0.1:5000`

1) Start the frontend:

```bash
npm run dev
```

1) Confirm flow:

- Sign up / log in → create checklist → add items → toggle status → check Dive Conditions

---

## Configuration Notes

This frontend’s API calls are implemented inside the React Context layer (not via a required Vercel `.env`).

If you want to swap between local and deployed APIs, update the API base URL in the Context files to one of:

- Local: `http://127.0.0.1:5000`
- Production: `https://api.packadive.com`

---

## Dive Conditions Data Sources

The Dive Conditions feature uses:

- **Open‑Meteo** weather forecast API (no key required)
- A curated list of **NOAA station coordinates** for major diving locations (used in UI logic)

---

## Roadmap

- [ ] Checklist templates (Shore Dive / Boat Dive / Cold Water / Camera Rig)
- [ ] Sharing / buddy mode for group trips
- [ ] Offline-first packing mode (low/no signal)
- [ ] Export lists (PDF/print)

---

## License

MIT License © 2026 Joe Burgess
