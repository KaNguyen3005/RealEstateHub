# Software Requirements Specification  
## Project: RealEstateHub – Mini Real Estate Marketplace

---

## 1. Introduction

### 1.1 Purpose

The purpose of this document is to define the software requirements for **RealEstateHub**, a mini real estate marketplace web application. The system allows users to search for properties, view property details, compare properties, save favorites, and communicate with sellers or administrators through realtime chat.

This SRS describes the functional requirements, non-functional requirements, user roles, system scope, data requirements, and external interfaces of the application.

### 1.2 Scope

RealEstateHub is a fullstack web application for real estate listing and consultation. The application provides a platform where sellers can post real estate listings and users can search, filter, compare, and contact sellers.

The system includes the following core features:

```text
- User registration and login
- Role-based access control
- Property listing management
- Advanced search and filtering
- Property detail page
- Property comparison
- Favorite properties
- Realtime consultation chat
- Map integration
- Image upload
- Admin management dashboard
```

The system will be developed using:

```text
Frontend: Next.js App Router, Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB with Mongoose
Realtime: Socket.io
Map: Leaflet / React Leaflet
Upload: Cloudinary
Deployment: Vercel, Render/Railway, MongoDB Atlas
```

### 1.3 Intended Audience

This document is intended for:

```text
- Project team members
- Instructor / evaluator
- Frontend developers
- Backend developers
- Testers
- Deployment maintainer
```

### 1.4 Definitions and Abbreviations

| Term | Meaning |
|---|---|
| SRS | Software Requirements Specification |
| CRUD | Create, Read, Update, Delete |
| JWT | JSON Web Token |
| API | Application Programming Interface |
| UI | User Interface |
| UX | User Experience |
| BĐS | Bất động sản / Real Estate |
| MVP | Minimum Viable Product |
| SSR | Server-Side Rendering |
| SSG | Static Site Generation |
| ISR | Incremental Static Regeneration |

---

## 2. Overall Description

### 2.1 Product Perspective

RealEstateHub is a web-based real estate marketplace. The system connects three main groups:

```text
- Buyers or renters who search for properties
- Sellers or agents who post property listings
- Administrators who manage users and listings
```

The application will consist of two main parts:

```text
1. Frontend Web Application
   - Built with Next.js App Router
   - Provides user interface and page routing

2. Backend REST API Server
   - Built with Node.js and Express.js
   - Handles business logic, authentication, database access, and realtime chat
```

### 2.2 Product Functions

The main functions of the system are:

```text
- Browse property listings
- Search and filter properties
- View property details
- Register and login
- Manage user profile
- Create property posts
- Upload property images
- Save favorite properties
- Compare multiple properties
- Chat with seller or admin
- Admin approves, rejects, hides, or deletes listings
- View dashboard statistics
- Manage property lifecycle status, including sold and rented states
```

### 2.3 User Classes and Characteristics

#### Guest

A guest is a visitor who has not logged in.

Guest can:

```text
- View homepage
- View property listing page
- Search and filter properties
- View property detail
- Register account
- Login
```

#### User / Buyer / Renter

A user is a logged-in customer looking for real estate.

User can:

```text
- View property details
- Save favorite properties
- Compare properties
- Send contact request
- Chat with seller/admin
- Manage profile
```

#### Seller / Agent

A seller is a logged-in user who can create and manage property posts.

Seller can:

```text
- Create property listing
- Upload property images
- Edit own property listing
- Delete own property listing
- View listing status
- Chat with interested users
- Mark own property as sold or rented when the workflow allows it
```

#### Admin

Admin manages the whole platform.

Admin can:

```text
- Manage users
- Manage property listings
- Approve property listings
- Reject property listings
- Hide inappropriate listings
- View dashboard statistics
```

---

## 3. System Features

## 3.1 Authentication and Authorization

### Description

The system shall allow users to register, login, logout, and access protected features based on their roles.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | The system shall allow guests to register a new account. |
| FR-02 | The system shall allow users to login using email and password. |
| FR-03 | The system shall generate JWT access token after successful login. |
| FR-04 | The system shall support refresh token for maintaining login sessions. |
| FR-05 | The system shall allow logged-in users to logout. |
| FR-06 | The system shall protect private routes using authentication middleware. |
| FR-07 | The system shall support at least three roles: Admin, Seller, and User. |
| FR-08 | The system shall restrict admin features to Admin role only. |
| FR-09 | The system shall restrict property creation to Seller and Admin roles. |

### Validation Rules

```text
- Email must be valid.
- Password must contain at least 8 characters.
- Confirm password must match password.
- User name must not be empty.
```

---

## 3.2 Property Listing Management

### Description

The system shall allow sellers to create, update, delete, and manage real estate listings.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-10 | The system shall allow sellers to create new property listings. |
| FR-11 | The system shall allow sellers to edit their own property listings. |
| FR-12 | The system shall allow sellers to delete their own property listings. |
| FR-13 | The system shall allow all users to view approved property listings. |
| FR-14 | The system shall display property details on a dynamic route page. |
| FR-15 | The system shall allow admin to approve property listings. |
| FR-16 | The system shall allow admin to reject property listings. |
| FR-17 | The system shall allow admin to hide inappropriate property listings. |
| FR-18 | The system shall support sold and rented as closed property statuses. |
| FR-19 | The system shall prevent new chat conversations for sold or rented properties. |

### Property Data Fields

```text
- Title
- Description
- Property type
- Purpose: sale or rent
- Price
- Area
- Number of bedrooms
- Number of bathrooms
- Address
- City
- District
- Ward
- Latitude
- Longitude
- Images
- Amenities
- Owner
- Status
```

### Property Status

```text
pending
approved
rejected
hidden
sold
rented
```

---

## 3.3 Search and Filter Properties

### Description

The system shall allow users to search and filter real estate listings based on different criteria.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-18 | The system shall allow users to search properties by keyword. |
| FR-19 | The system shall allow users to filter properties by city. |
| FR-20 | The system shall allow users to filter properties by property type. |
| FR-21 | The system shall allow users to filter properties by sale or rent purpose. |
| FR-22 | The system shall allow users to filter properties by price range. |
| FR-23 | The system shall allow users to filter properties by area range. |
| FR-24 | The system shall support pagination on the property listing page. |

### Example Filters

```text
city = Ho Chi Minh
type = apartment
purpose = rent
minPrice = 5000000
maxPrice = 15000000
minArea = 30
maxArea = 100
```

---

## 3.4 Property Detail Page

### Description

The system shall provide a detailed page for each property.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-25 | The system shall display property title, images, price, area, address, and description. |
| FR-26 | The system shall display property amenities. |
| FR-27 | The system shall display seller information. |
| FR-28 | The system shall display property location on a map. |
| FR-29 | The system shall allow logged-in users to start a chat from the property detail page. |
| FR-30 | The system shall allow logged-in users to add the property to favorites. |
| FR-31 | The system shall disable or block chat actions when the property is sold or rented. |

---

## 3.5 Property Comparison

### Description

The system shall allow users to compare 2 or 3 properties side by side.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-31 | The system shall allow users to select properties for comparison. |
| FR-32 | The system shall allow users to compare up to 3 properties. |
| FR-33 | The system shall display compared properties in a table. |
| FR-34 | The comparison table shall include price, area, address, bedrooms, bathrooms, type, and amenities. |

### Comparison Fields

| Field | Property A | Property B | Property C |
|---|---|---|---|
| Price | Yes | Yes | Yes |
| Area | Yes | Yes | Yes |
| Location | Yes | Yes | Yes |
| Bedrooms | Yes | Yes | Yes |
| Bathrooms | Yes | Yes | Yes |
| Amenities | Yes | Yes | Yes |

---

## 3.6 Favorite Properties

### Description

The system shall allow users to save properties to a favorite list.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-35 | The system shall allow logged-in users to add a property to favorites. |
| FR-36 | The system shall allow logged-in users to remove a property from favorites. |
| FR-37 | The system shall display all favorite properties in the user profile page. |
| FR-38 | The system shall prevent duplicate favorite records for the same user and property. |

---

## 3.7 Realtime Chat Consultation

### Description

The system shall allow users to chat with sellers or administrators in realtime.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-39 | The system shall allow users to start a conversation from a property detail page. |
| FR-40 | The system shall allow users and sellers to send realtime messages. |
| FR-41 | The system shall store chat messages in the database. |
| FR-42 | The system shall display chat history. |
| FR-43 | The system shall support message timestamps. |
| FR-44 | The system shall show typing indicator if possible. |
| FR-45 | The system shall block creating conversations and sending messages for closed properties. |

### Socket Events

```text
join_conversation
send_message
receive_message
typing
message_read
```

---

## 3.8 Image Upload

### Description

The system shall allow sellers to upload images when creating or editing property listings.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-45 | The system shall allow sellers to upload multiple property images. |
| FR-46 | The system shall store uploaded images using Cloudinary. |
| FR-47 | The system shall save image URLs in the property record. |
| FR-48 | The system shall allow image preview before submission. |
| FR-49 | The system shall validate image type and size. |

### Validation Rules

```text
- Only JPG, JPEG, PNG, WEBP are allowed.
- Maximum image size: 5MB per image.
- Maximum number of images: 10 images per property.
```

---

## 3.9 Map Integration

### Description

The system shall show property location on an interactive map.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-50 | The system shall display property markers on the listing map. |
| FR-51 | The system shall display property location on the detail page map. |
| FR-52 | The system shall show marker popup with property title and price. |
| FR-53 | The system shall allow users to open the property detail page from a map popup. |

---

## 3.10 Admin Dashboard

### Description

The system shall provide an admin dashboard for managing platform data.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-54 | The system shall display total number of users. |
| FR-55 | The system shall display total number of properties. |
| FR-56 | The system shall display number of pending properties. |
| FR-57 | The system shall allow admin to approve property posts. |
| FR-58 | The system shall allow admin to reject property posts. |
| FR-59 | The system shall allow admin to hide property posts. |
| FR-60 | The system shall allow admin to manage users. |

---

## 3.11 Contact Request Using Server Action

### Description

The system shall include at least one feature implemented using **Next.js Server Actions**.

### Functional Requirements

| ID | Requirement |
|---|---|
| FR-61 | The system shall provide a contact request form on the property detail page. |
| FR-62 | The system shall validate contact request input using Zod. |
| FR-63 | The system shall submit the contact request using Next.js Server Action. |
| FR-64 | The system shall store the contact request or forward it to the backend API. |
| FR-65 | The system shall treat contact request as a separate workflow from realtime conversation. |

---

## 4. External Interface Requirements

### 4.1 User Interface

The frontend shall be responsive for:

```text
- Mobile
- Tablet
- Desktop
```

The UI shall include:

```text
- Navigation bar
- Footer
- Home page
- Property listing page
- Property detail page
- Login page
- Register page
- Compare page
- User profile page
- Seller dashboard
- Admin dashboard
- Chat interface
```

### 4.2 Hardware Interface

No special hardware is required. The system only requires a device with a modern web browser and internet connection.

### 4.3 Software Interface

| Component | Technology |
|---|---|
| Frontend | Next.js App Router |
| UI Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ORM/ODM | Mongoose |
| Authentication | JWT, Refresh Token |
| Realtime | Socket.io |
| Map | Leaflet / React Leaflet |
| Upload | Cloudinary |
| Deployment FE | Vercel |
| Deployment BE | Render / Railway |

### 4.4 Communication Interface

The frontend communicates with the backend through REST API using JSON.

Example:

```text
GET /api/properties
POST /api/auth/login
POST /api/properties
PATCH /api/admin/properties/:id/approve
```

Realtime communication uses Socket.io WebSocket connection.

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

| ID | Requirement |
|---|---|
| NFR-01 | Property listing page should load within 3 seconds under normal network conditions. |
| NFR-02 | Search and filter response should return within 2 seconds for normal dataset size. |
| NFR-03 | Chat messages should be delivered in near realtime. |
| NFR-04 | Images should be optimized before display. |

### 5.2 Security Requirements

| ID | Requirement |
|---|---|
| NFR-05 | Passwords must be hashed before storing in database. |
| NFR-06 | JWT secret and database URI must be stored in environment variables. |
| NFR-07 | Protected routes must require valid access token. |
| NFR-08 | Role-based authorization must be enforced on admin and seller APIs. |
| NFR-09 | The repository must include `.env.example` and must not expose real secrets. |

### 5.3 Reliability Requirements

| ID | Requirement |
|---|---|
| NFR-10 | The system shall handle API errors with clear JSON error responses. |
| NFR-11 | The backend shall provide a health check endpoint. |
| NFR-12 | The system shall validate user input before saving data. |

### 5.4 Usability Requirements

| ID | Requirement |
|---|---|
| NFR-13 | The UI shall be clear and easy to use. |
| NFR-14 | Forms shall display validation messages. |
| NFR-15 | Users shall be able to search and filter properties easily. |
| NFR-16 | The website shall support responsive design. |

### 5.5 Maintainability Requirements

| ID | Requirement |
|---|---|
| NFR-17 | Backend shall follow MVC architecture. |
| NFR-18 | Frontend shall use reusable components. |
| NFR-19 | Code shall be organized by feature or module. |
| NFR-20 | Git commits shall be meaningful and follow a consistent convention. |

---

## 6. System Architecture

### 6.1 High-Level Architecture

```text
User Browser
    |
    | HTTPS
    v
Next.js Frontend
    |
    | REST API / JSON
    v
Express.js Backend
    |
    | Mongoose ODM
    v
MongoDB Atlas

Additional Services:
- Cloudinary for image upload
- Socket.io for realtime chat
- Leaflet for map display
```

### 6.2 Component Description

| Component | Responsibility |
|---|---|
| Next.js Frontend | User interface, routing, forms, state management |
| Express Backend | REST API, authentication, business logic |
| MongoDB | Store users, properties, messages, favorites |
| Cloudinary | Store property images |
| Socket.io | Realtime chat |
| Leaflet | Display property maps |

---

## 7. Database Requirements

### 7.1 User Collection

```text
User
- _id
- fullName
- email
- passwordHash
- phone
- role: admin | seller | user
- avatar
- refreshToken
- createdAt
- updatedAt
```

### 7.2 Property Collection

```text
Property
- _id
- title
- description
- type
- purpose
- price
- area
- bedrooms
- bathrooms
- address
- city
- district
- ward
- latitude
- longitude
- images
- amenities
- ownerId
- status
- createdAt
- updatedAt
```

### 7.3 Favorite Collection

```text
Favorite
- _id
- userId
- propertyId
- createdAt
```

### 7.4 Conversation Collection

```text
Conversation
- _id
- propertyId
- participants
- lastMessage
- createdAt
- updatedAt
```

### 7.5 Message Collection

```text
Message
- _id
- conversationId
- senderId
- content
- isRead
- createdAt
```

### 7.6 Contact Request Collection

```text
ContactRequest
- _id
- propertyId
- userId
- name
- email
- phone
- message
- status
- createdAt
```

---

## 8. API Requirements

### 8.1 Authentication APIs

| Method | Endpoint | Description | Role |
|---|---|---|---|
| POST | `/api/auth/register` | Register new account | Guest |
| POST | `/api/auth/login` | Login | Guest |
| POST | `/api/auth/refresh` | Refresh access token | User |
| POST | `/api/auth/logout` | Logout | User |
| GET | `/api/auth/me` | Get current user | User |

### 8.2 Property APIs

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/properties` | Get property list with filters | Public |
| GET | `/api/properties/:id` | Get property detail | Public |
| POST | `/api/properties` | Create property | Seller/Admin |
| PUT | `/api/properties/:id` | Update property | Owner/Admin |
| DELETE | `/api/properties/:id` | Delete property | Owner/Admin |
| PATCH | `/api/properties/:id/status` | Update property status | Admin |

### 8.3 Favorite APIs

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/favorites/me` | Get my favorite properties | User |
| POST | `/api/favorites/:propertyId` | Add favorite property | User |
| DELETE | `/api/favorites/:propertyId` | Remove favorite property | User |

### 8.4 Chat APIs

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/conversations` | Get my conversations | User |
| POST | `/api/conversations` | Create conversation | User |
| GET | `/api/conversations/:id/messages` | Get messages | User |
| POST | `/api/conversations/:id/messages` | Send message fallback API | User |

### 8.5 Admin APIs

| Method | Endpoint | Description | Role |
|---|---|---|---|
| GET | `/api/admin/stats` | Get dashboard statistics | Admin |
| GET | `/api/admin/users` | Manage users | Admin |
| GET | `/api/admin/properties/pending` | Get pending properties | Admin |
| PATCH | `/api/admin/properties/:id/approve` | Approve property | Admin |
| PATCH | `/api/admin/properties/:id/reject` | Reject property | Admin |
| PATCH | `/api/admin/properties/:id/hide` | Hide property | Admin |

---

## 9. Frontend Page Requirements

### 9.1 Public Pages

| Route | Description | Rendering Strategy |
|---|---|---|
| `/` | Homepage | SSG |
| `/properties` | Property listing with filters | SSR |
| `/properties/[id]` | Property detail dynamic route | SSR |
| `/compare` | Compare selected properties | CSR/SSR |
| `/login` | Login page | CSR |
| `/register` | Register page | CSR |

### 9.2 Protected User Pages

| Route | Description |
|---|---|
| `/profile` | User profile |
| `/favorites` | Favorite properties |
| `/chat` | User conversations |

### 9.3 Seller Pages

| Route | Description |
|---|---|
| `/dashboard` | Seller dashboard |
| `/dashboard/properties` | Seller property list |
| `/dashboard/properties/new` | Create property |
| `/dashboard/properties/[id]/edit` | Edit property |

### 9.4 Admin Pages

| Route | Description |
|---|---|
| `/admin` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/properties` | Property management |
| `/admin/properties/pending` | Pending approval list |

---

## 10. Form Validation Requirements

### 10.1 Register Form

Validation rules:

```text
- Full name is required.
- Email must be valid.
- Password must have at least 8 characters.
- Confirm password must match password.
- Role must be selected.
```

### 10.2 Create Property Form

Validation rules:

```text
- Title is required.
- Description is required.
- Price must be greater than 0.
- Area must be greater than 0.
- City is required.
- Address is required.
- Property type is required.
- Purpose must be sale or rent.
- Latitude and longitude are required.
- At least one image is required.
```

---

## 11. State Management Requirements

The system shall use:

```text
- useState/useEffect for local component state
- Zustand or Context API for global state
```

Global state may include:

```text
- Auth user
- Access token
- Compare list
- Favorite status
- Chat notification count
```

---

## 12. Rendering Strategy Requirements

Recommended usage:

| Page | Strategy | Reason |
|---|---|---|
| Homepage | SSG | Public marketing content changes infrequently |
| Property listing | SSR | Search/filter results need fresh data |
| Property detail | SSR or ISR | Needs updated price/status, but can be cached |
| Blog/help page | SSG | Static content |
| Admin dashboard | CSR/SSR | Requires authenticated dynamic data |

---

## 13. Deployment Requirements

The system shall be deployed as follows:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render or Railway |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary |

Deployment requirements:

```text
- Live frontend URL must work during defense.
- Backend API must be accessible from frontend.
- Production environment variables must be configured.
- README must include local setup and deployment guide.
- .env.example must be included.
```

---

## 14. Constraints

```text
- The project must use Next.js App Router, not Pages Router.
- The project must use Tailwind CSS.
- The project must have Node.js/Express.js backend.
- The project must use MongoDB or PostgreSQL.
- The project must include authentication and role-based authorization.
- The project must include at least two advanced features.
- The project must be deployed before final defense.
- The project must include meaningful GitHub commit history.
```

---

## 15. Acceptance Criteria

The project is considered acceptable when:

```text
- Users can register and login successfully.
- Users can browse and filter property listings.
- Users can view property detail pages.
- Sellers can create, update, and delete property listings.
- Admin can approve or reject property listings.
- Users can compare 2–3 properties.
- Users can favorite properties.
- Users can chat in realtime.
- Property location is displayed on a map.
- Property images can be uploaded.
- Frontend is responsive.
- Backend API returns correct JSON responses.
- Project is deployed and live link works.
- README and .env.example are complete.
```

---

## 16. Suggested Development Milestones

### Milestone 1: Foundation

```text
- Setup GitHub repository
- Setup Next.js frontend
- Setup Express backend
- Connect MongoDB
- Create User and Property schema
- Create basic CRUD APIs
```

### Milestone 2: Core Features

```text
- Authentication
- Property listing page
- Property detail page
- Search and filter
- Seller dashboard
```

### Milestone 3: Advanced Features

```text
- Cloudinary image upload
- Leaflet map integration
- Socket.io realtime chat
- Property comparison
- Favorites
```

### Milestone 4: Admin and Deployment

```text
- Admin dashboard
- Property approval workflow
- Deploy frontend
- Deploy backend
- Configure production database
- Write README and report
```

---

## 17. Appendix: Suggested Project Folder Structure

### Frontend

```text
frontend/
  app/
    layout.tsx
    page.tsx
    properties/
      page.tsx
      [id]/
        page.tsx
    compare/
      page.tsx
    login/
      page.tsx
    register/
      page.tsx
    profile/
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
  components/
  lib/
  hooks/
  store/
  types/
```

### Backend

```text
backend/
  src/
    config/
      db.js
      cloudinary.js
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
      chat.routes.js
      admin.routes.js
    controllers/
      auth.controller.js
      property.controller.js
      favorite.controller.js
      chat.controller.js
      admin.controller.js
    services/
    middlewares/
      auth.middleware.js
      role.middleware.js
      error.middleware.js
    utils/
    server.js
```
