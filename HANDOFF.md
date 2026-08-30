# TrailMuse — Work Completed# Project Handoff Notes

Original project renamed to TrailMuse

## Status: builds successfully, in progress

Frontend (`npm run build`) and backend (all files syntax-checked) both work as of this
handoff. The UI redesign is **partially done** — see "Not finished yet" below.

---

## 1. Rename
- Wandovia → **TrailMuse** everywhere (header, `index.html` title, `package.json`).

## 2. Backend (added from scratch — original repo had none)
Location: `/backend`

- **Node.js + Express + MongoDB (Mongoose)**
- `models/User.js` — user accounts, passwords hashed with bcrypt
- `models/Trip.js` — trips, now scoped to a `user` field
- `middleware/auth.js` — JWT verification middleware (`requireAuth`)
- `routes/auth.js` — `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `routes/trips.js` — full CRUD (`GET/POST/PUT/DELETE /api/trips`), **all protected**, scoped per user
- `routes/ai.js` — `POST /api/ai/itinerary`, protected, calls Claude (Anthropic SDK) to generate a structured JSON itinerary
- `server.js` — wires it all together, CORS, Mongo connection
- `.env.example` — `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ANTHROPIC_API_KEY`, `PORT`, `CORS_ORIGIN`

**Backend is functionally complete.** To run: `cd backend && npm install && cp .env.example .env` (fill in values) `&& npm run dev`.

## 3. AI feature — "AI Trip Planner"
- New page at `/ai-planner`, linked in the sidebar
- Form: destination, country, days, interests, budget level, pace
- Calls the backend, which calls Claude, and displays a day-by-day itinerary
- "Save as Trip" button persists it to MongoDB and adds it to the existing Trip Planner
- Files: `src/components/AIPlanner/AITripPlanner.jsx` + `.css`

## 4. Authentication (frontend)
- `src/contexts/AuthContext.jsx` — login/register/logout, JWT stored in localStorage, auto-attaches token to every API call via an axios interceptor (`src/services/api.js`)
- `src/components/Auth/Login.jsx`, `Register.jsx`, `ProtectedRoute.jsx`, `Auth.css`
- `App.jsx` restructured: `/login` and `/register` are public; everything else requires auth
- Header now shows the logged-in user's name + a logout button

## 5. UI redesign — IN PROGRESS, not finished
Theme concept: **"Atlas & Compass"** — warm parchment/leather palette (brass gold,
sage green, wax-seal red) replacing the original generic blue/teal palette. Fraunces
(serif) for headings, Inter for body text, JetBrains Mono for stats/numbers.

**Done:**
- New color tokens + fonts wired into `App.css` (`:root` and `[data-theme="dark"]`)
- Google Fonts added in `index.html`
- 6 color-theme presets in `ThemeContext.jsx` recolored to match (Brass Compass, Sage Trail, Ink Voyage, Wax Seal, Harbor Blue, Golden Hour)
- Sidebar redesigned into a dark "compass rail" with a brass active-indicator (`Sidebar.css`)
- Header logo icon changed to a compass; dashed "route line" divider added under page titles as a recurring visual signature
- Fixed a pre-existing bug where dark mode cards stayed pure white (`--bg-primary` wasn't overridden for dark theme in the original code)

**Not done yet:**
- Individual page layouts (Dashboard, Trip Planner, Packing List, Budget, Weather, Photo Journal, Currency Converter, World Map) haven't had a structural redesign pass — they'll inherit the new colors/fonts automatically, but haven't been visually reviewed or refined one-by-one
- No screenshots have been taken/reviewed yet to sanity-check the new theme
- Mobile responsiveness of the redesigned sidebar hasn't been re-tested

---

## How to run everything
```bash
# Backend
cd backend
npm install
cp .env.example .env   # fill in MONGODB_URI, JWT_SECRET, ANTHROPIC_API_KEY
npm run dev             # http://localhost:5000

# Frontend (separate terminal)
cd ..
npm install
npm run dev              # http://localhost:5173
```
