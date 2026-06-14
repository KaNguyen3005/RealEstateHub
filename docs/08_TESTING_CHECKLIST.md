# RealEstateHub Phase 12 Testing Checklist

## 1. Purpose

This document tracks Phase 12 testing for RealEstateHub. It follows `docs/04_IMPLEMENTATION_PLAN.md` and focuses on validating the core backend APIs, frontend flows, realtime chat, upload, map, and admin moderation before deployment.

## 2. Test Environment

| Area | Value |
|---|---|
| Backend URL | `http://localhost:5000` |
| Frontend URL | `http://localhost:3000` |
| Postman environment | `postman/RealEstateHub-Local.postman_environment.json` |
| Phase 12 Postman collection | `postman/RealEstateHub-Phase12-Testing.postman_collection.json` |
| Seed command | `cd backend && npm run seed` |
| Backend dev command | `cd backend && npm run dev` |
| Frontend dev command | `cd frontend && npm run dev` |
| Frontend unit test command | `cd frontend && npm test` |
| Frontend E2E command | `cd frontend && npm run e2e` |

## 3. Seed Accounts

| Role | Email | Password | Source |
|---|---|---|---|
| Admin | `admin@realestatehub.local` | `Admin@123` | `backend/src/seed/seedAdmin.js` |
| Seller | `seller1@realestatehub.local` | `Seller@123` | `backend/src/seed/seedDemoData.js` |
| Buyer/User | `user1@realestatehub.local` | `User@123` | `backend/src/seed/seedDemoData.js` |

If `.env` overrides `ADMIN_SEED_EMAIL` or `ADMIN_SEED_PASSWORD`, use the values from the local environment instead.

## 4. Pre-Test Checklist

| ID | Check | Command / Action | Status | Notes |
|---|---|---|---|---|
| P12-PRE-01 | Install dependencies | `cd backend && npm install`, `cd frontend && npm install` | Not tested | Run only if dependencies are missing. |
| P12-PRE-02 | Seed demo data | `cd backend && npm run seed` | Not tested | Creates admin, sellers, users, approved and pending properties. |
| P12-PRE-03 | Start backend | `cd backend && npm run dev` | Not tested | Backend should listen on `http://localhost:5000`. |
| P12-PRE-04 | Start frontend | `cd frontend && npm run dev` | Not tested | Frontend should listen on `http://localhost:3000`. |
| P12-PRE-05 | Import Postman files | Import local environment and Phase 12 collection | Not tested | Select `RealEstateHub Local`. |
| P12-PRE-06 | Install Playwright browser | `cd frontend && npx playwright install chromium` | Not tested | Required once before running frontend E2E locally or in CI. |

## 5. Backend API Test Cases

Status values: `Pass`, `Fail`, `Blocked`, `Not tested`.

| ID | Test Case | Method / Endpoint | Expected Result | Automation | Status | Notes |
|---|---|---|---|---|---|---|
| T-01 | Register with valid data | `POST /api/auth/register` | `201 Created`, user created, access token returned | Postman | Not tested | Collection generates a unique email. |
| T-02 | Register with duplicate email | `POST /api/auth/register` | `409 Conflict` | Postman | Not tested | Uses the same generated email from T-01. |
| T-03 | Login with correct password | `POST /api/auth/login` | `200 OK`, access token returned | Postman | Not tested | Uses seeded buyer account. |
| T-04 | Login with blocked user | `POST /api/auth/login` | `401 Unauthorized` | Postman | Not tested | Collection blocks the generated test user via admin API first. |
| T-05 | Refresh token with valid cookie | `POST /api/auth/refresh` | `200 OK`, new access token returned | Postman | Not tested | Postman cookies must be enabled. |
| T-06 | Get current user with valid token | `GET /api/auth/me` | `200 OK`, user info returned | Postman | Not tested | Uses buyer token. |
| T-07 | Create property as seller | `POST /api/properties` | `201 Created`, status is `pending` | Postman | Not tested | Saves created pending property id. |
| T-08 | Create property as user | `POST /api/properties` | `403 Forbidden` | Postman | Not tested | Uses seeded buyer token. |
| T-09 | Create property with price `0` | `POST /api/properties` | `400 Bad Request` | Postman | Not tested | Uses seller token. |
| T-10 | Create property without image | `POST /api/properties` | `400 Bad Request` | Postman | Not tested | Uses seller token. |
| T-11 | Search approved properties | `GET /api/properties` | Only approved properties returned | Postman | Not tested | Collection saves first approved property id. |
| T-12 | Add duplicate favorite | `POST /api/favorites/:propertyId` twice | Second request returns `409 Conflict` | Postman | Not tested | Cleanup request removes existing favorite first. |
| T-13 | Create conversation with `propertyId` | `POST /api/conversations` | Seller is derived from `property.ownerId` | Postman | Not tested | Uses buyer token and approved property id. |
| T-14 | Socket connection without token | Socket.io client handshake | Connection rejected | Manual | Not tested | Use browser dev tools or a Socket.io client script. |
| T-15 | Upload invalid file type | `POST /api/uploads/properties` | `400 Bad Request` | Manual / Postman file attach | Not tested | Attach a `.txt` file to `images`; Cloudinary is not required because Multer rejects first. |
| T-16 | Approve property as admin | `PATCH /api/admin/properties/:id/approve` | Status becomes `approved` | Postman | Not tested | Uses property created in T-07. |

## 6. Frontend Manual Test Checklist

| ID | Flow | Steps | Expected Result | Status | Notes |
|---|---|---|---|---|---|
| FE-01 | Home page loads | Open `http://localhost:3000/` | Homepage renders hero, search, featured section, and CTA links | Not tested | Test desktop and mobile widths. |
| FE-02 | Property listing loads | Open `/properties` | Approved listings load or empty state is shown | Not tested | Backend must be running. |
| FE-03 | Search/filter works | Submit filters from homepage or listing page | URL query updates and results match filters | Not tested | Check city/type/purpose filters. |
| FE-04 | Property detail loads | Open a property card | Detail page renders gallery, info, contact, map, and chat CTA | Not tested | Use approved property. |
| FE-05 | Register validation works | Submit invalid register form | Validation errors are visible | Not tested | Also test valid registration. |
| FE-06 | Login validation works | Submit invalid login form | Validation errors are visible | Not tested | Also test seeded buyer/seller/admin. |
| FE-07 | Reload auth flow works | Login, refresh browser, open protected page | Session remains available or refreshes correctly | Not tested | Check auth bootstrap state. |
| FE-08 | Seller creates property | Login seller, open `/dashboard/properties/new` | Property is created with `pending` status | Not tested | Use map/geocoding flow if available. |
| FE-09 | Image upload preview works | Add images in property form | Preview appears before submit | Not tested | Requires Cloudinary config for upload submit. |
| FE-10 | Map displays marker | Open property detail or property form map | Marker appears at selected/saved location | Not tested | Listing page map was intentionally removed. |
| FE-11 | Compare page works | Add 2-3 properties to compare | Compare table shows selected properties | Not tested | Test add/remove behavior. |
| FE-12 | Favorite button works | Login buyer, favorite/unfavorite a property | Favorite state updates and persists | Not tested | Requires buyer token/session. |
| FE-13 | Contact request form works | Submit contact request on detail page | Success or validation message is shown | Not tested | Test guest and logged-in user if time allows. |
| FE-14 | Chat works realtime | Login two users in separate browsers | Sent messages appear without manual refresh | Not tested | Requires approved property and conversation. |
| FE-15 | Admin approves property | Login admin, open `/admin/properties` | Pending property can be approved and removed from pending table | Not tested | Use seller-created pending property. |

## 7. Verification Commands

```powershell
cd backend
npm run dev
```

```powershell
cd frontend
npm test
npm run lint
npm run build
npm run e2e
```

## 8. Automated Test Coverage Added

Backend automated tests:

```powershell
cd backend
npm test
```

Current coverage focus:

- Health endpoint smoke test.
- Auth service: register, duplicate email, login, blocked user, refresh session, hidden sensitive fields.
- Property service: validation, public approved listing, ownership checks, compare limit, seller edit lifecycle.
- Favorite, contact request, admin, and chat business rules.

Frontend automated tests:

```powershell
cd frontend
npm test
```

Current coverage focus:

- Zod validation schemas for auth, property, and contact request forms.
- Zustand stores for auth, compare, and favorite state.
- API client JSON requests, auth headers, and error handling.

Frontend E2E smoke tests:

```powershell
cd frontend
npx playwright install chromium
npm run e2e
```

The E2E runner starts a local mock API and a Next.js dev server automatically. It verifies:

- Guest property discovery: homepage, listing, filtering, detail page, and contact request submission.
- Compare page loading selected properties from persisted compare state.
- Login form success state with a mocked backend auth response.

## 9. Known Notes

- Frontend lint/build may show existing `@next/next/no-img-element` warnings for components that still use `<img>`. These warnings do not fail the build.
- Socket.io realtime behavior and invalid file upload still require manual verification or a later dedicated E2E/API test.
- The Phase 12 Postman collection intentionally creates a new test user and a new pending property so repeated runs do not depend on fragile existing records.
- `npm run e2e` uses mocked API data and does not replace the Postman collection for backend integration checks.
