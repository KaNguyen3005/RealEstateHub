# Low-Level Design Documents  
## Project: RealEstateHub – Mini Real Estate Marketplace

---

# Revision Notes

This revised LLD updates the previous version based on review feedback. The main improvements are:

- Added missing Auth API contracts: refresh token, logout, and current user.
- Clarified page reload authentication flow with HttpOnly refresh cookie.
- Changed Server Action environment variable from `NEXT_PUBLIC_API_URL` to `BACKEND_API_URL`.
- Strengthened Mongoose validation for `price`, `area`, and `images`.
- Changed Compare Store from storing full `Property[]` to storing `propertyIds: string[]`.
- Improved Create Conversation security by deriving `sellerId` from `property.ownerId` instead of trusting client input.
- Added Socket.io authentication design.
- Added Multer upload middleware design.
- Added missing Admin API contracts.
- Added clearer response contract for Contact Request API.

---

# LLD-00. Document Overview

## 1. Purpose

This Low-Level Design describes the implementation-level design for **RealEstateHub**. It expands the High-Level Design into detailed modules, database schemas, API contracts, frontend component design, service logic, validation rules, and implementation workflows.

This document is intended to guide the implementation team during coding, testing, deployment, and final project reporting.

---

## 2. LLD Document Structure

| LLD File | Name | Main Responsibility |
|---|---|---|
| LLD-01 | Frontend Design | Pages, components, state, validation, Server Action |
| LLD-02 | Backend Design | Routes, controllers, services, middleware |
| LLD-03 | Database Design | Mongoose schemas, indexes, relationships |
| LLD-04 | API Design | Request/response contracts |
| LLD-05 | Authentication & Authorization | JWT, refresh token, role middleware |
| LLD-06 | Property Module | Property CRUD, search, filter, approval |
| LLD-07 | Chat Module | Socket.io authentication, conversations, messages |
| LLD-08 | Upload & Map Module | Multer, Cloudinary upload, Leaflet map |
| LLD-09 | Admin Module | User management, property approval, dashboard |
| LLD-10 | Error Handling, Logging, Testing, Deployment | Error format, health check, test cases, deployment |

---

# LLD-01. Frontend Design

## 1. Technology

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Form | React Hook Form |
| Validation | Zod |
| State | Zustand |
| Realtime | Socket.io Client |
| Map | React Leaflet |

---

## 2. Frontend Folder Structure

```text
frontend/
  app/
    layout.tsx
    page.tsx
    properties/
      page.tsx
      [id]/
        page.tsx
        actions.ts
    compare/
      page.tsx
    login/
      page.tsx
    register/
      page.tsx
    profile/
      page.tsx
    favorites/
      page.tsx
    chat/
      page.tsx
    dashboard/
      layout.tsx
      page.tsx
      properties/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
    admin/
      layout.tsx
      page.tsx
      users/
        page.tsx
      properties/
        page.tsx
      contact-requests/
        page.tsx

  components/
    common/
      Navbar.tsx
      Footer.tsx
      LoadingSpinner.tsx
      EmptyState.tsx
      ConfirmDialog.tsx
    property/
      PropertyCard.tsx
      PropertyGrid.tsx
      PropertyFilter.tsx
      PropertyGallery.tsx
      PropertyMap.tsx
      PropertyForm.tsx
      CompareTable.tsx
      ContactRequestForm.tsx
    auth/
      LoginForm.tsx
      RegisterForm.tsx
      ProtectedRoute.tsx
    chat/
      ChatWindow.tsx
      ConversationList.tsx
      MessageBubble.tsx
      ChatInput.tsx
    admin/
      AdminStatsCards.tsx
      PropertyApprovalTable.tsx
      UserManagementTable.tsx
      ContactRequestTable.tsx

  lib/
    api.ts
    socket.ts
    auth.ts
    validations/
      auth.schema.ts
      property.schema.ts
      contact.schema.ts

  store/
    authStore.ts
    compareStore.ts
    favoriteStore.ts

  types/
    user.ts
    property.ts
    chat.ts
    api.ts
```

---

## 3. Frontend Type Definitions

### 3.1 User Type

```ts
export type UserRole = "admin" | "seller" | "user";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  status: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
}
```

---

### 3.2 Property Type

```ts
export type PropertyType = "apartment" | "house" | "land" | "villa" | "office";
export type PropertyPurpose = "sale" | "rent";
export type PropertyStatus = "pending" | "approved" | "rejected" | "hidden";

export interface Property {
  _id: string;
  title: string;
  description: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  city: string;
  district?: string;
  ward?: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  ownerId: User;
  status: PropertyStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

### 3.3 API Response Type

```ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
```

---

## 4. Frontend Store Design

### 4.1 Auth Store

File:

```text
store/authStore.ts
```

State:

```ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}
```

Main logic:

```text
- Store current user after login.
- Store access token in memory/global state.
- Clear user and token after logout.
- On page reload, restore authentication by using refresh cookie flow.
```

Reload authentication flow:

```text
1. Page reloads.
2. Access token stored in memory/Zustand is lost.
3. Frontend calls POST /api/auth/refresh.
4. Backend reads refresh token from HttpOnly cookie.
5. If refresh token is valid, backend returns a new access token.
6. Frontend stores the new access token in authStore.
7. Frontend calls GET /api/auth/me using the new access token.
8. Frontend restores current user information.
```

---

### 4.2 Compare Store

File:

```text
store/compareStore.ts
```

State:

```ts
interface CompareState {
  propertyIds: string[];
  addToCompare: (propertyId: string) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
}
```

Rules:

```text
- Maximum 3 properties can be compared.
- Duplicate property ID cannot be added.
- Compare list may be persisted in localStorage.
- The /compare page fetches latest property details by property IDs.
```

Reason for storing IDs instead of full objects:

```text
Storing full Property objects can cause stale data if price, status, or property information changes. Storing IDs keeps the compare state lightweight and allows the compare page to fetch the latest data.
```

---

### 4.3 Favorite Store

File:

```text
store/favoriteStore.ts
```

State:

```ts
interface FavoriteState {
  favoriteIds: string[];
  setFavorites: (ids: string[]) => void;
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
}
```

---

## 5. Frontend Validation Design

### 5.1 Register Form Schema

File:

```text
lib/validations/auth.schema.ts
```

```ts
import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    role: z.enum(["user", "seller"]),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password confirmation does not match",
    path: ["confirmPassword"]
  });
```

---

### 5.2 Login Form Schema

```ts
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
```

---

### 5.3 Property Form Schema

File:

```text
lib/validations/property.schema.ts
```

```ts
export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: z.enum(["apartment", "house", "land", "villa", "office"]),
  purpose: z.enum(["sale", "rent"]),
  price: z.coerce.number().positive("Price must be greater than 0"),
  area: z.coerce.number().positive("Area must be greater than 0"),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().optional(),
  ward: z.string().optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1, "At least one image is required").max(10)
});
```

---

### 5.4 Contact Request Schema

File:

```text
lib/validations/contact.schema.ts
```

```ts
export const contactRequestSchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(9, "Phone number is invalid"),
  message: z.string().min(10, "Message must be at least 10 characters")
});
```

---

## 6. Frontend Page Design

### 6.1 Home Page

Route:

```text
/
```

Components:

```text
- HeroSection
- SearchBox
- FeaturedPropertySection
- PropertyTypeSection
- WhyChooseUsSection
```

Data source:

```text
GET /api/properties?limit=6
```

Rendering:

```text
SSG or ISR
```

Note:

```text
The backend public property API already forces status = approved, so the frontend does not need to send status=approved.
```

---

### 6.2 Property Listing Page

Route:

```text
/properties
```

Components:

```text
- PropertyFilter
- PropertyGrid
- PropertyCard
- Pagination
- PropertyMap
```

Query params:

```text
keyword
city
type
purpose
minPrice
maxPrice
minArea
maxArea
page
limit
```

Flow:

```text
1. User opens /properties.
2. Frontend reads query params.
3. Frontend calls GET /api/properties.
4. Backend returns paginated approved properties.
5. Frontend renders cards and map markers.
```

---

### 6.3 Property Detail Page

Route:

```text
/properties/[id]
```

Components:

```text
- PropertyGallery
- PropertyInfo
- SellerInfoCard
- FavoriteButton
- CompareButton
- PropertyMap
- ContactRequestForm
- StartChatButton
```

Data source:

```text
GET /api/properties/:id
```

---

### 6.4 Compare Page

Route:

```text
/compare
```

Components:

```text
- CompareTable
- EmptyState
```

Flow:

```text
1. User adds property IDs to compareStore.
2. User opens /compare.
3. Frontend reads propertyIds from compareStore.
4. Frontend calls GET /api/properties/compare?ids=id1,id2,id3.
5. Backend returns latest property details.
6. Frontend displays comparison table.
```

---

### 6.5 Seller Dashboard

Routes:

```text
/dashboard
/dashboard/properties
/dashboard/properties/new
/dashboard/properties/[id]/edit
```

Components:

```text
- SellerStatsCards
- SellerPropertyTable
- PropertyForm
- ImageUploadBox
```

Rules:

```text
- Seller can only see own properties.
- Seller can only update or delete own properties.
- New property status is pending.
- If seller updates an approved property, the status may return to pending for admin review.
```

---

### 6.6 Admin Dashboard

Routes:

```text
/admin
/admin/users
/admin/properties
/admin/contact-requests
```

Components:

```text
- AdminStatsCards
- UserManagementTable
- PropertyApprovalTable
- ContactRequestTable
```

Admin actions:

```text
- Approve property
- Reject property
- Hide property
- Update user role
- Block or activate user
- View contact requests
```

---

## 7. Server Action Design

### 7.1 Contact Request Server Action

File:

```text
app/properties/[id]/actions.ts
```

Responsibility:

```text
- Receive FormData from contact request form.
- Validate data using Zod.
- Send POST request to backend.
- Return success or error state to page.
```

Important environment variable rule:

```text
Because Server Actions run on the server side, they should use BACKEND_API_URL instead of NEXT_PUBLIC_API_URL.
NEXT_PUBLIC_API_URL is used only by client components and is exposed to the browser.
```

Pseudo-code:

```ts
"use server";

import { contactRequestSchema } from "@/lib/validations/contact.schema";

export async function submitContactRequest(formData: FormData) {
  const rawData = {
    propertyId: formData.get("propertyId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message")
  };

  const validated = contactRequestSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors
    };
  }

  const response = await fetch(`${process.env.BACKEND_API_URL}/api/contact-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(validated.data),
    cache: "no-store"
  });

  return await response.json();
}
```

---

# LLD-02. Backend Design

## 1. Backend Architecture

The backend uses a layered MVC-style architecture:

```text
Route → Controller → Service → Model → Database
```

---

## 2. Backend Folder Structure

```text
backend/
  src/
    config/
      db.js
      cloudinary.js
      socket.js
    models/
      User.js
      Property.js
      Favorite.js
      Conversation.js
      Message.js
      ContactRequest.js
    routes/
      auth.routes.js
      property.routes.js
      favorite.routes.js
      upload.routes.js
      chat.routes.js
      contactRequest.routes.js
      admin.routes.js
      health.routes.js
    controllers/
      auth.controller.js
      property.controller.js
      favorite.controller.js
      upload.controller.js
      chat.controller.js
      contactRequest.controller.js
      admin.controller.js
      health.controller.js
    services/
      auth.service.js
      property.service.js
      favorite.service.js
      upload.service.js
      chat.service.js
      contactRequest.service.js
      admin.service.js
    middlewares/
      auth.middleware.js
      role.middleware.js
      validate.middleware.js
      upload.middleware.js
      error.middleware.js
    utils/
      generateToken.js
      apiResponse.js
      asyncHandler.js
      logger.js
    seed/
      seedUsers.js
      seedProperties.js
    server.js
```

---

## 3. Server Initialization

File:

```text
src/server.js
```

Responsibilities:

```text
- Load environment variables.
- Connect MongoDB.
- Initialize Express app.
- Configure CORS with credentials.
- Configure JSON parser.
- Configure cookie parser.
- Register routes.
- Register error middleware.
- Initialize Socket.io server.
- Start HTTP server.
```

Pseudo-code:

```js
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { initializeSocket } from "./config/socket.js";

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/conversations", chatRoutes);
app.use("/api/contact-requests", contactRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);

app.use(errorMiddleware);

initializeSocket(server);

server.listen(process.env.PORT || 5000);
```

---

## 4. Middleware Design

### 4.1 Auth Middleware

File:

```text
middlewares/auth.middleware.js
```

Responsibility:

```text
- Read access token from Authorization header.
- Verify JWT.
- Attach user to request object.
- Reject request if token is missing or invalid.
- Reject blocked users.
```

Pseudo-code:

```js
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  const user = await User.findById(payload.userId).select("-passwordHash -refreshToken");

  if (!user || user.status === "blocked") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  req.user = user;
  next();
};
```

---

### 4.2 Optional Auth Middleware

File:

```text
middlewares/auth.middleware.js
```

Purpose:

```text
Used for routes that can be accessed by both guests and logged-in users, such as POST /api/contact-requests.
If a valid token exists, attach req.user. If no token exists, continue as guest.
```

Pseudo-code:

```js
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.userId).select("-passwordHash -refreshToken");

    if (user && user.status !== "blocked") {
      req.user = user;
    }

    next();
  } catch {
    next();
  }
};
```

---

### 4.3 Role Middleware

File:

```text
middlewares/role.middleware.js
```

Pseudo-code:

```js
export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden"
      });
    }

    next();
  };
};
```

---

### 4.4 Validation Middleware

File:

```text
middlewares/validate.middleware.js
```

Pseudo-code:

```js
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.flatten().fieldErrors
      });
    }

    req.body = result.data;
    next();
  };
};
```

---

### 4.5 Upload Middleware

File:

```text
middlewares/upload.middleware.js
```

Technology:

```text
Multer memory storage
```

Rules:

```text
- Accept field name: images.
- Maximum number of files: 10.
- Maximum size: 5MB per file.
- Allowed MIME types: image/jpeg, image/png, image/webp.
```

Pseudo-code:

```js
import multer from "multer";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const uploadPropertyImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid image type"));
    }

    cb(null, true);
  }
}).array("images", 10);
```

---

### 4.6 Error Middleware

File:

```text
middlewares/error.middleware.js
```

Response format:

```json
{
  "success": false,
  "message": "Internal server error"
}
```

Rules:

```text
- Do not expose stack trace in production.
- Return validation errors using standard format.
- Log server errors without sensitive data.
```

---

# LLD-03. Database Design

## 1. User Schema

File:

```text
models/User.js
```

```js
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    role: {
      type: String,
      enum: ["admin", "seller", "user"],
      default: "user"
    },
    avatar: {
      type: String
    },
    refreshToken: {
      type: String
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active"
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
```

---

## 2. Property Schema

File:

```text
models/Property.js
```

```js
const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5
    },
    description: {
      type: String,
      required: true,
      minlength: 20
    },
    type: {
      type: String,
      enum: ["apartment", "house", "land", "villa", "office"],
      required: true
    },
    purpose: {
      type: String,
      enum: ["sale", "rent"],
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 1
    },
    area: {
      type: Number,
      required: true,
      min: 1
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: String,
    ward: String,
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1 && arr.length <= 10,
        message: "Property must have between 1 and 10 images"
      }
    },
    amenities: [
      {
        type: String
      }
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "hidden"],
      default: "pending"
    }
  },
  { timestamps: true }
);

propertySchema.index({ status: 1, city: 1, purpose: 1, type: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ area: 1 });
propertySchema.index({
  title: "text",
  description: "text",
  address: "text"
});
```

---

## 3. Favorite Schema

File:

```text
models/Favorite.js
```

```js
const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    }
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });
```

---

## 4. Conversation Schema

File:

```text
models/Conversation.js
```

```js
const conversationSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],
    lastMessage: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

conversationSchema.index({ propertyId: 1 });
conversationSchema.index({ participants: 1 });
conversationSchema.index({ propertyId: 1, participants: 1 });
```

---

## 5. Message Schema

File:

```text
models/Message.js
```

```js
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });
```

---

## 6. Contact Request Schema

File:

```text
models/ContactRequest.js
```

```js
const contactRequestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      minlength: 10
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new"
    }
  },
  { timestamps: true }
);

contactRequestSchema.index({ propertyId: 1, createdAt: -1 });
contactRequestSchema.index({ status: 1 });
```

---

# LLD-04. API Design

## 1. Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {}
}
```

---

## 2. Auth APIs

### 2.1 Register

```text
POST /api/auth/register
```

Role:

```text
Guest
```

Request:

```json
{
  "fullName": "Nguyen Van A",
  "email": "a@example.com",
  "phone": "0909000000",
  "role": "seller",
  "password": "12345678"
}
```

Success response:

```json
{
  "success": true,
  "message": "Register successfully"
}
```

Business rules:

```text
- Email must be unique.
- Password must be hashed before saving.
- Role can only be user or seller from public registration.
- Admin account is created by seed script.
```

---

### 2.2 Login

```text
POST /api/auth/login
```

Role:

```text
Guest
```

Request:

```json
{
  "email": "a@example.com",
  "password": "12345678"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "user": {
      "_id": "userId",
      "fullName": "Nguyen Van A",
      "email": "a@example.com",
      "role": "seller"
    },
    "accessToken": "jwt_access_token"
  }
}
```

Business rules:

```text
- Email must exist.
- Password must match hashed password.
- Blocked users cannot login.
- Refresh token is set as HttpOnly cookie.
```

---

### 2.3 Refresh Token

```text
POST /api/auth/refresh
```

Role:

```text
Valid refresh cookie
```

Request:

```text
No body required.
Refresh token is read from HttpOnly cookie.
```

Response:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_access_token"
  }
}
```

Business rules:

```text
- Refresh token must exist in HttpOnly cookie.
- Refresh token must be valid and not expired.
- Refresh token must match stored token if refresh token persistence is enabled.
- Blocked users cannot refresh token.
```

---

### 2.4 Logout

```text
POST /api/auth/logout
```

Role:

```text
Authenticated user or valid refresh cookie
```

Request:

```text
No body required.
```

Response:

```json
{
  "success": true,
  "message": "Logout successfully"
}
```

Business rules:

```text
- Clear refresh token cookie.
- Remove refresh token from database if stored.
```

---

### 2.5 Get Current User

```text
GET /api/auth/me
```

Role:

```text
Authenticated user
```

Response:

```json
{
  "success": true,
  "message": "Current user retrieved successfully",
  "data": {
    "user": {
      "_id": "userId",
      "fullName": "Nguyen Van A",
      "email": "a@example.com",
      "role": "seller",
      "status": "active"
    }
  }
}
```

Business rules:

```text
- Access token must be valid.
- Blocked users cannot access this endpoint.
- Do not return passwordHash or refreshToken.
```

---

## 3. Property APIs

### 3.1 Get Properties

```text
GET /api/properties
```

Query params:

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

Response:

```json
{
  "success": true,
  "message": "Properties retrieved successfully",
  "data": {
    "items": [],
    "page": 1,
    "limit": 10,
    "totalItems": 100,
    "totalPages": 10
  }
}
```

Service logic:

```text
1. Build query object.
2. Force status = approved for public route.
3. Apply keyword text search if keyword exists.
4. Apply price and area range filters.
5. Apply pagination.
6. Populate owner basic info.
7. Return paginated result.
```

---

### 3.2 Get Property Detail

```text
GET /api/properties/:id
```

Role:

```text
Public
```

Business rules:

```text
- Public users can only view approved properties.
- Admin can view any property status.
- Seller can view own property regardless of status.
```

---

### 3.3 Get Properties for Compare

```text
GET /api/properties/compare?ids=id1,id2,id3
```

Role:

```text
Public
```

Response:

```json
{
  "success": true,
  "message": "Compare properties retrieved successfully",
  "data": {
    "items": []
  }
}
```

Business rules:

```text
- Accept maximum 3 property IDs.
- Only approved properties are returned for public users.
- Invalid or hidden properties are ignored or returned as not found.
```

---

### 3.4 Create Property

```text
POST /api/properties
```

Role:

```text
Seller/Admin
```

Request:

```json
{
  "title": "Modern Apartment in District 1",
  "description": "A beautiful apartment near city center...",
  "type": "apartment",
  "purpose": "rent",
  "price": 12000000,
  "area": 65,
  "bedrooms": 2,
  "bathrooms": 2,
  "address": "District 1, Ho Chi Minh City",
  "city": "Ho Chi Minh",
  "district": "District 1",
  "ward": "Ben Nghe",
  "latitude": 10.7769,
  "longitude": 106.7009,
  "images": ["https://cloudinary.com/image1.jpg"],
  "amenities": ["parking", "balcony", "security"]
}
```

Service logic:

```text
1. Validate input.
2. Check user role.
3. Create property with ownerId = req.user._id.
4. Set status = pending by default.
5. Save property.
6. Return created property.
```

---

### 3.5 Update Property

```text
PUT /api/properties/:id
```

Business rules:

```text
- Seller can update only own property.
- Admin can update any property.
- After seller updates an approved property, status may return to pending.
```

---

### 3.6 Delete Property

```text
DELETE /api/properties/:id
```

Business rules:

```text
- Seller can delete only own property.
- Admin can delete any property.
```

---

## 4. Favorite APIs

### 4.1 Add Favorite

```text
POST /api/favorites/:propertyId
```

Role:

```text
Authenticated user
```

Service logic:

```text
1. Check property exists.
2. Check property is approved.
3. Create favorite with userId and propertyId.
4. If duplicate, return 409 Conflict.
```

---

### 4.2 Remove Favorite

```text
DELETE /api/favorites/:propertyId
```

Role:

```text
Authenticated user
```

---

### 4.3 Get My Favorites

```text
GET /api/favorites/me
```

Role:

```text
Authenticated user
```

---

## 5. Contact Request APIs

### 5.1 Create Contact Request

```text
POST /api/contact-requests
```

Role:

```text
Guest/User
```

Request:

```json
{
  "propertyId": "propertyId",
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "phone": "0909000000",
  "message": "I want to know more about this property."
}
```

Response:

```json
{
  "success": true,
  "message": "Contact request submitted successfully",
  "data": {
    "_id": "contactRequestId",
    "status": "new"
  }
}
```

Business rules:

```text
- Guest and logged-in user can submit request.
- If logged-in, userId is attached.
- Request status is new by default.
- Property must exist and be approved.
```

---

### 5.2 Get My Contact Requests

```text
GET /api/contact-requests/me
```

Role:

```text
Authenticated user
```

---

## 6. Chat APIs

### 6.1 Create Conversation

```text
POST /api/conversations
```

Role:

```text
Authenticated user
```

Request:

```json
{
  "propertyId": "propertyId"
}
```

Service logic:

```text
1. Check property exists and is approved.
2. Get sellerId from property.ownerId.
3. Prevent user from chatting with themselves if buyer is the seller.
4. Check existing conversation between buyer, seller, and property.
5. If exists, return existing conversation.
6. Otherwise create conversation with participants = [buyerId, sellerId].
```

Security note:

```text
The client must not send sellerId. Backend derives sellerId from property.ownerId to prevent tampering.
```

---

### 6.2 Get My Conversations

```text
GET /api/conversations
```

Role:

```text
Authenticated user
```

Business rules:

```text
- Return only conversations where req.user._id is included in participants.
```

---

### 6.3 Get Messages

```text
GET /api/conversations/:id/messages
```

Role:

```text
Conversation participant
```

Business rules:

```text
- Only participants can view messages.
```

---

## 7. Upload APIs

### 7.1 Upload Property Images

```text
POST /api/uploads/properties
```

Role:

```text
Seller/Admin
```

Request:

```text
multipart/form-data
field name: images
```

Response:

```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "urls": [
      "https://res.cloudinary.com/demo/image/upload/image1.jpg"
    ]
  }
}
```

Business rules:

```text
- Maximum 10 images.
- Maximum 5MB per image.
- Only JPEG, PNG, and WEBP are allowed.
- Return Cloudinary secure URLs.
```

---

## 8. Admin APIs

### 8.1 Get Admin Stats

```text
GET /api/admin/stats
```

Role:

```text
Admin
```

Response:

```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalProperties": 50,
    "pendingProperties": 8,
    "approvedProperties": 30,
    "totalConversations": 20
  }
}
```

---

### 8.2 Get Users

```text
GET /api/admin/users
```

Role:

```text
Admin
```

Query params:

```text
keyword
role
status
page
limit
```

---

### 8.3 Update User Role

```text
PATCH /api/admin/users/:id/role
```

Role:

```text
Admin
```

Request:

```json
{
  "role": "seller"
}
```

Business rules:

```text
- Role must be admin, seller, or user.
- Prevent admin from accidentally removing the last admin account if this rule is implemented.
```

---

### 8.4 Update User Status

```text
PATCH /api/admin/users/:id/status
```

Role:

```text
Admin
```

Request:

```json
{
  "status": "blocked"
}
```

Business rules:

```text
- Status must be active or blocked.
- Blocked users cannot login, refresh token, create properties, favorite properties, or send messages.
```

---

### 8.5 Get Pending Properties

```text
GET /api/admin/properties/pending
```

Role:

```text
Admin
```

---

### 8.6 Approve Property

```text
PATCH /api/admin/properties/:id/approve
```

Role:

```text
Admin
```

Logic:

```text
1. Check admin role.
2. Find property by id.
3. Set status = approved.
4. Save property.
```

---

### 8.7 Reject Property

```text
PATCH /api/admin/properties/:id/reject
```

Role:

```text
Admin
```

Request:

```json
{
  "reason": "Invalid property information"
}
```

---

### 8.8 Hide Property

```text
PATCH /api/admin/properties/:id/hide
```

Role:

```text
Admin
```

---

### 8.9 Get Contact Requests

```text
GET /api/admin/contact-requests
```

Role:

```text
Admin
```

Query params:

```text
status
propertyId
page
limit
```

---

# LLD-05. Authentication & Authorization Design

## 1. Token Design

| Token | Storage | Expiration | Purpose |
|---|---|---|---|
| Access Token | Frontend memory/Zustand | Short | Access protected APIs |
| Refresh Token | HttpOnly Cookie | Long | Issue new access token |

---

## 2. JWT Payload

```json
{
  "userId": "userId",
  "role": "seller"
}
```

---

## 3. Login Flow

```text
1. User submits login form.
2. Backend checks email.
3. Backend compares password with bcrypt.
4. Backend creates access token and refresh token.
5. Backend saves refresh token or refresh token hash depending on MVP scope.
6. Backend sets refresh token in HttpOnly cookie.
7. Backend returns access token and user info.
8. Frontend stores access token in authStore.
```

---

## 4. Page Reload Authentication Flow

```text
1. Page reloads.
2. Access token stored in memory/Zustand is lost.
3. Frontend calls POST /api/auth/refresh.
4. Backend reads refresh token from HttpOnly cookie.
5. Backend verifies refresh token.
6. Backend returns a new access token.
7. Frontend stores new access token in authStore.
8. Frontend calls GET /api/auth/me.
9. Backend returns current user information.
10. Frontend restores authenticated state.
```

---

## 5. Refresh Flow

```text
1. Frontend receives 401 from API.
2. Frontend calls POST /api/auth/refresh.
3. Backend reads refresh token from HttpOnly cookie.
4. Backend verifies refresh token.
5. Backend creates new access token.
6. Frontend retries previous request with new access token.
```

---

## 6. Authorization Rules

| Feature | Guest | User | Seller | Admin |
|---|---|---|---|---|
| View properties | Yes | Yes | Yes | Yes |
| Submit contact request | Yes | Yes | Yes | Yes |
| Favorite property | No | Yes | Yes | Optional |
| Compare property | Yes | Yes | Yes | Yes |
| Create property | No | No | Yes | Yes |
| Update own property | No | No | Yes | Yes |
| Approve property | No | No | No | Yes |
| Manage users | No | No | No | Yes |
| Chat | No | Yes | Yes | Yes |

Note:

```text
Admin favorite is optional. For MVP, the system may allow any authenticated user to favorite properties, including admin.
```

---

# LLD-06. Property Module Design

## 1. Route Design

File:

```text
routes/property.routes.js
```

```js
router.get("/", propertyController.getProperties);
router.get("/compare", propertyController.getPropertiesForCompare);
router.get("/:id", propertyController.getPropertyById);
router.post("/", protect, allowRoles("seller", "admin"), propertyController.createProperty);
router.put("/:id", protect, allowRoles("seller", "admin"), propertyController.updateProperty);
router.delete("/:id", protect, allowRoles("seller", "admin"), propertyController.deleteProperty);
router.patch("/:id/status", protect, allowRoles("admin"), propertyController.updatePropertyStatus);
```

Important route order:

```text
/compare must be defined before /:id to avoid treating "compare" as a property ID.
```

---

## 2. Controller Design

File:

```text
controllers/property.controller.js
```

Functions:

```text
getProperties(req, res)
getPropertiesForCompare(req, res)
getPropertyById(req, res)
createProperty(req, res)
updateProperty(req, res)
deleteProperty(req, res)
updatePropertyStatus(req, res)
```

Controller responsibility:

```text
- Read request params/body/query.
- Call service.
- Return standard response.
- Do not contain complex business logic.
```

---

## 3. Service Design

File:

```text
services/property.service.js
```

Functions:

```text
getProperties(query)
getPropertiesForCompare(ids)
getPropertyById(id, currentUser)
createProperty(userId, payload)
updateProperty(user, propertyId, payload)
deleteProperty(user, propertyId)
updatePropertyStatus(propertyId, status)
```

---

## 4. Search Query Builder

Pseudo-code:

```js
function buildPropertyQuery(query) {
  const filter = {
    status: "approved"
  };

  if (query.city) filter.city = query.city;
  if (query.district) filter.district = query.district;
  if (query.type) filter.type = query.type;
  if (query.purpose) filter.purpose = query.purpose;

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.minArea || query.maxArea) {
    filter.area = {};
    if (query.minArea) filter.area.$gte = Number(query.minArea);
    if (query.maxArea) filter.area.$lte = Number(query.maxArea);
  }

  if (query.keyword) {
    filter.$text = {
      $search: query.keyword
    };
  }

  return filter;
}
```

---

## 5. Property Ownership Check

Pseudo-code:

```js
function canModifyProperty(user, property) {
  if (user.role === "admin") {
    return true;
  }

  return property.ownerId.toString() === user._id.toString();
}
```

---

# LLD-07. Realtime Chat Module Design

## 1. Socket.io Design

File:

```text
config/socket.js
```

Events:

| Event | Direction | Description |
|---|---|---|
| join_conversation | Client → Server | Join room by conversationId |
| send_message | Client → Server | Send message to room |
| receive_message | Server → Client | Receive new message |
| typing | Client → Server | Notify typing |
| message_read | Client → Server | Mark message as read |

---

## 2. Socket Authentication

Socket.io connections must be authenticated.

Client connection example:

```ts
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  auth: {
    token: accessToken
  }
});
```

Server middleware pseudo-code:

```js
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.userId).select("-passwordHash -refreshToken");

    if (!user || user.status === "blocked") {
      return next(new Error("Unauthorized"));
    }

    socket.user = {
      userId: user._id.toString(),
      role: user.role
    };

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});
```

Rules:

```text
- Connection without access token is rejected.
- Invalid token is rejected.
- Blocked user is rejected.
- socket.user is used for message authorization.
```

---

## 3. Room Design

Room name:

```text
conversation:{conversationId}
```

Example:

```text
conversation:665fd909e6a9a12b10000001
```

---

## 4. Join Conversation Flow

```text
1. Client emits join_conversation with conversationId.
2. Server checks socket.user.
3. Server checks whether socket.user.userId is included in conversation.participants.
4. If valid, socket joins conversation:{conversationId}.
5. If invalid, server returns error.
```

---

## 5. Send Message Flow

```text
1. Client emits send_message with conversationId and content.
2. Server validates socket.user.
3. Server checks whether socket.user.userId is a participant of the conversation.
4. Server validates message content.
5. Server saves message to MongoDB.
6. Server updates conversation.lastMessage.
7. Server emits receive_message to conversation room.
```

---

## 6. Message Payload

```json
{
  "conversationId": "conversationId",
  "content": "Hello, is this property still available?"
}
```

Note:

```text
senderId is not trusted from client. The server uses socket.user.userId as senderId.
```

---

## 7. Message Response

```json
{
  "_id": "messageId",
  "conversationId": "conversationId",
  "senderId": {
    "_id": "userId",
    "fullName": "Nguyen Van A"
  },
  "content": "Hello, is this property still available?",
  "isRead": false,
  "createdAt": "2026-06-09T00:00:00.000Z"
}
```

---

# LLD-08. Upload & Map Module Design

## 1. Upload Design

### 1.1 Cloudinary Config

File:

```text
config/cloudinary.js
```

Environment variables:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

### 1.2 Upload Middleware

File:

```text
middlewares/upload.middleware.js
```

Technology:

```text
Multer memory storage
```

Rules:

```text
- Accept field name images.
- Maximum 10 files.
- Maximum 5MB per file.
- Allowed MIME types: image/jpeg, image/png, image/webp.
```

Pseudo-code:

```js
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"));
    }

    cb(null, true);
  }
});
```

---

### 1.3 Upload Service

File:

```text
services/upload.service.js
```

Functions:

```text
uploadPropertyImages(files)
validateImageFile(file)
deleteImage(publicId)
```

Service logic:

```text
1. Receive files from Multer memory storage.
2. Validate total number of files.
3. Upload each file buffer to Cloudinary.
4. Collect secure URLs.
5. Return URLs to frontend.
```

---

### 1.4 Upload Route

File:

```text
routes/upload.routes.js
```

```js
router.post(
  "/properties",
  protect,
  allowRoles("seller", "admin"),
  uploadPropertyImages,
  uploadController.uploadPropertyImages
);
```

---

## 2. Map Design

### 2.1 PropertyMap Component

File:

```text
components/property/PropertyMap.tsx
```

Props:

```ts
interface PropertyMapProps {
  properties?: Property[];
  center?: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
}
```

Behavior:

```text
- If properties array exists, show multiple markers.
- If center exists, show one marker.
- Marker popup shows title, price, address, and detail link.
```

---

### 2.2 Map Data Rules

```text
- Each property must have latitude and longitude.
- Listing page can show multiple markers.
- Detail page shows one marker.
- If coordinates are missing, display fallback address text instead of map.
```

---

# LLD-09. Admin Module Design

## 1. Admin Features

```text
- View dashboard statistics
- View user list
- Update user role
- Block or activate user
- View pending properties
- Approve property
- Reject property
- Hide property
- View contact requests
```

---

## 2. Admin Route Design

File:

```text
routes/admin.routes.js
```

```js
router.use(protect);
router.use(allowRoles("admin"));

router.get("/stats", adminController.getStats);

router.get("/users", adminController.getUsers);
router.patch("/users/:id/role", adminController.updateUserRole);
router.patch("/users/:id/status", adminController.updateUserStatus);

router.get("/properties/pending", adminController.getPendingProperties);
router.patch("/properties/:id/approve", adminController.approveProperty);
router.patch("/properties/:id/reject", adminController.rejectProperty);
router.patch("/properties/:id/hide", adminController.hideProperty);

router.get("/contact-requests", adminController.getContactRequests);
```

---

## 3. Admin Stats Service

Function:

```text
getAdminStats()
```

Logic:

```text
1. Count total users.
2. Count total properties.
3. Count pending properties.
4. Count approved properties.
5. Count total conversations.
6. Count new contact requests.
7. Return statistics object.
```

---

## 4. Property Approval Logic

```text
1. Admin opens pending property table.
2. Admin clicks approve/reject/hide.
3. Frontend calls corresponding PATCH API.
4. Backend checks admin role.
5. Backend updates property status.
6. Frontend refreshes table.
```

---

## 5. User Management Logic

```text
1. Admin opens user management page.
2. Frontend calls GET /api/admin/users.
3. Admin updates role or status.
4. Backend validates role/status.
5. Backend updates user.
6. If user is blocked, future login/refresh/chat/create actions are rejected.
```

---

# LLD-10. Error Handling, Logging, Testing, Deployment

## 1. Error Handling

Common error format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

Common status codes:

| Code | Meaning | Example |
|---|---|---|
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing token |
| 403 | Forbidden | Wrong role |
| 404 | Not Found | Property not found |
| 409 | Conflict | Duplicate favorite |
| 500 | Server Error | Unexpected error |

---

## 2. Logging

The backend logs:

```text
- Request method
- Request URL
- Status code
- Response time
- Error message
```

The backend must not log:

```text
- Password
- Access token
- Refresh token
- Cloudinary secret
- MongoDB URI
```

---

## 3. Health Check

Endpoint:

```text
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "RealEstateHub API is running",
  "timestamp": "2026-06-09T00:00:00.000Z"
}
```

---

## 4. Suggested Backend Test Cases

| Test Case | Module | Expected Result |
|---|---|---|
| Register with valid data | Auth | User created |
| Register with duplicate email | Auth | 409 Conflict |
| Login with correct password | Auth | Return access token |
| Refresh token with valid cookie | Auth | Return new access token |
| Get current user with token | Auth | Return user info |
| Create property as seller | Property | Property created with pending status |
| Create property as user | Property | 403 Forbidden |
| Create property with price 0 | Property | 400 Bad Request |
| Create property without images | Property | 400 Bad Request |
| Add duplicate favorite | Favorite | 409 Conflict |
| Get approved properties | Property | Only approved properties returned |
| Create conversation with propertyId | Chat | Seller derived from property.ownerId |
| Send chat message without socket token | Chat | Socket rejected |
| Approve property as admin | Admin | Status becomes approved |
| Submit contact request | Contact | Request created |
| Upload invalid file type | Upload | 400 Bad Request |

---

## 5. Deployment Checklist

Frontend:

```text
- Deploy to Vercel.
- Set NEXT_PUBLIC_API_URL.
- Set NEXT_PUBLIC_SOCKET_URL.
- Set BACKEND_API_URL for Server Actions.
- Check build success.
```

Backend:

```text
- Deploy to Render or Railway.
- Set MongoDB Atlas URI.
- Set JWT secrets.
- Set Cloudinary credentials.
- Set CLIENT_URL.
- Check /api/health.
```

Database:

```text
- Create MongoDB Atlas cluster.
- Configure database user.
- Configure network access.
- Run seed script.
```

Final demo checklist:

```text
- Register works.
- Login works.
- Refresh token works after reload.
- Property listing works.
- Search/filter works.
- Property detail works.
- Upload image works.
- Map works.
- Chat works with Socket authentication.
- Admin approval works.
- Contact request Server Action works.
- Live link works.
```

---

# Appendix A. Recommended Implementation Order

```text
1. Create backend project structure.
2. Connect MongoDB.
3. Implement User and Auth.
4. Implement refresh/logout/me APIs.
5. Implement Property schema and CRUD.
6. Implement frontend layout and routing.
7. Connect property listing page to backend.
8. Implement login/register UI.
9. Implement reload auth flow.
10. Implement seller dashboard.
11. Implement Multer + Cloudinary image upload.
12. Implement map.
13. Implement favorites.
14. Implement compare using propertyIds.
15. Implement contact request Server Action.
16. Implement conversation creation using property.ownerId.
17. Implement Socket.io authentication.
18. Implement chat realtime.
19. Implement admin dashboard and admin APIs.
20. Add seed data.
21. Add tests.
22. Deploy frontend, backend, and database.
23. Prepare report and demo.
```

---

# Appendix B. Suggested LLD File Names

```text
LLD-00-Overview.md
LLD-01-Frontend-Design.md
LLD-02-Backend-Design.md
LLD-03-Database-Design.md
LLD-04-API-Design.md
LLD-05-Auth-Authorization-Design.md
LLD-06-Property-Module.md
LLD-07-Realtime-Chat-Module.md
LLD-08-Upload-Map-Module.md
LLD-09-Admin-Module.md
LLD-10-Error-Testing-Deployment.md
```
