# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Packadive is the React frontend for a dive-trip packing checklist app. It talks to a separate Flask backend repo (`packadive-backend`, not in this repo) over a JSON REST API. Live app: https://www.packadive.com — Live API: https://api.packadive.com.

## Commands

```bash
npm install      # install deps
npm run dev      # start Vite dev server at http://localhost:5173
npm run build    # production build
npm run preview  # preview the production build locally
```

There is no test suite, lint script, or CI config in this repo currently.

### Running against a local backend

The frontend requires the Flask backend (`packadive-backend`) to be running, either locally at `http://127.0.0.1:5000` or the deployed API. The API base URL is a single hardcoded constant in `src/config.js` (`API_BASE_URL`) — there is no `.env` mechanism for this. To point the frontend at a different backend, edit that constant directly.

## Architecture

**Data flow:** React (Vite/Vercel) → Cloudflare Tunnel → Flask REST API (self-hosted, Podman container) → PostgreSQL (separate rootless Podman container, prod) / SQLite (dev). The backend runs on a private network with no inbound ports opened on the host; the Cloudflare Tunnel is the only path in from the public internet. All backend communication happens via `fetch` calls placed directly inside the two context providers — there is no separate API client/service layer.

**State management is two React Contexts, both provided in `main.jsx`:**

- `AuthContext` (`src/contexts/AuthContext.jsx`) — owns `auth_token` and `user`, persisted to `localStorage` (`auth_token`, `user` keys). Exposes `login`, `logout`, `registerUser`, `updateUser`, `deleteUser`, and `isAuthenticated`. JWT is sent as `Authorization: Bearer <auth_token>` on authenticated requests.
- `ListContext` (`src/contexts/ListContext.jsx`) — owns checklist/item data (`listData`), reads `auth_token` from `useAuth()` internally. Persists `listData` to `localStorage` (`list_data` key) as a client-side cache, and refetches from the API (`getList`) after most mutations rather than trusting optimistic local updates. Derives `stats` and `totalProgress` (percent packed) via `useMemo` over `listData`. Checklist endpoints live under `/checklists`, item endpoints under `/list_item`.

Provider nesting order in `main.jsx` matters: `AuthProvider` wraps `ListProvider` because `ListContext` consumes `useAuth()`.

**Routing** (`src/App.jsx`, React Router v7): `/`, `/register`, `/login` are public. `/profile`, `/userhome`, `/diveconditions` are wrapped in `ProtectedRoute` (`src/components/ProtectedRoute.jsx`), which redirects to `/` when `isAuthenticated` is false. All routes render inside the shared `Layout` component.

**Dive Conditions** (`src/pages/DiveConditions.jsx`) is a large, mostly self-contained page that geocodes a city/state, then fetches weather/marine forecast data from Open-Meteo (no API key) and matches against a curated list of NOAA station coordinates for major dive locations — this logic lives inline in the page rather than in a context.

**UI stack:** Tailwind CSS + Material Tailwind (`@material-tailwind/react`, initialized via `withMT` in `tailwind.config.js`) for components/theming, `@formkit/auto-animate` for list animations. `ThemeProvider` from Material Tailwind wraps `App` in `main.jsx`.

**Deployment:** Vercel, with `vercel.json` doing an SPA rewrite (all paths → `index.html`) since routing is client-side only.
