# IMPLEMENTATION_PLAN.md

## Project: RealEstateHub – Mini Real Estate Marketplace

---

## 1. Purpose

This document defines the practical implementation plan for **RealEstateHub**, a fullstack mini real estate marketplace.

The plan is based on the project SRS, HLD, revised LLD, and review feedback. It converts the design documents into actionable development tasks for frontend, backend, database, realtime chat, upload, map, admin, testing, deployment, and final defense preparation.

---

## 2. Project Summary

**RealEstateHub** is a mini real estate marketplace where users can browse, search, filter, compare, favorite, and contact sellers about properties.

Main features:

- User registration and login
- JWT authentication with refresh token
- Role-based access control
- Property listing CRUD
- Search and advanced filter
- Property detail page
- Property comparison
- Favorite properties
- Contact request using Next.js Server Action
- Realtime chat using Socket.io
- Property image upload using Cloudinary
- Map integration using Leaflet
- Admin dashboard
- Deployment to Vercel, Render/Railway, and MongoDB Atlas

---

## 3. Required Tech Stack

| Layer            | Technology                       |
| ---------------- | -------------------------------- |
| Frontend         | Next.js App Router               |
| Styling          | Tailwind CSS                     |
| UI Components    | shadcn/ui                        |
| Form Validation  | React Hook Form + Zod            |
| State Management | Zustand                          |
| Backend          | Node.js + Express.js             |
| Database         | MongoDB Atlas                    |
| ODM              | Mongoose                         |
| Authentication   | JWT Access Token + Refresh Token |
| Realtime         | Socket.io                        |
| Upload           | Multer + Cloudinary              |
| Map              | React Leaflet / Leaflet          |
| Deployment FE    | Vercel                           |
| Deployment BE    | Render or Railway                |
| Version Control  | GitHub                           |

---

## 4. Team Roles

For a team of 4 members:

| Role                             | Main Responsibility                        |
| -------------------------------- | ------------------------------------------ |
| Member 1 - Backend Lead          | Auth, User, Property API, middleware       |
| Member 2 - Frontend Lead         | Layout, pages, forms, API integration      |
| Member 3 - Advanced Feature Lead | Upload, Map, Realtime Chat                 |
| Member 4 - DevOps + QA + Report  | Deployment, testing, README, report, slide |

If the group has 3 members, combine **Advanced Feature Lead** and **DevOps + QA**.

If the group has 5 members, separate **QA/Test** and **Report/Slide** into two roles.

---

## 5. Git Workflow

### 5.1 Branch Strategy

```text
main
dev
feature/auth
feature/property-api
feature/frontend-layout
feature/property-pages
feature/upload-map
feature/chat
feature/admin
feature/deployment
fix/*
docs/*
```

### 5.2 Working Flow

```text
1. Create feature branch from dev.
2. Code the assigned task.
3. Commit small meaningful changes.
4. Push branch to GitHub.
5. Open Pull Request into dev.
6. At least 1 member reviews the PR.
7. Merge into dev.
8. Merge dev into main only for stable release.
```

### 5.3 Commit Message Convention

Use semantic commit style:

```text
feat: add user model
feat: implement login api
fix: resolve cors issue
docs: update setup guide
refactor: separate property service
test: add auth service tests
chore: configure eslint
```

---

## 6. Repository Structure

Recommended monorepo structure:

```text
real-estate-hub/
  frontend/
    app/
    components/
    lib/
    store/
    types/
    public/
    package.json
    .env.example

  backend/
    src/
      config/
      models/
      routes/
      controllers/
      services/
      middlewares/
      utils/
      seed/
      server.js
    package.json
    .env.example

  docs/
    SRS.md
    HLD.md
    LLD.md
    IMPLEMENTATION_PLAN.md

  README.md
  .gitignore
```

---

## 7. Environment Variables

### 7.1 Frontend `.env.example`

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
BACKEND_API_URL=
```

Explanation:

| Variable                 | Usage                               |
| ------------------------ | ----------------------------------- |
| `NEXT_PUBLIC_API_URL`    | Used by client components           |
| `NEXT_PUBLIC_SOCKET_URL` | Used by Socket.io client            |
| `BACKEND_API_URL`        | Used by Next.js Server Actions only |

Important rule:

```text
Do not use NEXT_PUBLIC_* for secrets.
Server Actions should use BACKEND_API_URL instead of NEXT_PUBLIC_API_URL.
```

---

### 7.2 Backend `.env.example`

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:3000
```

---

## 8. Implementation Roadmap

## Phase 0. Project Setup

### Goal

Create the foundation of the project and prepare the team workflow.

### Tasks

| ID    | Task                                       | Owner    | Priority | Status |
| ----- | ------------------------------------------ | -------- | -------- | ------ |
| P0-01 | Create GitHub repository                   | DevOps   | High     | To-do  |
| P0-02 | Create `main`, `dev`, and feature branches | DevOps   | High     | To-do  |
| P0-03 | Create monorepo folder structure           | DevOps   | High     | To-do  |
| P0-04 | Add root README.md                         | DevOps   | Medium   | To-do  |
| P0-05 | Add `.gitignore`                           | DevOps   | High     | To-do  |
| P0-06 | Add frontend `.env.example`                | Frontend | High     | To-do  |
| P0-07 | Add backend `.env.example`                 | Backend  | High     | To-do  |
| P0-08 | Create Trello/GitHub Project board         | Leader   | Medium   | To-do  |

### Acceptance Criteria

- GitHub repo is public.
- `main` and `dev` branches exist.
- README has basic setup instructions.
- `.env.example` files exist and contain no real secrets.
- Team has a task board.

---

## Phase 1. Backend Foundation

### Goal

Create backend architecture, connect database, and prepare common middleware.

### Tasks

| ID    | Task                                                       | Owner        | Priority | Branch                  |
| ----- | ---------------------------------------------------------- | ------------ | -------- | ----------------------- |
| P1-01 | Initialize Express backend project                         | Backend Lead | High     | `feature/backend-setup` |
| P1-02 | Setup folder structure: routes/controllers/services/models | Backend Lead | High     | `feature/backend-setup` |
| P1-03 | Configure MongoDB connection                               | Backend Lead | High     | `feature/backend-setup` |
| P1-04 | Configure CORS with credentials                            | Backend Lead | High     | `feature/backend-setup` |
| P1-05 | Add cookie parser and JSON parser                          | Backend Lead | High     | `feature/backend-setup` |
| P1-06 | Implement standard API response utility                    | Backend Lead | Medium   | `feature/backend-setup` |
| P1-07 | Implement asyncHandler utility                             | Backend Lead | Medium   | `feature/backend-setup` |
| P1-08 | Implement error middleware                                 | Backend Lead | High     | `feature/backend-setup` |
| P1-09 | Implement health check endpoint                            | Backend Lead | High     | `feature/backend-setup` |

### Acceptance Criteria

- Backend starts without errors.
- MongoDB connects successfully.
- `GET /api/health` returns success.
- Error response format is consistent.

---

## Phase 2. Database Models and Seed Data

### Goal

Implement Mongoose schemas and initial seed data.

### Tasks

| ID    | Task                                             | Owner         | Priority | Branch                    |
| ----- | ------------------------------------------------ | ------------- | -------- | ------------------------- |
| P2-01 | Create User schema                               | Backend Lead  | High     | `feature/database-models` |
| P2-02 | Create Property schema                           | Backend Lead  | High     | `feature/database-models` |
| P2-03 | Create Favorite schema                           | Backend Lead  | Medium   | `feature/database-models` |
| P2-04 | Create Conversation schema                       | Advanced Lead | Medium   | `feature/database-models` |
| P2-05 | Create Message schema                            | Advanced Lead | Medium   | `feature/database-models` |
| P2-06 | Create ContactRequest schema                     | Backend Lead  | Medium   | `feature/database-models` |
| P2-07 | Add indexes for search/filter/favorites/messages | Backend Lead  | High     | `feature/database-models` |
| P2-08 | Create seed admin account                        | DevOps        | High     | `feature/seed-data`       |
| P2-09 | Create seed sellers/users/properties             | DevOps        | Medium   | `feature/seed-data`       |

### Important Implementation Rules

```text
- User email must be unique.
- Property price must be greater than 0.
- Property area must be greater than 0.
- Property images must contain 1 to 10 image URLs.
- Favorite must be unique by userId + propertyId.
- Message must be indexed by conversationId + createdAt.
- Property status must include closed lifecycle values such as sold and rented.
```

### Acceptance Criteria

- All schemas are created.
- Database indexes are defined.
- Seed script can create demo users and properties.
- Seed data supports search, filter, map, comparison, and admin approval demo.

---

## Phase 3. Authentication and Authorization

### Goal

Implement secure login, registration, refresh token, logout, current user, and role-based middleware.

### Tasks

| ID    | Task                                   | Owner        | Priority | Branch         |
| ----- | -------------------------------------- | ------------ | -------- | -------------- |
| P3-01 | Implement password hashing with bcrypt | Backend Lead | High     | `feature/auth` |
| P3-02 | Implement JWT token generation utility | Backend Lead | High     | `feature/auth` |
| P3-03 | Implement register API                 | Backend Lead | High     | `feature/auth` |
| P3-04 | Implement login API                    | Backend Lead | High     | `feature/auth` |
| P3-05 | Implement refresh token API            | Backend Lead | High     | `feature/auth` |
| P3-06 | Implement logout API                   | Backend Lead | Medium   | `feature/auth` |
| P3-07 | Implement get current user API         | Backend Lead | High     | `feature/auth` |
| P3-08 | Implement `protect` middleware         | Backend Lead | High     | `feature/auth` |
| P3-09 | Implement `optionalAuth` middleware    | Backend Lead | Medium   | `feature/auth` |
| P3-10 | Implement `allowRoles` middleware      | Backend Lead | High     | `feature/auth` |
| P3-11 | Test auth APIs using Postman           | QA           | High     | `feature/auth` |

### APIs

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

### Reload Flow

```text
1. Page reloads.
2. Access token in memory is lost.
3. Frontend calls POST /api/auth/refresh.
4. Backend reads refresh token from HttpOnly cookie.
5. Backend returns a new access token.
6. Frontend stores new access token.
7. Frontend calls GET /api/auth/me.
8. Frontend restores user.
```

### Acceptance Criteria

- User can register.
- User can login.
- Access token is returned after login.
- Refresh token is stored in HttpOnly cookie.
- Refresh token can issue new access token.
- Blocked users cannot login or refresh.
- Admin-only routes reject non-admin users.

---

## Phase 4. Property Backend Module

### Goal

Implement property CRUD, search, filter, pagination, compare API, and status workflow.

### Tasks

| ID    | Task                                   | Owner        | Priority | Branch                 |
| ----- | -------------------------------------- | ------------ | -------- | ---------------------- |
| P4-01 | Implement property routes              | Backend Lead | High     | `feature/property-api` |
| P4-02 | Implement property controller          | Backend Lead | High     | `feature/property-api` |
| P4-03 | Implement property service             | Backend Lead | High     | `feature/property-api` |
| P4-04 | Implement create property API          | Backend Lead | High     | `feature/property-api` |
| P4-05 | Implement update property API          | Backend Lead | High     | `feature/property-api` |
| P4-06 | Implement delete property API          | Backend Lead | High     | `feature/property-api` |
| P4-07 | Implement get property detail API      | Backend Lead | High     | `feature/property-api` |
| P4-08 | Implement search/filter/pagination API | Backend Lead | High     | `feature/property-api` |
| P4-09 | Implement compare properties API       | Backend Lead | Medium   | `feature/property-api` |
| P4-10 | Implement property ownership check     | Backend Lead | High     | `feature/property-api` |
| P4-11 | Test all property APIs using Postman   | QA           | High     | `feature/property-api` |

### APIs

```text
GET    /api/properties
GET    /api/properties/compare?ids=id1,id2,id3
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
PATCH  /api/properties/:id/status
```

### Business Rules

```text
- Public users can only see approved properties.
- New property status is pending by default.
- Sold and rented properties are treated as closed and should be reflected in UI.
- Seller can update/delete only own properties.
- Admin can update/delete any property.
- Compare API accepts maximum 3 property IDs.
- Route /compare must be declared before /:id.
```

### Acceptance Criteria

- Seller can create property.
- New property has pending status.
- Public listing only returns approved properties.
- Closed properties show sold/rented badges in frontend lists and detail pages.
- Search and filter work by keyword, city, type, purpose, price, and area.
- Seller cannot update another seller's property.
- Compare API returns latest approved property details.

---

## Phase 5. Frontend Foundation

### Goal

Create the Next.js frontend foundation, shared layout, routes, components, API client, and global stores.

### Tasks

| ID    | Task                                  | Owner         | Priority | Branch                   |
| ----- | ------------------------------------- | ------------- | -------- | ------------------------ |
| P5-01 | Initialize Next.js App Router project | Frontend Lead | High     | `feature/frontend-setup` |
| P5-02 | Configure Tailwind CSS                | Frontend Lead | High     | `feature/frontend-setup` |
| P5-03 | Install and configure shadcn/ui       | Frontend Lead | Medium   | `feature/frontend-setup` |
| P5-04 | Create global layout                  | Frontend Lead | High     | `feature/frontend-setup` |
| P5-05 | Create Navbar and Footer              | Frontend Lead | High     | `feature/frontend-setup` |
| P5-06 | Create API client helper              | Frontend Lead | High     | `feature/frontend-setup` |
| P5-07 | Create authStore                      | Frontend Lead | High     | `feature/frontend-setup` |
| P5-08 | Create compareStore using propertyIds | Frontend Lead | Medium   | `feature/frontend-setup` |
| P5-09 | Create favoriteStore                  | Frontend Lead | Medium   | `feature/frontend-setup` |
| P5-10 | Create shared UI components           | Frontend Lead | Medium   | `feature/frontend-setup` |

### Required Routes

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

### Acceptance Criteria

- Next.js app runs locally.
- Tailwind works.
- Navbar and Footer appear on pages.
- At least 5 routes are implemented.
- Dynamic route `/properties/[id]` exists.
- Nested layouts for dashboard/admin exist.

---

## Phase 6. Frontend Auth Pages

### Goal

Implement login/register UI, validation, protected routes, and reload authentication flow.

### Tasks

| ID    | Task                                            | Owner         | Priority | Branch                  |
| ----- | ----------------------------------------------- | ------------- | -------- | ----------------------- |
| P6-01 | Create register form with React Hook Form + Zod | Frontend Lead | High     | `feature/frontend-auth` |
| P6-02 | Create login form with React Hook Form + Zod    | Frontend Lead | High     | `feature/frontend-auth` |
| P6-03 | Connect register form to backend                | Frontend Lead | High     | `feature/frontend-auth` |
| P6-04 | Connect login form to backend                   | Frontend Lead | High     | `feature/frontend-auth` |
| P6-05 | Store access token in authStore                 | Frontend Lead | High     | `feature/frontend-auth` |
| P6-06 | Implement logout UI                             | Frontend Lead | Medium   | `feature/frontend-auth` |
| P6-07 | Implement reload auth flow                      | Frontend Lead | High     | `feature/frontend-auth` |
| P6-08 | Implement ProtectedRoute component              | Frontend Lead | Medium   | `feature/frontend-auth` |
| P6-09 | Implement role-based redirect                   | Frontend Lead | Medium   | `feature/frontend-auth` |

### Acceptance Criteria

- Register form validates input.
- Login form validates input.
- Login stores access token.
- Refresh flow works after page reload.
- Protected pages reject unauthenticated users.
- Admin pages reject non-admin users.

---

## Phase 7. Property Frontend Pages

### Goal

Build public property pages, seller property management pages, compare, and favorites.

### Tasks

| ID    | Task                                     | Owner         | Priority | Branch                     |
| ----- | ---------------------------------------- | ------------- | -------- | -------------------------- |
| P7-01 | Create homepage                          | Frontend Lead | Medium   | `feature/property-pages`   |
| P7-02 | Create property listing page             | Frontend Lead | High     | `feature/property-pages`   |
| P7-03 | Create property filter component         | Frontend Lead | High     | `feature/property-pages`   |
| P7-04 | Create property card component           | Frontend Lead | High     | `feature/property-pages`   |
| P7-05 | Create property detail page              | Frontend Lead | High     | `feature/property-pages`   |
| P7-06 | Create property gallery component        | Frontend Lead | Medium   | `feature/property-pages`   |
| P7-07 | Create seller dashboard property table   | Frontend Lead | High     | `feature/seller-dashboard` |
| P7-08 | Create property form with Zod validation | Frontend Lead | High     | `feature/seller-dashboard` |
| P7-09 | Connect create property page to backend  | Frontend Lead | High     | `feature/seller-dashboard` |
| P7-10 | Connect edit property page to backend    | Frontend Lead | Medium   | `feature/seller-dashboard` |
| P7-11 | Implement compare page using propertyIds | Frontend Lead | Medium   | `feature/compare`          |
| P7-12 | Implement favorites page                 | Frontend Lead | Medium   | `feature/favorites`        |

### Acceptance Criteria

- Users can view property list.
- Search and filter update results.
- Users can view property detail.
- Seller can create property from dashboard.
- Seller can edit/delete own properties.
- Property cards and detail pages must reflect sold/rented labels and disable chat entry points.
- Compare page fetches latest details by IDs.
- Favorite button works for authenticated users.

---

## Phase 8. Upload and Map

### Goal

Implement property image upload and map integration.

### Tasks

| ID    | Task                                       | Owner         | Priority | Branch               |
| ----- | ------------------------------------------ | ------------- | -------- | -------------------- |
| P8-01 | Configure Cloudinary backend               | Advanced Lead | High     | `feature/upload-map` |
| P8-02 | Implement Multer memory storage middleware | Advanced Lead | High     | `feature/upload-map` |
| P8-03 | Implement upload property images API       | Advanced Lead | High     | `feature/upload-map` |
| P8-04 | Validate file type and file size           | Advanced Lead | High     | `feature/upload-map` |
| P8-05 | Create frontend image upload component     | Frontend Lead | High     | `feature/upload-map` |
| P8-06 | Add image preview before submit            | Frontend Lead | Medium   | `feature/upload-map` |
| P8-07 | Save Cloudinary URLs into property form    | Frontend Lead | High     | `feature/upload-map` |
| P8-08 | Install React Leaflet                      | Advanced Lead | Medium   | `feature/upload-map` |
| P8-09 | Create PropertyMap component               | Advanced Lead | Medium   | `feature/upload-map` |
| P8-10 | Show map on property listing page          | Advanced Lead | Medium   | `feature/upload-map` |
| P8-11 | Show map on property detail page           | Advanced Lead | Medium   | `feature/upload-map` |

### Acceptance Criteria

- Seller can upload 1 to 10 images.
- Invalid file type is rejected.
- File larger than 5MB is rejected.
- Cloudinary secure URLs are returned.
- Property can save uploaded image URLs.
- Listing page can show property markers.
- Detail page can show one marker.

---

## Phase 9. Contact Request Server Action

### Goal

Implement contact request form using Next.js Server Action.

### Tasks

| ID    | Task                                                  | Owner         | Priority | Branch                    |
| ----- | ----------------------------------------------------- | ------------- | -------- | ------------------------- |
| P9-01 | Create ContactRequest backend model                   | Backend Lead  | Medium   | `feature/contact-request` |
| P9-02 | Implement create contact request API                  | Backend Lead  | Medium   | `feature/contact-request` |
| P9-03 | Implement optionalAuth middleware on contact route    | Backend Lead  | Medium   | `feature/contact-request` |
| P9-04 | Create contact request Zod schema                     | Frontend Lead | Medium   | `feature/contact-request` |
| P9-05 | Create contact request form                           | Frontend Lead | Medium   | `feature/contact-request` |
| P9-06 | Create Server Action in `/properties/[id]/actions.ts` | Frontend Lead | High     | `feature/contact-request` |
| P9-07 | Use `BACKEND_API_URL` in Server Action                | Frontend Lead | High     | `feature/contact-request` |
| P9-08 | Show success/error message                            | Frontend Lead | Medium   | `feature/contact-request` |

### API

```text
POST /api/contact-requests
GET  /api/contact-requests/me
GET  /api/admin/contact-requests
```

### Acceptance Criteria

- Guest can submit contact request.
- Authenticated user can submit contact request.
- Server Action validates input using Zod.
- Server Action uses `BACKEND_API_URL`.
- Backend stores request with `new` status.
- Admin can view contact requests.

---

## Phase 10. Realtime Chat

### Goal

Implement secure realtime chat using Socket.io.

### Tasks

| ID     | Task                                    | Owner         | Priority | Branch         |
| ------ | --------------------------------------- | ------------- | -------- | -------------- |
| P10-01 | Configure Socket.io backend server      | Advanced Lead | High     | `feature/chat` |
| P10-02 | Implement Socket.io auth middleware     | Advanced Lead | High     | `feature/chat` |
| P10-03 | Implement Conversation model/service    | Advanced Lead | High     | `feature/chat` |
| P10-04 | Implement Message model/service         | Advanced Lead | High     | `feature/chat` |
| P10-05 | Implement create conversation API       | Advanced Lead | High     | `feature/chat` |
| P10-06 | Derive sellerId from `property.ownerId` | Advanced Lead | High     | `feature/chat` |
| P10-07 | Implement get conversations API         | Advanced Lead | Medium   | `feature/chat` |
| P10-08 | Implement get messages API              | Advanced Lead | Medium   | `feature/chat` |
| P10-09 | Implement `join_conversation` event     | Advanced Lead | High     | `feature/chat` |
| P10-10 | Implement `send_message` event          | Advanced Lead | High     | `feature/chat` |
| P10-11 | Implement frontend Socket.io client     | Frontend Lead | High     | `feature/chat` |
| P10-12 | Create ChatWindow UI                    | Frontend Lead | High     | `feature/chat` |
| P10-13 | Create ConversationList UI              | Frontend Lead | Medium   | `feature/chat` |

### P10-01 Implementation Notes

P10-01 is the foundation for the realtime chat feature. It should prepare the backend runtime to host Socket.io without introducing chat business logic yet; authentication, conversation handling, and message events belong to later P10 tasks.

#### Scope

- Add Socket.io support to the backend runtime.
- Create `config/socket.js` as the central place for Socket.io initialization.
- Switch the backend startup flow from `app.listen(...)` to an HTTP server that Socket.io can attach to.
- Expose the Socket.io instance so later chat services can emit events from the backend.

#### Required Behavior

- Load environment variables before socket initialization.
- Reuse the existing Express app and route registration.
- Keep CORS credentials aligned with the current backend and client setup.
- Preserve all existing REST endpoints while adding realtime capability.
- Keep chat event wiring out of this task.

#### Dependency / Environment Check

- Add the Socket.io dependency if it is not already present in `backend/package.json`.
- Confirm the backend still starts successfully after switching to the HTTP server pattern.
- Confirm the server bootstrap remains compatible with the existing MongoDB connection flow.

#### Integration Boundaries

- Do not implement Socket.io authentication in P10-01.
- Do not implement `join_conversation` or `send_message` in P10-01.
- Do not add conversation or message persistence logic in P10-01.
- Keep the task limited to runtime setup so later steps can build on a stable socket foundation.

#### Business Validation Check

- Confirm the backend can support the realtime chat module described in HLD and LLD.
- Confirm the socket layer is initialized before any future conversation or message event handlers are attached.
- Confirm the existing HTTP APIs remain functional after the runtime change.

#### Done When

- The backend runs through an HTTP server with Socket.io attached.
- `config/socket.js` exists and is the central socket bootstrap point.
- The backend remains able to serve current REST endpoints while being ready for P10-02 and later chat tasks.

### P10-03 Implementation Notes

P10-03 should establish the conversation data layer and the core conversation service logic used by the chat flow. The existing `Conversation` schema can be kept as the base, but this task must make the backend able to create and look up conversations according to the business rules in the LLD.

#### Scope

- Align the `Conversation` model with the chat data contract if any field or index refinement is needed.
- Create a conversation service layer that encapsulates chat business rules.
- Prepare reusable service methods for creating or retrieving a conversation for a property.
- Keep the client out of seller selection and duplicate-conversation handling.

#### Required Behavior

- Accept only authenticated buyer requests for conversation creation.
- Read `propertyId` from the request and derive `sellerId` from `property.ownerId`.
- Verify the property exists and is approved before creating or reusing a conversation.
- Reject conversation creation when the property is sold or rented.
- Prevent a user from opening a conversation with themselves when they own the property.
- Reuse an existing conversation if the same buyer, seller, and property already have one.
- Otherwise create a new conversation with `participants = [buyerId, sellerId]`.

#### Data / Model Rules

- `propertyId` remains the anchor for the conversation.
- `participants` must contain the buyer and seller user IDs.
- `lastMessage` should stay available for list previews and default to an empty string.
- Keep timestamps enabled so later APIs can sort by recent activity.
- Preserve the existing conversation indexes, or refine them only if the service needs a stronger query path.

#### Validation and Error Handling

- Reject invalid `propertyId` values before hitting the database where possible.
- Return clear errors when the property does not exist, is not approved, or is closed for chat.
- Return a conflict-style error when the buyer is the seller or when a duplicate conversation already exists and the API layer expects a creation-only response.
- Keep controller logic thin later by pushing the reusable rules into the service layer now.

#### Business Validation Check

- Confirm the service follows the LLD conversation flow: check property, derive seller, prevent self-chat, reuse existing conversation, otherwise create one.
- Confirm the client does not send `sellerId`.
- Confirm the conversation layer is ready for `GET /api/conversations`, `GET /api/conversations/:id/messages`, and socket room logic in later tasks.

#### Done When

- The backend has a reusable conversation service that can create or fetch a conversation correctly.
- The model and service match the LLD conversation contract.
- Later API and socket tasks can consume the conversation layer without duplicating business rules.

### APIs

```text
POST /api/conversations
GET  /api/conversations
GET  /api/conversations/:id/messages
```

### Socket Events

```text
join_conversation
send_message
receive_message
typing
message_read
```

### Security Rules

```text
- Client sends only propertyId when creating conversation.
- Backend derives sellerId from property.ownerId.
- Client does not send senderId in socket payload.
- Server uses socket.user.userId as senderId.
- Socket connection requires valid access token.
- Only conversation participants can join room or send message.
```

### Acceptance Criteria

- User can start chat from property detail.
- Conversation is linked to property.
- Chat creation is blocked when the property is sold or rented.
- Message is saved to MongoDB.
- Message appears realtime to the other participant.
- Socket without token is rejected.
- User cannot join another user's conversation.

---

## Phase 11. Admin Dashboard

### Goal

Implement admin dashboard with user management, property approval, and contact request management.

### Tasks

| ID     | Task                                 | Owner         | Priority | Branch          |
| ------ | ------------------------------------ | ------------- | -------- | --------------- |
| P11-01 | Implement admin route middleware     | Backend Lead  | High     | `feature/admin` |
| P11-02 | Implement admin stats API            | Backend Lead  | High     | `feature/admin` |
| P11-03 | Implement get users API              | Backend Lead  | Medium   | `feature/admin` |
| P11-04 | Implement update user role API       | Backend Lead  | Medium   | `feature/admin` |
| P11-05 | Implement update user status API     | Backend Lead  | Medium   | `feature/admin` |
| P11-06 | Implement get pending properties API | Backend Lead  | High     | `feature/admin` |
| P11-07 | Implement approve property API       | Backend Lead  | High     | `feature/admin` |
| P11-08 | Implement reject property API        | Backend Lead  | Medium   | `feature/admin` |
| P11-09 | Implement hide property API          | Backend Lead  | Medium   | `feature/admin` |
| P11-10 | Implement get contact requests API   | Backend Lead  | Medium   | `feature/admin` |
| P11-11 | Create admin dashboard UI            | Frontend Lead | Medium   | `feature/admin` |
| P11-12 | Create property approval table       | Frontend Lead | High     | `feature/admin` |
| P11-13 | Create user management table         | Frontend Lead | Medium   | `feature/admin` |
| P11-14 | Create contact request table         | Frontend Lead | Medium   | `feature/admin` |

### APIs

```text
GET   /api/admin/stats
GET   /api/admin/users
PATCH /api/admin/users/:id/role
PATCH /api/admin/users/:id/status
GET   /api/admin/properties/pending
PATCH /api/admin/properties/:id/approve
PATCH /api/admin/properties/:id/reject
PATCH /api/admin/properties/:id/hide
GET   /api/admin/contact-requests
```

### Acceptance Criteria

- Admin can view dashboard stats.
- Admin can approve/reject/hide properties.
- Admin can view users.
- Admin can block/activate users.
- Blocked users cannot login, refresh token, create property, favorite, or send messages.
- Admin can view contact requests.
- Documentation must stay aligned with property lifecycle and chat-blocking rules.

---

## Phase 12. Testing

### Goal

Ensure core backend and frontend features work correctly.

### Backend Test Cases

| ID   | Test Case                           | Expected Result                      |
| ---- | ----------------------------------- | ------------------------------------ |
| T-01 | Register with valid data            | User created                         |
| T-02 | Register with duplicate email       | 409 Conflict                         |
| T-03 | Login with correct password         | Access token returned                |
| T-04 | Login with blocked user             | 401 Unauthorized                     |
| T-05 | Refresh token with valid cookie     | New access token returned            |
| T-06 | Get current user with valid token   | User info returned                   |
| T-07 | Create property as seller           | Property created with pending status |
| T-08 | Create property as user             | 403 Forbidden                        |
| T-09 | Create property with price 0        | 400 Bad Request                      |
| T-10 | Create property without image       | 400 Bad Request                      |
| T-11 | Search approved properties          | Only approved properties returned    |
| T-12 | Add duplicate favorite              | 409 Conflict                         |
| T-13 | Create conversation with propertyId | Seller derived from property.ownerId |
| T-14 | Socket connection without token     | Rejected                             |
| T-15 | Upload invalid file type            | 400 Bad Request                      |
| T-16 | Approve property as admin           | Status becomes approved              |

### Frontend Manual Test Checklist

```text
- Home page loads.
- Property listing loads.
- Search/filter works.
- Property detail loads.
- Register form validation works.
- Login form validation works.
- Reload auth flow works.
- Seller can create property.
- Image upload preview works.
- Map displays marker.
- Compare page works with 2-3 properties.
- Favorite button works.
- Contact request form works.
- Chat works realtime.
- Admin can approve property.
```

---

## Phase 13. Deployment

### Goal

Deploy frontend, backend, database, and external services.

### Backend Deployment

Platform:

```text
Render or Railway
```

Checklist:

```text
- Add backend environment variables.
- Configure MongoDB Atlas URI.
- Configure Cloudinary variables.
- Configure JWT secrets.
- Configure CLIENT_URL.
- Deploy backend.
- Test GET /api/health.
- Test CORS from frontend domain.
```

### Frontend Deployment

Platform:

```text
Vercel
```

Checklist:

```text
- Add NEXT_PUBLIC_API_URL.
- Add NEXT_PUBLIC_SOCKET_URL.
- Add BACKEND_API_URL.
- Deploy frontend.
- Test production build.
- Test login/register in production.
- Test Server Action in production.
```

### Database Deployment

Platform:

```text
MongoDB Atlas
```

Checklist:

```text
- Create MongoDB cluster.
- Create database user.
- Configure network access.
- Add connection string to backend env.
- Run seed script.
```

### External Services

Cloudinary:

```text
- Create Cloudinary account.
- Get cloud name, API key, API secret.
- Add credentials to backend environment.
```

Leaflet/OpenStreetMap:

```text
- No API key required for basic OpenStreetMap tiles.
- Ensure attribution is displayed.
```

---

## Phase 14. Documentation and Final Defense

### Required Deliverables

```text
- GitHub Repository
- README.md
- .env.example files
- SRS.md
- HLD.md
- LLD.md
- IMPLEMENTATION_PLAN.md
- Report PDF
- Slide deck
- Live Demo URL
- Backup demo video
```

### README Checklist

```text
- Project introduction
- Tech stack
- Features
- Folder structure
- Local setup
- Environment variables
- How to run frontend
- How to run backend
- Seed data command
- API overview
- Deployment links
- Team members and responsibilities
```

### Defense Demo Flow

Recommended live demo order:

```text
1. Open homepage.
2. Browse property listing.
3. Search/filter properties.
4. Open property detail.
5. Show map.
6. Login as seller.
7. Create property with image upload.
8. Login as admin.
9. Approve property.
10. Show approved property on public listing.
11. Add property to compare.
12. Add property to favorites.
13. Submit contact request.
14. Start realtime chat.
15. Show deployed frontend and backend health endpoint.
```

### Backup Plan

```text
- Record a 3-5 minute backup demo video.
- Keep local version ready.
- Keep seed data ready.
- Keep Postman collection ready.
- Prepare answers for JWT refresh token, SSR/SSG/ISR, Socket.io auth, and scaling.
```

---

## 15. Sprint Plan

## Sprint 0 - Kick-off

Duration:

```text
0.5 - 1 day
```

Deliverables:

```text
- GitHub repo
- Branching strategy
- README skeleton
- .env.example
- Trello/GitHub Project board
```

---

## Sprint 1 - Foundation

Duration:

```text
3 - 5 days
```

Deliverables:

```text
- Backend setup
- MongoDB connection
- Database schemas
- Auth APIs
- Property CRUD APIs
- Frontend layout
- Basic routes
```

Checkpoint demo:

```text
- Backend health check works.
- Database connected.
- Register/login works.
- Property CRUD works in Postman.
- Frontend routes are visible.
```

---

## Sprint 2 - Core Features

Duration:

```text
4 - 6 days
```

Deliverables:

```text
- Property listing page
- Property detail page
- Search/filter
- Seller dashboard
- Property form
- Favorite
- Compare
```

Checkpoint demo:

```text
- User can browse and filter properties.
- Seller can create property.
- Compare works.
- Favorite works.
```

---

## Sprint 3 - Advanced Features

Duration:

```text
4 - 6 days
```

Deliverables:

```text
- Cloudinary upload
- Leaflet map
- Contact request Server Action
- Socket.io chat
- Admin dashboard
```

Checkpoint demo:

```text
- Upload image works.
- Map displays property.
- Contact form uses Server Action.
- Realtime chat works.
- Admin can approve property.
```

---

## Sprint 4 - Deploy and Finalize

Duration:

```text
2 - 4 days
```

Deliverables:

```text
- Frontend deployed to Vercel
- Backend deployed to Render/Railway
- Database deployed to MongoDB Atlas
- README completed
- Report completed
- Slide completed
- Backup demo video recorded
```

---

## 16. Definition of Done

A task is considered done only when:

```text
- Code is implemented.
- Code runs locally.
- Validation is handled.
- Error handling is handled.
- API response follows standard format.
- Role permission is checked if needed.
- No real secrets are committed.
- Related UI is responsive.
- Feature is tested manually or by unit test.
- PR is reviewed and merged.
- README or docs are updated if needed.
```

---

## 17. Priority List

If time is limited, implement in this order:

```text
1. Backend setup + DB connection
2. User/Auth APIs
3. Property CRUD APIs
4. Frontend layout and routing
5. Property listing page
6. Property detail page
7. Login/Register pages
8. Seller create property
9. Admin approve property
10. Search/filter
11. Image upload
12. Map integration
13. Contact request Server Action
14. Favorite
15. Compare
16. Realtime chat
17. Testing
18. Deployment
```

Minimum viable version for demo:

```text
- Auth
- Property CRUD
- Search/filter
- Property detail
- Seller dashboard
- Admin approval
- Deployment
```

High-score version:

```text
- Auth with refresh token
- Upload image
- Map
- Realtime chat
- Contact Request Server Action
- Compare
- Favorite
- Admin dashboard
- Testing
- Good README and deployment
```

---

## 18. Risk Management

| Risk                          | Impact                             | Mitigation                                        |
| ----------------------------- | ---------------------------------- | ------------------------------------------------- |
| MongoDB connection fails      | Backend cannot run                 | Prepare local MongoDB or fix Atlas network access |
| CORS issue                    | Frontend cannot call backend       | Configure `CLIENT_URL` and credentials correctly  |
| Refresh token bug             | Login unstable                     | Test reload flow early                            |
| Cloudinary upload fails       | Cannot create property with images | Prepare fallback sample image URLs                |
| Socket.io deploy issue        | Chat fails in production           | Keep local demo and backup video                  |
| Map rendering issue           | Detail/listing UI incomplete       | Show fallback address if coordinates fail         |
| Team commits too late         | Individual contribution unclear    | Commit daily with meaningful messages             |
| Live link dies during defense | Lose deployment points             | Prepare local demo and backup video               |

---

## 19. Suggested Trello Columns

```text
Backlog
To-do
Doing
Review
Done
Blocked
```

Suggested labels:

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

## 20. Final Checklist Before Submission

```text
- GitHub repository is public.
- Commit history is meaningful.
- Each member has enough commits.
- README is complete.
- `.env.example` exists.
- No real secrets are committed.
- Frontend live URL works.
- Backend health URL works.
- MongoDB Atlas is connected.
- Register/login work in production.
- Property listing works in production.
- Image upload works.
- Map works.
- Chat works or local fallback is ready.
- Admin approval works.
- Report PDF is completed.
- Slides are completed.
- Backup demo video is recorded.
```

---

## 21. Recommended Implementation Commands

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Seed Data

```bash
cd backend
npm run seed
```

### Test Backend

```bash
cd backend
npm test
```

### Build Frontend

```bash
cd frontend
npm run build
```

---

## 22. Implementation Notes for AI Coding Assistant

When using an AI coding assistant, generate code in small modules.

Recommended order:

```text
1. Generate backend project skeleton.
2. Generate database models.
3. Generate auth routes/controllers/services.
4. Test auth.
5. Generate property routes/controllers/services.
6. Test property APIs.
7. Generate frontend layout.
8. Generate auth UI.
9. Generate property listing/detail UI.
10. Generate upload/map/chat/admin features one by one.
```

Do not ask AI to generate the entire project in one prompt. Use one prompt per module and review the code after every step.

Example prompt:

```text
Implement the Express.js Auth module for RealEstateHub based on this design:
- User model has fullName, email, passwordHash, phone, role, refreshToken, status.
- APIs: register, login, refresh, logout, me.
- Use bcrypt, JWT access token, JWT refresh token in HttpOnly cookie.
- Follow Router → Controller → Service → Model.
- Return standard JSON response: success, message, data/errors.
```

---

## 23. Conclusion

This implementation plan converts the SRS, HLD, and revised LLD into practical coding tasks. The team should follow the phases in order: setup, backend foundation, database, auth, property APIs, frontend pages, upload/map, contact request, chat, admin, testing, deployment, and final documentation.

The most important implementation priorities are:

```text
- Auth must be stable.
- Property CRUD and search/filter must work.
- Admin approval must work.
- Deployment must work before defense.
- Advanced features should be integrated after core features are stable.
```
