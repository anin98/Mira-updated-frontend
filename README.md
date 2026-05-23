# Mira-updated-frontend — Merchant Dashboard

React 18 + Vite + antd. The merchant-facing dashboard: unified inbox across Messenger / Instagram / WhatsApp, order management, catalog editing, AI config, analytics. Talks to the Django REST API and subscribes to WebSocket notifications for live updates.

Runs on `:5173` in dev. Deployed to **Firebase Hosting** in production (not part of `./deploy.sh`).

## Prerequisites

- Node 18+
- Django service running on `:8000` (see [../mira_backend/README.md](../mira_backend/README.md))
- A Facebook App with Login-for-Business config IDs (only needed if you want to test the OAuth onboarding flow)

## Local setup

### 1. Install deps

```bash
cd Mira-updated-frontend
npm install
```

### 2. Create `.env.local`

```env
# Backend API base — adjust to match where you run Django
VITE_API_BASE_URL=http://localhost:8000

# Meta OAuth — only needed for testing IntegrationsView. Stub values are fine otherwise.
VITE_FACEBOOK_APP_ID=
VITE_FACEBOOK_CONFIG_ID=
VITE_FACEBOOK_CONFIG_ID_MESSENGER=
VITE_FACEBOOK_CONFIG_ID_INSTAGRAM=
VITE_FACEBOOK_CONFIG_ID_WHATSAPP=

# Web chat widget public key — fine to leave blank in dev
VITE_WIDGET_KEY=
```

> Check [src/api/](src/api/) to confirm which env var your build is reading for the backend URL — historically it has been `VITE_API_BASE_URL` but verify before changing.

### 3. Run dev server

```bash
npm run dev
```

Open http://localhost:5173. Log in with the superuser you created in the Django setup.

## Scripts

```bash
npm run dev       # vite dev server with HMR
npm run build     # production build → dist/
npm run preview   # serve the production build locally
npm run lint      # eslint
```

## Production deploy

The frontend is deployed to Firebase Hosting (config in [firebase.json](firebase.json)) — **separate from `./deploy.sh`** in the repo root.

```bash
npm run build
firebase deploy --only hosting
```

You need the Firebase CLI installed and authenticated against the right project.

## Notes

- Channel labels (Messenger / Instagram / WhatsApp / Web) are rendered in [src/pages/Dashboard/views/ConversationsView.jsx](src/pages/Dashboard/views/ConversationsView.jsx) via the `ChannelBadge` map.
- Authentication is JWT; tokens come from Django's `/api/v1/auth/` endpoints.
- WebSocket subscription URL is derived from the API base URL — make sure CORS + ASGI are working on the Django side before debugging real-time issues.
- The Meta OAuth Embedded Signup popup will not function without valid `VITE_FACEBOOK_*` config IDs from the Meta App Dashboard.
