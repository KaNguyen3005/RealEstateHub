# TASK_BREAKDOWN.md  
## Project: RealEstateHub – Mini Real Estate Marketplace

---

## 1. Purpose

This document breaks down the RealEstateHub project into clear development tasks for team collaboration, Trello/GitHub Project tracking, sprint planning, coding, testing, deployment, and final defense preparation.

This task breakdown is based on:

```text
- SRS: Software Requirements Specification
- HLD: High-Level Design
- Revised LLD: Low-Level Design
- IMPLEMENTATION_PLAN.md
- UI_UX_GUIDE.md
```

---

## 2. Project Scope Summary

RealEstateHub is a mini real estate marketplace with the following core features:

```text
- User register/login
- JWT authentication with refresh token
- Role-based authorization: Guest, User, Seller, Admin
- Property CRUD
- Property search/filter/pagination
- Property detail page
- Property comparison
- Favorite properties
- Contact request using Next.js Server Action
- Realtime chat using Socket.io
- Property image upload using Multer + Cloudinary
- Map integration using React Leaflet
- Admin dashboard
- Deployment to Vercel, Render/Railway, MongoDB Atlas
```

---

## 3. Recommended Trello Columns

```text
Backlog
To-do
Doing
Review
Done
Blocked
```

---

## 4. Recommended Labels

```text
Frontend
Backend
Database
Auth
Property
Upload
Map
Chat
Admin
Testing
Deployment
Documentation
Bug
High Priority
```

---

## 5. Team Role Assignment

For a team of 4 members:

| Member | Role | Main Responsibility |
|---|---|---|
| Member 1 | Backend Lead | Backend setup, Auth, User, Property APIs |
| Member 2 | Frontend Lead | UI layout, pages, forms, frontend integration |
| Member 3 | Advanced Feature Lead | Upload, Map, Socket.io chat |
| Member 4 | DevOps + QA + Documentation | Deployment, testing, README, report, slide |

If your team has 3 members, combine **Advanced Feature Lead** and **DevOps + QA + Documentation**.

If your team has 5 members, separate **QA/Testing** and **Documentation/Slide**.

---

# 6. Sprint 0 — Kick-off and Project Setup

## Goal

Prepare repository, project structure, task board, documentation skeleton, and environment files.

## Duration

```text
0.5 - 1 day
```

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T0-01 | Create GitHub repository | Create public GitHub repository for the project | DevOps | High | Documentation | To-do |
| T0-02 | Create branches | Create `main`, `dev`, and initial feature branches | DevOps | High | Documentation | To-do |
| T0-03 | Create monorepo structure | Create `frontend/`, `backend/`, `docs/` folders | DevOps | High | Documentation | To-do |
| T0-04 | Add `.gitignore` | Add ignore rules for Node.js, env files, build output | DevOps | High | Documentation | To-do |
| T0-05 | Add README skeleton | Add project introduction, tech stack, setup placeholder | DevOps | Medium | Documentation | To-do |
| T0-06 | Add frontend `.env.example` | Add public frontend env variables | Frontend | High | Frontend | To-do |
| T0-07 | Add backend `.env.example` | Add backend env variables without real secrets | Backend | High | Backend | To-do |
| T0-08 | Create Trello/GitHub Project board | Add columns and labels | Leader | Medium | Documentation | To-do |
| T0-09 | Add docs folder | Add SRS, HLD, LLD, Implementation Plan, UI/UX Guide | DevOps | Medium | Documentation | To-do |

## Acceptance Criteria

```text
- Repository is public.
- main and dev branches exist.
- Folder structure is ready.
- README skeleton exists.
- .env.example files exist.
- No real secrets are committed.
- Task board is ready.
```

---

# 7. Sprint 1 — Backend Foundation

## Goal

Build the backend base architecture, database connection, common utilities, and health check endpoint.

## Duration

```text
1 - 2 days
```

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T1-01 | Initialize backend project | Setup Node.js + Express.js project | Backend | High | Backend | To-do |
| T1-02 | Install backend dependencies | Install express, mongoose, cors, dotenv, cookie-parser | Backend | High | Backend | To-do |
| T1-03 | Create backend folder structure | Create config, models, routes, controllers, services, middlewares, utils | Backend | High | Backend | To-do |
| T1-04 | Configure MongoDB connection | Create `config/db.js` and connect to MongoDB Atlas | Backend | High | Database | To-do |
| T1-05 | Configure CORS | Allow frontend URL and credentials | Backend | High | Backend | To-do |
| T1-06 | Configure JSON and cookie parser | Add express.json and cookie-parser | Backend | High | Backend | To-do |
| T1-07 | Create API response utility | Create standard success/error response helper | Backend | Medium | Backend | To-do |
| T1-08 | Create asyncHandler utility | Handle async controller errors | Backend | Medium | Backend | To-do |
| T1-09 | Create error middleware | Return standard error JSON response | Backend | High | Backend | To-do |
| T1-10 | Create health route | Implement `GET /api/health` | Backend | High | Backend | To-do |
| T1-11 | Test backend startup | Run backend locally and test health endpoint | QA | High | Testing | To-do |

## Acceptance Criteria

```text
- Backend runs locally.
- MongoDB connects successfully.
- GET /api/health returns success.
- Error response format is consistent.
- Backend folder structure follows LLD.
```

---

# 8. Sprint 1 — Database Models and Seed Data

## Goal

Implement all main Mongoose schemas and seed data for demo.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T2-01 | Create User model | Implement User schema with roles and status | Backend | High | Database | To-do |
| T2-02 | Create Property model | Implement Property schema with validation and indexes | Backend | High | Database | To-do |
| T2-03 | Create Favorite model | Implement unique userId + propertyId favorite schema | Backend | Medium | Database | To-do |
| T2-04 | Create ContactRequest model | Implement contact request schema | Backend | Medium | Database | To-do |
| T2-05 | Create Conversation model | Implement conversation schema with participants | Advanced | Medium | Database, Chat | To-do |
| T2-06 | Create Message model | Implement message schema with conversation index | Advanced | Medium | Database, Chat | To-do |
| T2-07 | Add database indexes | Add indexes for search, filter, favorite, message | Backend | High | Database | To-do |
| T2-08 | Create seed admin | Create default admin account | DevOps | High | Database | To-do |
| T2-09 | Create seed sellers/users | Add sample seller and user accounts | DevOps | Medium | Database | To-do |
| T2-10 | Create seed properties | Add approved and pending sample properties | DevOps | High | Database | To-do |
| T2-11 | Test seed script | Run seed script and verify database records | QA | Medium | Testing | To-do |
| T2-12 | Add sold/rented status | Update Property model for closed lifecycle states | Backend | High | Database | To-do |

## Important Rules

```text
- User email must be unique.
- Password must be hashed.
- Property price must be greater than 0.
- Property area must be greater than 0.
- Property images must contain 1 to 10 URLs.
- Favorite must be unique by userId + propertyId.
- Property status must support sold and rented as closed states.
```

## Acceptance Criteria

```text
- All schemas are created.
- Indexes are added.
- Seed script creates admin, sellers, users, and properties.
- Seed data supports listing, search, filter, map, compare, and admin approval demo.
```

---

# 9. Sprint 1 — Authentication and Authorization

## Goal

Implement register, login, refresh token, logout, current user, and authorization middleware.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T3-01 | Install auth dependencies | Install bcrypt/jsonwebtoken if not installed | Backend | High | Auth | To-do |
| T3-02 | Create token utility | Create access token and refresh token generator | Backend | High | Auth | To-do |
| T3-03 | Implement register service | Validate unique email and hash password | Backend | High | Auth | To-do |
| T3-04 | Implement login service | Check password and issue tokens | Backend | High | Auth | To-do |
| T3-05 | Implement refresh token service | Read refresh cookie and issue new access token | Backend | High | Auth | To-do |
| T3-06 | Implement logout service | Clear refresh cookie and remove stored token | Backend | Medium | Auth | To-do |
| T3-07 | Implement current user service | Return current user without passwordHash/refreshToken | Backend | High | Auth | To-do |
| T3-08 | Create auth controller | Implement register, login, refresh, logout, me controllers | Backend | High | Auth | To-do |
| T3-09 | Create auth routes | Add `/api/auth/*` routes | Backend | High | Auth | To-do |
| T3-10 | Create protect middleware | Verify access token and attach user | Backend | High | Auth | To-do |
| T3-11 | Create optionalAuth middleware | Attach user if token exists, allow guest otherwise | Backend | Medium | Auth | To-do |
| T3-12 | Create allowRoles middleware | Restrict admin/seller routes | Backend | High | Auth | To-do |
| T3-13 | Test auth APIs in Postman | Test register/login/refresh/logout/me | QA | High | Testing | To-do |

## APIs

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

## Acceptance Criteria

```text
- Guest can register as user or seller.
- Guest cannot register as admin.
- User can login.
- Access token is returned after login.
- Refresh token is stored in HttpOnly cookie.
- Refresh endpoint returns new access token.
- Logout clears refresh token.
- GET /api/auth/me returns current user.
- Blocked users cannot login or refresh token.
```

---

# 10. Sprint 1 — Property Backend Module

## Goal

Implement property CRUD, search, filter, pagination, compare, and ownership rules.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T4-01 | Create property routes | Define property endpoints | Backend | High | Property | To-do |
| T4-02 | Create property controller | Add controller functions | Backend | High | Property | To-do |
| T4-03 | Create property service | Add service logic | Backend | High | Property | To-do |
| T4-04 | Implement create property | Seller/Admin creates property with pending status | Backend | High | Property | To-do |
| T4-05 | Implement update property | Seller updates own property, admin updates any | Backend | High | Property | To-do |
| T4-06 | Implement delete property | Seller deletes own property, admin deletes any | Backend | High | Property | To-do |
| T4-07 | Implement get properties | Return approved properties with pagination | Backend | High | Property | To-do |
| T4-08 | Implement property detail | Return property detail with access rules | Backend | High | Property | To-do |
| T4-09 | Implement search/filter | Filter by keyword, city, district, type, purpose, price, area | Backend | High | Property | To-do |
| T4-10 | Implement compare API | Return max 3 approved properties by IDs | Backend | Medium | Property | To-do |
| T4-11 | Add ownership helper | Check if seller owns property | Backend | High | Property | To-do |
| T4-12 | Test property APIs | Test all property endpoints in Postman | QA | High | Testing | To-do |

## APIs

```text
GET    /api/properties
GET    /api/properties/compare?ids=id1,id2,id3
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
PATCH  /api/properties/:id/status
```

## Important Route Rule

```text
Define /api/properties/compare before /api/properties/:id.
Otherwise Express may treat "compare" as an id.
```

## Acceptance Criteria

```text
- Seller can create property.
- New property has pending status.
- Public user only sees approved properties.
- Search/filter works.
- Compare returns maximum 3 properties.
- Seller cannot update/delete another seller's property.
```

---

# 11. Sprint 2 — Frontend Foundation

## Goal

Create frontend project, layout, routing, API client, global stores, and common components.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T5-01 | Initialize Next.js project | Setup Next.js App Router with TypeScript | Frontend | High | Frontend | To-do |
| T5-02 | Configure Tailwind CSS | Setup Tailwind and global styles | Frontend | High | Frontend | To-do |
| T5-03 | Configure shadcn/ui | Install and setup UI components | Frontend | Medium | Frontend | To-do |
| T5-04 | Create public layout | Add Navbar, Footer, main container | Frontend | High | Frontend | To-do |
| T5-05 | Create dashboard layout | Add seller dashboard sidebar/topbar | Frontend | Medium | Frontend | To-do |
| T5-06 | Create admin layout | Add admin sidebar/topbar | Frontend | Medium | Frontend | To-do |
| T5-07 | Create API client helper | Add fetch wrapper with auth token support | Frontend | High | Frontend | To-do |
| T5-08 | Create authStore | Store user and access token | Frontend | High | Auth, Frontend | To-do |
| T5-09 | Create compareStore | Store propertyIds only | Frontend | Medium | Frontend | To-do |
| T5-10 | Create favoriteStore | Store favorite property IDs | Frontend | Medium | Frontend | To-do |
| T5-11 | Create common components | Button wrappers, loading, empty state, confirm dialog | Frontend | Medium | Frontend | To-do |
| T5-12 | Create base routes | Create required routes and placeholder pages | Frontend | High | Frontend | To-do |

## Required Routes

```text
/
 /properties
 /properties/[id]
 /compare
 /login
 /register
 /profile
 /favorites
 /chat
 /dashboard
 /dashboard/properties
 /dashboard/properties/new
 /dashboard/properties/[id]/edit
 /admin
 /admin/users
 /admin/properties
 /admin/contact-requests
```

## Acceptance Criteria

```text
- Frontend runs locally.
- Tailwind works.
- Navbar and Footer appear.
- At least 5 routes exist.
- Dynamic route /properties/[id] exists.
- Dashboard/admin nested layouts exist.
```

---

# 12. Sprint 2 — Frontend Auth Pages

## Goal

Implement login/register UI, validation, API integration, reload auth flow, and protected routes.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T6-01 | Create register schema | Add Zod register schema | Frontend | High | Auth, Frontend | To-do |
| T6-02 | Create login schema | Add Zod login schema | Frontend | High | Auth, Frontend | To-do |
| T6-03 | Create RegisterForm | Build UI with React Hook Form + Zod | Frontend | High | Auth, Frontend | To-do |
| T6-04 | Create LoginForm | Build UI with React Hook Form + Zod | Frontend | High | Auth, Frontend | To-do |
| T6-05 | Connect register API | Submit register form to backend | Frontend | High | Auth, Frontend | To-do |
| T6-06 | Connect login API | Submit login form to backend | Frontend | High | Auth, Frontend | To-do |
| T6-07 | Save access token | Store access token in authStore | Frontend | High | Auth, Frontend | To-do |
| T6-08 | Implement refresh after reload | Call refresh then me on app load | Frontend | High | Auth, Frontend | To-do |
| T6-09 | Implement logout | Call logout API and clear authStore | Frontend | Medium | Auth, Frontend | To-do |
| T6-10 | Create ProtectedRoute | Protect authenticated pages | Frontend | Medium | Auth, Frontend | To-do |
| T6-11 | Create RoleGuard | Protect seller/admin pages | Frontend | Medium | Auth, Frontend | To-do |
| T6-12 | Test auth UI | Test register/login/reload/logout | QA | High | Testing | To-do |

## Acceptance Criteria

```text
- Register form validates input.
- Login form validates input.
- Login stores access token.
- Reload auth flow works.
- Logout clears user state.
- Protected pages reject unauthenticated users.
- Admin pages reject non-admin users.
```

---

# 13. Sprint 2 — Property Frontend Pages

## Goal

Implement property listing, detail, seller management, compare, and favorite UI.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T7-01 | Create homepage | Hero, search entry, featured properties | Frontend | Medium | Frontend | To-do |
| T7-02 | Create PropertyCard | Card with image, price, address, actions | Frontend | High | Frontend, Property | To-do |
| T7-03 | Create PropertyGrid | Responsive grid layout | Frontend | High | Frontend, Property | To-do |
| T7-04 | Create PropertyFilter | Keyword, city, type, purpose, price, area filters | Frontend | High | Frontend, Property | To-do |
| T7-05 | Create property listing page | Connect filters to API | Frontend | High | Frontend, Property | To-do |
| T7-06 | Add loading/empty/error states | Skeleton, empty state, error message | Frontend | Medium | Frontend | To-do |
| T7-07 | Create property detail page | Show gallery, info, seller, actions | Frontend | High | Frontend, Property | To-do |
| T7-08 | Create FavoriteButton | Add/remove favorite | Frontend | Medium | Frontend | To-do |
| T7-09 | Create CompareButton | Add/remove propertyId to compareStore | Frontend | Medium | Frontend | To-do |
| T7-10 | Create compare page | Fetch compare properties by IDs | Frontend | Medium | Frontend | To-do |
| T7-11 | Create favorites page | Show user's favorite properties | Frontend | Medium | Frontend | To-do |
| T7-12 | Create seller property table | Show seller's own properties | Frontend | High | Frontend, Property | To-do |
| T7-13 | Create PropertyForm | Property form with React Hook Form + Zod | Frontend | High | Frontend, Property | To-do |
| T7-14 | Create new property page | Submit property form to backend | Frontend | High | Frontend, Property | To-do |
| T7-15 | Create edit property page | Load and update property | Frontend | Medium | Frontend, Property | To-do |
| T7-16 | Test property frontend | Test listing/detail/create/edit/favorite/compare | QA | High | Testing | To-do |
| T7-17 | Show sold/rented badges | Display closed-property labels and disable chat CTA | Frontend | High | Frontend, Property | To-do |

## Acceptance Criteria

```text
- Users can browse property list.
- Search/filter works.
- Users can open property detail.
- Seller can create property.
- Seller can edit/delete own properties.
- Property cards and detail pages must clearly show sold/rented states and disable chat actions.
- Compare page works with 2-3 properties.
- Favorites work for authenticated users.
```

---

# 14. Sprint 3 — Upload and Map

## Goal

Implement image upload with Multer + Cloudinary and map display with React Leaflet.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T8-01 | Configure Cloudinary | Add cloudinary config file | Advanced | High | Upload | To-do |
| T8-02 | Create upload middleware | Use Multer memory storage | Advanced | High | Upload | To-do |
| T8-03 | Validate upload files | Validate MIME type, file size, max 10 files | Advanced | High | Upload | To-do |
| T8-04 | Create upload service | Upload buffers to Cloudinary | Advanced | High | Upload | To-do |
| T8-05 | Create upload controller/route | Add `POST /api/uploads/properties` | Advanced | High | Upload | To-do |
| T8-06 | Test upload API | Test valid/invalid uploads | QA | High | Testing, Upload | To-do |
| T8-07 | Create ImageUploadBox | Frontend upload component | Frontend | High | Frontend, Upload | To-do |
| T8-08 | Add image preview | Preview uploaded images before/after upload | Frontend | Medium | Frontend, Upload | To-do |
| T8-09 | Connect image upload to PropertyForm | Save Cloudinary URLs into form state | Frontend | High | Frontend, Upload | To-do |
| T8-10 | Install React Leaflet | Add map dependencies | Advanced | Medium | Map | To-do |
| T8-11 | Create PropertyMap component | Reusable map component | Advanced | Medium | Map | To-do |
| T8-12 | Add map to listing page | Show multiple markers | Advanced | Medium | Map | To-do |
| T8-13 | Add map to detail page | Show one property marker | Advanced | Medium | Map | To-do |

## Acceptance Criteria

```text
- Seller can upload 1 to 10 images.
- Invalid file type is rejected.
- File larger than 5MB is rejected.
- Cloudinary URLs are saved to property form.
- Property listing page can show markers.
- Property detail page shows one marker.
```

---

# 15. Sprint 3 — Contact Request Server Action

## Goal

Implement contact request form using Next.js Server Action and backend contact API.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T9-01 | Create contact request routes | Add contact request backend routes | Backend | Medium | Backend | To-do |
| T9-02 | Create contact request controller | Add create/get contact request controllers | Backend | Medium | Backend | To-do |
| T9-03 | Create contact request service | Save requests with status new | Backend | Medium | Backend | To-do |
| T9-04 | Use optionalAuth | Attach user if logged in, allow guest otherwise | Backend | Medium | Auth | To-do |
| T9-05 | Create contact schema | Add frontend Zod schema | Frontend | Medium | Frontend | To-do |
| T9-06 | Create ContactRequestForm | Add form to property detail page | Frontend | Medium | Frontend | To-do |
| T9-07 | Create Server Action | Add `app/properties/[id]/actions.ts` | Frontend | High | Frontend | To-do |
| T9-08 | Use BACKEND_API_URL | Server Action uses server-only env variable | Frontend | High | Frontend | To-do |
| T9-09 | Show success/error state | Display feedback after submit | Frontend | Medium | Frontend | To-do |
| T9-10 | Test contact request | Test guest and logged-in user submission | QA | Medium | Testing | To-do |

## Acceptance Criteria

```text
- Guest can submit contact request.
- Logged-in user can submit contact request.
- Server Action validates input using Zod.
- Server Action uses BACKEND_API_URL.
- Backend saves request with status new.
- Admin can view contact requests.
```

---

# 16. Sprint 3 — Realtime Chat

## Goal

Implement secure realtime chat using Socket.io.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T10-01 | Configure Socket.io server | Initialize Socket.io with HTTP server | Advanced | High | Chat | To-do |
| T10-02 | Implement socket auth middleware | Verify access token during socket connection | Advanced | High | Chat, Auth | To-do |
| T10-03 | Implement create conversation service | Create/get conversation by propertyId | Advanced | High | Chat | To-do |
| T10-04 | Derive sellerId from property.ownerId | Do not trust sellerId from client | Advanced | High | Chat | To-do |
| T10-05 | Implement get conversations API | Return user's conversations | Advanced | Medium | Chat | To-do |
| T10-06 | Implement get messages API | Return messages for participants only | Advanced | Medium | Chat | To-do |
| T10-07 | Implement join_conversation event | Join room after participant check | Advanced | High | Chat | To-do |
| T10-08 | Implement send_message event | Save and emit message | Advanced | High | Chat | To-do |
| T10-09 | Implement receive_message event | Emit to conversation room | Advanced | High | Chat | To-do |
| T10-10 | Create socket client helper | Connect with access token | Frontend | High | Chat, Frontend | To-do |
| T10-11 | Create ConversationList | Display conversations | Frontend | Medium | Chat, Frontend | To-do |
| T10-12 | Create ChatWindow | Display messages and input | Frontend | High | Chat, Frontend | To-do |
| T10-13 | Create MessageBubble | Own/right, other/left message UI | Frontend | Medium | Chat, Frontend | To-do |
| T10-14 | Test realtime chat | Test two browsers/accounts | QA | High | Testing, Chat | To-do |
| T10-15 | Block closed-property chat | Prevent conversation and message send for sold/rented property | Advanced | High | Chat | To-do |

## Security Rules

```text
- Client sends only propertyId when creating conversation.
- Backend derives sellerId from property.ownerId.
- Client does not send senderId in socket payload.
- Server uses socket.user.userId as senderId.
- Socket connection requires valid access token.
- Only participants can join room or send message.
```

## Acceptance Criteria

```text
- User can start chat from property detail.
- Conversation is linked to one property.
- Chat creation is blocked when the property is sold or rented.
- Message is saved to MongoDB.
- Message appears realtime to the other participant.
- Socket without token is rejected.
- User cannot join another user's conversation.
```

---

# 17. Sprint 3 — Admin Dashboard

## Goal

Implement admin dashboard, user management, property approval, and contact request management.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T11-01 | Create admin routes | Add protected admin route group | Backend | High | Admin | To-do |
| T11-02 | Create admin controller | Add stats/users/properties/contact controllers | Backend | High | Admin | To-do |
| T11-03 | Create admin service | Add admin business logic | Backend | High | Admin | To-do |
| T11-04 | Implement stats API | Count users/properties/conversations/requests | Backend | High | Admin | To-do |
| T11-05 | Implement get users API | User list with filters/pagination | Backend | Medium | Admin | To-do |
| T11-06 | Implement update user role API | Admin changes user role | Backend | Medium | Admin | To-do |
| T11-07 | Implement update user status API | Admin blocks/activates users | Backend | Medium | Admin | To-do |
| T11-08 | Implement pending properties API | Get pending property list | Backend | High | Admin | To-do |
| T11-09 | Implement approve property API | Set property status approved | Backend | High | Admin | To-do |
| T11-10 | Implement reject property API | Set property status rejected | Backend | Medium | Admin | To-do |
| T11-11 | Implement hide property API | Set property status hidden | Backend | Medium | Admin | To-do |
| T11-12 | Implement get contact requests API | Admin views contact requests | Backend | Medium | Admin | To-do |
| T11-13 | Create AdminStatsCards | Frontend stats cards | Frontend | Medium | Admin, Frontend | To-do |
| T11-14 | Create PropertyApprovalTable | Approve/reject/hide UI | Frontend | High | Admin, Frontend | To-do |
| T11-15 | Create UserManagementTable | User role/status UI | Frontend | Medium | Admin, Frontend | To-do |
| T11-16 | Create ContactRequestTable | View contact requests | Frontend | Medium | Admin, Frontend | To-do |
| T11-17 | Test admin dashboard | Test as admin and non-admin | QA | High | Testing | To-do |

## Acceptance Criteria

```text
- Admin can view statistics.
- Admin can approve/reject/hide properties.
- Admin can view users.
- Admin can block/activate users.
- Blocked users cannot login, refresh token, create property, favorite, or send messages.
- Admin can view contact requests.
- Non-admin users cannot access admin APIs/pages.
```

---

# 18. Sprint 4 — Testing and Bug Fixing

## Goal

Verify all main flows and fix bugs before deployment.

## Backend Test Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T12-01 | Test auth APIs | Register/login/refresh/logout/me | QA | High | Testing | To-do |
| T12-02 | Test property APIs | CRUD/search/filter/compare | QA | High | Testing | To-do |
| T12-03 | Test favorite APIs | Add/remove/get favorites | QA | Medium | Testing | To-do |
| T12-04 | Test contact APIs | Submit and view contact requests | QA | Medium | Testing | To-do |
| T12-05 | Test upload APIs | Valid/invalid upload cases | QA | Medium | Testing | To-do |
| T12-06 | Test chat APIs/events | Conversation, messages, socket auth | QA | High | Testing | To-do |
| T12-07 | Test admin APIs | Stats/users/property approval/contact requests | QA | High | Testing | To-do |

## Frontend Manual Test Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T12-08 | Test responsive layout | Mobile/tablet/desktop | QA | High | Testing | To-do |
| T12-09 | Test form validation | Login/register/property/contact forms | QA | High | Testing | To-do |
| T12-10 | Test auth reload flow | Refresh token after reload | QA | High | Testing | To-do |
| T12-11 | Test property user flow | Listing/detail/filter/compare/favorite | QA | High | Testing | To-do |
| T12-12 | Test seller flow | Create/edit/delete property | QA | High | Testing | To-do |
| T12-13 | Test admin flow | Approve/reject/hide/block user | QA | High | Testing | To-do |
| T12-14 | Test chat flow | Two browsers/accounts realtime | QA | High | Testing | To-do |

## Acceptance Criteria

```text
- Critical user flows work.
- No broken main pages.
- Forms show validation errors.
- Role-based access works.
- No real secrets are exposed.
- Bugs are tracked and fixed before deployment.
```

---

# 19. Sprint 4 — Deployment

## Goal

Deploy frontend, backend, database, and verify production flow.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T13-01 | Create MongoDB Atlas cluster | Setup production database | DevOps | High | Deployment | To-do |
| T13-02 | Create database user | Add username/password | DevOps | High | Deployment | To-do |
| T13-03 | Configure Atlas network access | Allow backend deployment access | DevOps | High | Deployment | To-do |
| T13-04 | Deploy backend | Deploy to Render/Railway | DevOps | High | Deployment | To-do |
| T13-05 | Add backend env variables | MongoDB, JWT, Cloudinary, CLIENT_URL | DevOps | High | Deployment | To-do |
| T13-06 | Test backend health endpoint | Verify `/api/health` production | DevOps | High | Deployment | To-do |
| T13-07 | Deploy frontend | Deploy to Vercel | DevOps | High | Deployment | To-do |
| T13-08 | Add frontend env variables | API URL, Socket URL, BACKEND_API_URL | DevOps | High | Deployment | To-do |
| T13-09 | Test production CORS | Verify frontend can call backend | DevOps | High | Deployment | To-do |
| T13-10 | Run production seed | Add demo data | DevOps | Medium | Deployment | To-do |
| T13-11 | Test production auth | Register/login/reload | QA | High | Testing | To-do |
| T13-12 | Test production property flow | Listing/detail/create/approve | QA | High | Testing | To-do |
| T13-13 | Test production advanced features | Upload/map/contact/chat | QA | High | Testing | To-do |

## Acceptance Criteria

```text
- Frontend URL works.
- Backend health URL works.
- MongoDB Atlas is connected.
- Login/register work in production.
- Property listing works in production.
- Admin approval works.
- Upload/map/contact/chat work or fallback demo is ready.
```

---

# 20. Sprint 4 — Documentation and Defense Preparation

## Goal

Prepare final report, slide, README, backup demo video, and defense script.

## Tasks

| Task ID | Task Name | Description | Owner | Priority | Label | Status |
|---|---|---|---|---|---|---|
| T14-01 | Complete README | Setup, env, run, deploy, feature list | Documentation | High | Documentation | To-do |
| T14-02 | Update SRS/HLD/LLD docs | Ensure docs match final system | Documentation | Medium | Documentation | To-do |
| T14-03 | Write report PDF | Follow required report structure | Documentation | High | Documentation | To-do |
| T14-04 | Create slide deck | 10-15 slides for defense | Documentation | High | Documentation | To-do |
| T14-05 | Prepare architecture diagram | Component diagram, ERD, API table | Documentation | High | Documentation | To-do |
| T14-06 | Prepare team contribution table | Add member tasks and commit count | Documentation | High | Documentation | To-do |
| T14-07 | Record backup demo video | 3-5 minute demo video | DevOps | High | Documentation | To-do |
| T14-08 | Prepare Postman collection | Export API test collection | Backend | Medium | Documentation | To-do |
| T14-09 | Prepare defense Q&A | JWT, SSR/SSG/ISR, Socket, scaling, security | Leader | High | Documentation | To-do |
| T14-10 | Final submission check | Verify all required files and links | Leader | High | Documentation | To-do |
| T14-11 | Sync business rules docs | Update docs for sold/rented lifecycle and chat blocking | Documentation | High | Documentation | To-do |

## Required Deliverables

```text
- GitHub Repository
- README.md
- .env.example files
- SRS.md
- HLD.md
- LLD.md
- IMPLEMENTATION_PLAN.md
- UI_UX_GUIDE.md
- TASK_BREAKDOWN.md
- Report PDF
- Slide deck
- Live Demo URL
- Backup demo video
```

---

# 21. Minimum Viable Task Set

If the team is short on time, prioritize these tasks first:

```text
1. Backend setup
2. MongoDB connection
3. User/Auth APIs
4. Property model and CRUD APIs
5. Property listing page
6. Property detail page
7. Login/Register pages
8. Seller create property
9. Admin approve property
10. Search/filter
11. Deployment
12. README/report/slide
```

This version is enough for a basic demo.

---

# 22. High-Score Task Set

For a stronger score, complete these additional tasks:

```text
1. JWT refresh token reload flow
2. Cloudinary image upload
3. Leaflet map integration
4. Contact Request Server Action
5. Realtime chat with Socket.io authentication
6. Property comparison
7. Favorite properties
8. Admin user management
9. Backend test cases
10. Good UI/UX responsive design
```

---

# 23. Definition of Done

A task is done only when:

```text
- Code is implemented.
- Code runs locally.
- Feature follows SRS/HLD/LLD.
- Validation is implemented.
- Error handling is implemented.
- API response follows standard format.
- Role permission is checked if needed.
- UI is responsive if it is a frontend task.
- Feature is tested manually or by automated test.
- No real secrets are committed.
- Pull request is reviewed.
- Documentation is updated if needed.
```

---

# 24. Suggested Daily Workflow

```text
1. Pick task from To-do.
2. Move task to Doing.
3. Create feature branch.
4. Code small part.
5. Commit meaningful changes.
6. Push branch.
7. Open Pull Request.
8. Ask one member to review.
9. Merge into dev.
10. Move task to Done.
```

---

# 25. Daily Standup Template

```text
Yesterday:
- What did I finish?

Today:
- What will I work on?

Blocked:
- What problem do I need help with?
```

---

# 26. Risk-Based Backup Tasks

| Risk | Backup Task |
|---|---|
| Chat production deploy fails | Prepare local chat demo and backup video |
| Cloudinary upload fails | Use prepared sample image URLs |
| Map has tile/loading issue | Show address fallback and coordinate text |
| MongoDB Atlas connection fails | Prepare local MongoDB fallback |
| Refresh token is buggy | Use login again flow for demo, but keep refresh API documented |
| Admin feature incomplete | At least implement approve property |
| Not enough time for all pages | Focus on listing, detail, login, dashboard, admin approval |

---

# 27. Final Demo Flow Tasks

Prepare the live demo in this order:

```text
1. Open homepage.
2. Open property listing.
3. Search/filter property.
4. Open property detail.
5. Show map.
6. Login as seller.
7. Create property with image upload.
8. Login as admin.
9. Approve property.
10. Show approved property in public listing.
11. Add property to compare.
12. Add property to favorites.
13. Submit contact request.
14. Start realtime chat.
15. Show backend health endpoint.
```

---

# 28. Final Checklist

```text
- GitHub repo is public.
- main branch is stable.
- dev branch has latest merged code.
- Each member has meaningful commits.
- README is complete.
- .env.example files are complete.
- No real secrets are committed.
- Frontend live link works.
- Backend health link works.
- Database seed data exists.
- Register/login work.
- Property CRUD works.
- Search/filter works.
- Admin approval works.
- Upload works.
- Map works.
- Contact request works.
- Chat works or backup demo is ready.
- Report PDF is ready.
- Slide deck is ready.
- Backup demo video is ready.
```

---

# 29. Notes for Using AI Coding Assistant

Use AI to generate one module at a time.

Good prompt pattern:

```text
Implement [module name] for RealEstateHub based on this design:
- Stack:
- Folder:
- API:
- Model:
- Business rules:
- Response format:
- Error handling:
```

Do not ask AI to generate the entire project at once. Review and test each generated module before moving to the next one.

---

# 30. Conclusion

This task breakdown converts the RealEstateHub documentation into practical tasks for coding and project management. The team should complete the core features first, then advanced features, then testing and deployment.

Core success depends on:

```text
- Stable authentication
- Working property CRUD
- Search/filter
- Seller dashboard
- Admin approval
- Deployment
```

Advanced score depends on:

```text
- Upload
- Map
- Contact Request Server Action
- Realtime chat
- Compare
- Favorite
- Testing
- Good documentation
```
