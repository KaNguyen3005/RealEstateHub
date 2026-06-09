# CODING_RULES.md  
## Project: RealEstateHub – Mini Real Estate Marketplace

---

## 1. Purpose

This document defines the coding rules for the **RealEstateHub** project.

The purpose of this file is to help all team members write code in the same style, avoid common bugs, and make the codebase easier to understand, review, test, and defend during the final presentation.

This document applies to:

```text
- Frontend code
- Backend code
- Database models
- API design
- Authentication logic
- Realtime chat logic
- Upload logic
- Git workflow
- Environment variables
- Documentation
```

---

## 2. General Coding Principles

## 2.1 Write Code That the Team Can Explain

Every member must understand the code they commit.

Do:

```text
- Write clear and simple code.
- Use meaningful variable names.
- Keep functions focused.
- Add comments only when logic is complex.
- Review AI-generated code before committing.
```

Avoid:

```text
- Copying large code blocks without understanding.
- Writing one giant function.
- Mixing UI logic, API logic, and business logic in one file.
- Committing code that cannot run.
```

---

## 2.2 Keep Code Consistent

Use the same patterns across the project.

Examples:

```text
- Backend must follow Route → Controller → Service → Model.
- API responses must follow standard JSON format.
- Frontend forms must use React Hook Form + Zod.
- Protected backend routes must use auth middleware.
- Seller/Admin routes must use role middleware.
```

---

## 2.3 Small Commits, Small Pull Requests

Each commit should represent one clear change.

Good commits:

```text
feat: add user model
feat: implement login api
fix: handle duplicate favorite error
docs: update backend setup guide
refactor: move property query logic to service
```

Bad commits:

```text
update code
fix bug
final
done
many changes
```

---

## 3. Project Structure Rules

## 3.1 Root Structure

The project should use this structure:

```text
real-estate-hub/
  frontend/
  backend/
  docs/
  README.md
  .gitignore
```

---

## 3.2 Frontend Structure

```text
frontend/
  app/
  components/
  lib/
  store/
  types/
  public/
  package.json
  .env.example
```

Rules:

```text
- Pages and routes go inside app/.
- Reusable UI components go inside components/.
- API helpers and validation schemas go inside lib/.
- Zustand stores go inside store/.
- TypeScript interfaces/types go inside types/.
```

---

## 3.3 Backend Structure

```text
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
```

Rules:

```text
- routes/ only defines endpoints and middleware chain.
- controllers/ handles request and response.
- services/ contains business logic.
- models/ contains Mongoose schemas.
- middlewares/ contains auth, role, validation, upload, and error middleware.
- utils/ contains reusable helpers.
- config/ contains database, Cloudinary, Socket.io config.
```

---

## 4. Naming Rules

## 4.1 File Naming

Frontend component files:

```text
PascalCase.tsx
```

Examples:

```text
PropertyCard.tsx
LoginForm.tsx
AdminStatsCards.tsx
```

Frontend utility/store/type files:

```text
camelCase.ts
```

Examples:

```text
api.ts
authStore.ts
compareStore.ts
property.schema.ts
```

Backend files:

```text
camelCase or module.type.js
```

Examples:

```text
auth.routes.js
property.controller.js
property.service.js
auth.middleware.js
User.js
Property.js
```

---

## 4.2 Variable Naming

Use meaningful names.

Good:

```js
const propertyId = req.params.id;
const currentUser = req.user;
const approvedProperties = await Property.find({ status: "approved" });
```

Bad:

```js
const idd = req.params.id;
const data = req.user;
const x = await Property.find({});
```

---

## 4.3 Function Naming

Function names should describe the action.

Good:

```js
getProperties()
createProperty()
updatePropertyStatus()
generateAccessToken()
canModifyProperty()
```

Bad:

```js
handleData()
process()
doThing()
run()
```

---

## 5. Frontend Coding Rules

## 5.1 Use TypeScript Types

All important data should have types.

Required type files:

```text
types/user.ts
types/property.ts
types/chat.ts
types/api.ts
```

Example:

```ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}
```

---

## 5.2 Component Rules

Each component should have one clear purpose.

Good component structure:

```tsx
type PropertyCardProps = {
  property: Property;
};

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div>
      {/* UI */}
    </div>
  );
}
```

Rules:

```text
- Use props with explicit types.
- Keep components small.
- Move repeated UI into reusable components.
- Do not put large API logic directly inside UI components.
```

---

## 5.3 Page Rules

Pages in `app/` should focus on route-level rendering.

Rules:

```text
- Page files should compose components.
- Heavy logic should be moved to components, hooks, or lib functions.
- Use loading and error states where needed.
- Protected pages must check authentication/role.
```

---

## 5.4 Form Rules

All important forms must use:

```text
React Hook Form + Zod
```

Forms that require validation:

```text
- Register form
- Login form
- Property form
- Contact request form
```

Rules:

```text
- Define Zod schemas in lib/validations/.
- Show validation errors near fields.
- Disable submit button while submitting.
- Prevent double submit.
- Show success or error message after submit.
```

Example:

```ts
const propertySchema = z.object({
  title: z.string().min(5),
  price: z.coerce.number().positive(),
  area: z.coerce.number().positive(),
  images: z.array(z.string()).min(1).max(10)
});
```

---

## 5.5 State Management Rules

Use Zustand for shared state.

Stores:

```text
authStore.ts
compareStore.ts
favoriteStore.ts
```

Rules:

```text
- authStore stores current user and access token.
- compareStore stores propertyIds, not full property objects.
- favoriteStore stores favorite property IDs.
- Do not duplicate server data in too many stores.
```

Compare store rule:

```text
Store only propertyIds to avoid stale property data.
The /compare page must fetch latest property details from backend.
```

---

## 5.6 API Client Rules

Create a central API helper in:

```text
frontend/lib/api.ts
```

Rules:

```text
- Use NEXT_PUBLIC_API_URL for client-side API calls.
- Attach access token when calling protected APIs.
- Handle 401 by attempting refresh flow if possible.
- Return standard response format.
```

Do not hardcode API URLs inside components.

Bad:

```ts
fetch("http://localhost:5000/api/properties")
```

Good:

```ts
api.get("/api/properties")
```

---

## 5.7 Server Action Rules

Server Actions must use server-only environment variables.

For Contact Request Server Action:

```text
Use BACKEND_API_URL
Do not use NEXT_PUBLIC_API_URL
```

Reason:

```text
Server Actions run on the server side.
NEXT_PUBLIC_* variables are exposed to the browser.
```

Good:

```ts
await fetch(`${process.env.BACKEND_API_URL}/api/contact-requests`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(validated.data),
  cache: "no-store"
});
```

---

## 5.8 UI Rules

Follow `UI_UX_GUIDE.md`.

Required UI states:

```text
- Loading state
- Empty state
- Error state
- Success state
- Disabled submit state
```

Examples:

```text
No properties found.
Failed to load properties.
Property created successfully. Waiting for admin approval.
Uploading...
```

---

## 6. Backend Coding Rules

## 6.1 Backend Architecture Rule

Every backend module should follow:

```text
Route → Controller → Service → Model
```

Example:

```text
property.routes.js
property.controller.js
property.service.js
Property.js
```

---

## 6.2 Route Rules

Routes should only define:

```text
- Endpoint path
- HTTP method
- Middleware chain
- Controller function
```

Example:

```js
router.post(
  "/",
  protect,
  allowRoles("seller", "admin"),
  propertyController.createProperty
);
```

Do not write business logic inside routes.

---

## 6.3 Controller Rules

Controllers should:

```text
- Read req.params, req.query, req.body, req.user
- Call service functions
- Return standard JSON response
```

Controllers should not:

```text
- Contain long business logic
- Directly write complex database queries
- Validate ownership manually if service handles it
```

Good:

```js
export const createProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.createProperty(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: "Property created successfully",
    data: property
  });
});
```

---

## 6.4 Service Rules

Services contain business logic.

Services should:

```text
- Validate business rules
- Query database
- Check ownership
- Check status
- Throw meaningful errors
```

Example service responsibilities:

```text
property.service.js:
- build search query
- check owner permission
- create property with pending status
- return approved public properties only
```

---

## 6.5 Model Rules

Mongoose schemas must include:

```text
- Required fields
- Enum validation
- Min/max validation
- Indexes
- Timestamps
```

Property rules:

```text
- price must be greater than 0
- area must be greater than 0
- images must contain 1 to 10 URLs
- status must be pending, approved, rejected, or hidden
```

---

## 6.6 Middleware Rules

Use middleware for repeated logic.

Required middleware:

```text
protect
optionalAuth
allowRoles
validate
uploadPropertyImages
errorMiddleware
```

Rules:

```text
- Use protect for authenticated routes.
- Use allowRoles for seller/admin/admin-only routes.
- Use optionalAuth for routes that support guest and logged-in users.
- Use upload middleware for multipart/form-data.
- Use error middleware at the end of app setup.
```

---

## 7. API Response Rules

## 7.1 Success Response

All success responses should follow:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

---

## 7.2 Error Response

All error responses should follow:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

---

## 7.3 HTTP Status Code Rules

| Code | Usage |
|---|---|
| 200 | Successful GET, PUT, PATCH, DELETE |
| 201 | Successful create |
| 400 | Invalid input |
| 401 | Missing or invalid authentication |
| 403 | No permission |
| 404 | Resource not found |
| 409 | Conflict, duplicate data |
| 500 | Unexpected server error |

---

## 8. Authentication and Authorization Rules

## 8.1 Token Rules

| Token | Storage | Usage |
|---|---|---|
| Access Token | Frontend memory/Zustand | Protected API calls |
| Refresh Token | HttpOnly Cookie | Get new access token |

Rules:

```text
- Access token should be short-lived.
- Refresh token should be stored in HttpOnly cookie.
- Do not store refresh token in localStorage.
- Do not expose JWT secrets to frontend.
```

---

## 8.2 Page Reload Auth Flow

```text
1. Page reloads.
2. Access token in memory is lost.
3. Frontend calls POST /api/auth/refresh.
4. Backend reads refresh token from HttpOnly cookie.
5. Backend returns a new access token.
6. Frontend stores access token in authStore.
7. Frontend calls GET /api/auth/me.
8. Frontend restores current user.
```

---

## 8.3 Role Rules

Roles:

```text
admin
seller
user
```

Rules:

```text
- Guest can browse approved properties.
- User can favorite, compare, contact, and chat.
- Seller can create and manage own properties.
- Admin can manage users and property approval.
```

---

## 8.4 Public Registration Rule

Public registration can create only:

```text
user
seller
```

Admin account should be created by:

```text
- Seed script
- Manual database setup
```

---

## 9. Property Module Rules

## 9.1 Property Status Rules

Property statuses:

```text
pending
approved
rejected
hidden
```

Rules:

```text
- New property is pending by default.
- Public listing shows only approved properties.
- Admin can approve, reject, or hide properties.
- Seller can view own properties regardless of status.
- Seller can update/delete only own properties.
```

---

## 9.2 Property Search Rules

Public property search must force:

```js
status: "approved"
```

Allowed filters:

```text
keyword
city
district
type
purpose
minPrice
maxPrice
minArea
maxArea
page
limit
```

---

## 9.3 Compare Rules

Rules:

```text
- Compare maximum 3 properties.
- Frontend stores propertyIds only.
- Backend returns latest property details.
- Only approved properties are returned for public compare.
```

Route rule:

```text
Define /api/properties/compare before /api/properties/:id.
```

---

## 10. Upload Rules

Upload stack:

```text
Multer memory storage + Cloudinary
```

Rules:

```text
- Field name must be images.
- Maximum 10 images.
- Maximum 5MB per image.
- Allowed MIME types: image/jpeg, image/png, image/webp.
- Return Cloudinary secure URLs.
- Do not commit Cloudinary API secrets.
```

Upload route:

```text
POST /api/uploads/properties
```

Required middleware:

```text
protect
allowRoles("seller", "admin")
uploadPropertyImages
```

---

## 11. Chat Rules

## 11.1 Conversation Rules

Create conversation request should contain only:

```json
{
  "propertyId": "propertyId"
}
```

Do not accept `sellerId` from client.

Backend must:

```text
- Find property by propertyId.
- Get sellerId from property.ownerId.
- Prevent user from chatting with themselves.
- Create participants = [buyerId, sellerId].
- Return existing conversation if it already exists.
```

---

## 11.2 Socket Authentication Rules

Socket connection must include access token.

Client:

```ts
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  auth: {
    token: accessToken
  }
});
```

Server:

```text
- Verify token.
- Reject invalid token.
- Reject blocked user.
- Attach user info to socket.user.
```

---

## 11.3 Message Rules

Client message payload:

```json
{
  "conversationId": "conversationId",
  "content": "Hello"
}
```

Rules:

```text
- Client must not send senderId.
- Server uses socket.user.userId as senderId.
- Only conversation participants can join room.
- Only conversation participants can send messages.
- Message content must not be empty.
```

---

## 12. Admin Rules

Admin can:

```text
- View stats
- View users
- Update user role
- Update user status
- View pending properties
- Approve property
- Reject property
- Hide property
- View contact requests
```

Rules:

```text
- All admin APIs must use protect + allowRoles("admin").
- Blocked users cannot login, refresh token, create property, favorite, or send messages.
- Reject/hide/block actions should require confirmation on frontend.
```

---

## 13. Environment Variable Rules

## 13.1 Frontend Env

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SOCKET_URL=
BACKEND_API_URL=
```

Rules:

```text
- NEXT_PUBLIC_API_URL is for client-side API calls.
- NEXT_PUBLIC_SOCKET_URL is for Socket.io client.
- BACKEND_API_URL is for Server Actions only.
- Do not put secrets in frontend env.
```

---

## 13.2 Backend Env

```env
PORT=
NODE_ENV=
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=
```

Rules:

```text
- Never commit real .env files.
- Commit only .env.example.
- Rotate secrets immediately if leaked.
```

---

## 14. Security Rules

## 14.1 Do Not Commit Secrets

Never commit:

```text
.env
MongoDB URI
JWT secrets
Cloudinary API secret
Access tokens
Refresh tokens
Passwords
```

---

## 14.2 Password Rules

```text
- Never store plain password.
- Hash password using bcrypt.
- Never return passwordHash in API response.
```

---

## 14.3 Error Security Rules

Do not expose:

```text
- Stack trace in production
- Database connection string
- JWT secret
- Cloudinary secret
```

---

## 14.4 Input Validation Rules

Validate:

```text
- Request body
- Query params
- URL params
- Uploaded files
- Socket message payloads
```

---

## 15. Testing Rules

## 15.1 Required Manual Tests

Before merging important features, test:

```text
- Register
- Login
- Refresh token after reload
- Logout
- Create property
- Search/filter properties
- Upload image
- Map display
- Favorite property
- Compare properties
- Contact request
- Realtime chat
- Admin approve/reject/hide
```

---

## 15.2 Backend Test Cases

Recommended test cases:

```text
- Register with valid data
- Register with duplicate email
- Login with correct password
- Login with blocked user
- Refresh token with valid cookie
- Create property as seller
- Create property as normal user
- Create property with price 0
- Create property without image
- Add duplicate favorite
- Create conversation with propertyId
- Socket connection without token
- Upload invalid file type
- Approve property as admin
```

---

## 15.3 PR Testing Rule

Before opening a Pull Request:

```text
- Run app locally.
- Test changed feature.
- Check console errors.
- Check API response.
- Check no .env or secrets are included.
```

---

## 16. Git Rules

## 16.1 Branch Rules

Use these branches:

```text
main
dev
feature/*
fix/*
docs/*
```

Rules:

```text
- Do not code directly on main.
- Create feature branches from dev.
- Merge into dev through Pull Request.
- Merge dev into main only when stable.
```

---

## 16.2 Commit Rules

Use semantic commits:

```text
feat: add property model
fix: handle refresh token error
docs: update coding rules
refactor: move query builder to service
test: add auth tests
chore: configure eslint
```

---

## 16.3 Pull Request Rules

PR description should include:

```text
- What was changed?
- How was it tested?
- Screenshots if UI changed.
- Related task ID.
```

Example:

```text
Task: T3-04 Implement login API

Changes:
- Added login service
- Added login controller
- Added POST /api/auth/login route

Tested:
- Login with valid account
- Login with wrong password
- Login with blocked user
```

---

## 17. Documentation Rules

Update documentation when changing:

```text
- API endpoint
- Environment variable
- Folder structure
- Database schema
- Business rule
- Deployment setup
```

Docs to maintain:

```text
README.md
SRS.md
HLD.md
LLD.md
IMPLEMENTATION_PLAN.md
UI_UX_GUIDE.md
TASK_BREAKDOWN.md
CODING_RULES.md
```

---

## 18. Code Review Checklist

Reviewer should check:

```text
- Code follows folder structure.
- API response format is correct.
- Auth/role checks are included.
- No business logic in routes.
- No secrets are committed.
- Validation is included.
- Error handling is included.
- UI is responsive if frontend.
- Feature matches task requirement.
- Code is understandable by team members.
```

---

## 19. AI Coding Assistant Rules

AI tools are allowed only as support.

Rules:

```text
- Generate one module at a time.
- Review generated code before committing.
- Understand every line you submit.
- Do not commit code that does not run.
- Do not ask AI to generate the entire project at once.
- Do not submit AI-generated code without team review.
```

Good AI prompt:

```text
Implement the Express.js Auth module for RealEstateHub:
- Follow Route → Controller → Service → Model.
- APIs: register, login, refresh, logout, me.
- Use bcrypt and JWT.
- Refresh token stored in HttpOnly cookie.
- Use standard response: success, message, data/errors.
- Include role and blocked user checks.
```

---

## 20. Definition of Done

A task is done only when:

```text
- Code is implemented.
- Code runs locally.
- Feature matches SRS/HLD/LLD.
- Validation is implemented.
- Error handling is implemented.
- API response follows standard format.
- Role permission is checked if needed.
- UI is responsive if frontend.
- Feature is tested.
- No real secrets are committed.
- Pull Request is reviewed.
- Documentation is updated if needed.
```

---

## 21. Final Pre-Submission Rules

Before final submission:

```text
- main branch must be stable.
- README must be complete.
- .env.example files must exist.
- No .env file is committed.
- Frontend live URL works.
- Backend health endpoint works.
- Database seed data exists.
- Register/login work.
- Property CRUD works.
- Admin approval works.
- Upload/map/contact/chat are tested or backup demo is ready.
- Report and slides are ready.
```

---

## 22. Conclusion

These coding rules ensure that RealEstateHub is developed in a consistent, secure, and maintainable way.

The most important rules are:

```text
- Follow Route → Controller → Service → Model.
- Use standard API responses.
- Validate all inputs.
- Protect routes with auth and role middleware.
- Never commit secrets.
- Keep frontend components reusable.
- Test before opening Pull Requests.
- Understand all code before defending it.
```
