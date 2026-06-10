# RealEstateHub Frontend

This folder contains the Next.js App Router frontend for RealEstateHub.

## Setup

```bash
npm install
npm run dev
```

## Environment

Copy `frontend/.env.example` to your local `.env.local` file and fill in the backend URLs.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
BACKEND_API_URL=http://localhost:5000
```

Use the helpers in `frontend/lib/env.ts` for client-side values and `frontend/lib/server-env.ts` for server-side values.
