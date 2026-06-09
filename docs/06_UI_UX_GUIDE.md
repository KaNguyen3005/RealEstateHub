# UI_UX_GUIDE.md  
## Project: RealEstateHub – Mini Real Estate Marketplace

---

## 1. Purpose

This document defines the UI/UX design guide for **RealEstateHub**, a mini real estate marketplace web application.

The guide is based on the project SRS, HLD, LLD, and Implementation Plan. It helps the frontend team build a consistent, responsive, user-friendly, and report-ready interface using **Next.js App Router**, **Tailwind CSS**, **shadcn/ui**, **React Hook Form**, **Zod**, **Zustand**, **Socket.io**, and **React Leaflet**.

---

## 2. Product UX Goal

RealEstateHub should feel like a simple, modern, trustworthy real estate platform.

The user should be able to:

```text
- Find properties quickly.
- Understand property information clearly.
- Filter properties without confusion.
- Compare 2-3 properties easily.
- Contact sellers with minimal steps.
- Chat with sellers in realtime.
- Save favorite properties.
- Use the system comfortably on mobile, tablet, and desktop.
```

The seller should be able to:

```text
- Create property listings quickly.
- Upload property images easily.
- Manage property status clearly.
- Respond to interested users.
```

The admin should be able to:

```text
- Review pending properties quickly.
- Approve, reject, or hide listings.
- Manage users.
- View platform statistics.
```

---

## 3. Design Principles

## 3.1 Clarity First

Every page should clearly answer:

```text
- What is this page for?
- What action can the user take here?
- What is the current system state?
```

Examples:

```text
Good:
"Pending approval" badge on seller property table.

Bad:
Showing a property status only as a color without text.
```

---

## 3.2 Fast Search Experience

Real estate users usually care about:

```text
- Location
- Price
- Area
- Property type
- Sale or rent purpose
```

Therefore, the listing page should make these filters easy to find and use.

---

## 3.3 Trustworthy Visual Design

Because real estate involves high-value decisions, the UI should look clean, serious, and reliable.

Recommended style:

```text
- White or light neutral background.
- Clear typography.
- Strong image presentation.
- Consistent spacing.
- Avoid too many bright colors.
- Use badges for status and property type.
```

---

## 3.4 Mobile-Friendly First

The system must work well on:

```text
- Mobile
- Tablet
- Desktop
```

Mobile users should be able to:

```text
- Search properties.
- Open filters.
- View property detail.
- Contact seller.
- Start chat.
```

---

## 3.5 Consistency

Use the same component style across the whole app:

```text
- Same button variants.
- Same input style.
- Same card style.
- Same badge style.
- Same spacing rules.
- Same error message style.
```

---

## 4. Target Users

| User Type | Main Goal | UI Focus |
|---|---|---|
| Guest | Browse and search properties | Simple navigation, strong search box |
| User / Buyer / Renter | Save, compare, contact, chat | Fast actions, favorite, compare, contact form |
| Seller / Agent | Create and manage listings | Clear dashboard, simple property form |
| Admin | Moderate platform content | Tables, filters, status actions, statistics |

---

## 5. Global Layout

## 5.1 Public Layout

Used by:

```text
/
 /properties
 /properties/[id]
 /compare
 /login
 /register
```

Structure:

```text
Navbar
Main Content
Footer
```

Navbar items:

```text
- Logo
- Properties
- Compare
- Login / Register
- User menu if logged in
```

Logged-in user menu:

```text
- Profile
- Favorites
- Chat
- Dashboard if seller
- Admin if admin
- Logout
```

---

## 5.2 Dashboard Layout

Used by seller pages:

```text
/dashboard
/dashboard/properties
/dashboard/properties/new
/dashboard/properties/[id]/edit
```

Structure:

```text
Sidebar
Topbar
Main Content
```

Seller sidebar items:

```text
- Overview
- My Properties
- Create Property
- Chat
- Profile
```

---

## 5.3 Admin Layout

Used by admin pages:

```text
/admin
/admin/users
/admin/properties
/admin/contact-requests
```

Admin sidebar items:

```text
- Overview
- Users
- Properties
- Pending Properties
- Contact Requests
```

---

## 6. Visual Style Guide

## 6.1 Color Palette

Recommended color system using Tailwind CSS:

| Usage | Tailwind Example | Purpose |
|---|---|---|
| Primary | `blue-600` | Main CTA, links, active state |
| Primary Hover | `blue-700` | Button hover |
| Background | `slate-50` | Page background |
| Surface | `white` | Cards, forms, tables |
| Text Primary | `slate-900` | Main text |
| Text Secondary | `slate-500` | Descriptions, metadata |
| Border | `slate-200` | Card/input borders |
| Success | `green-600` | Approved, success |
| Warning | `amber-500` | Pending |
| Danger | `red-600` | Delete, reject, error |
| Info | `sky-600` | Chat, notification |

Recommended CSS variables if using shadcn/ui:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
}
```

---

## 6.2 Typography

Recommended font:

```text
Inter, system-ui, sans-serif
```

Typography scale:

| Element | Tailwind Example |
|---|---|
| Page title | `text-3xl font-bold tracking-tight` |
| Section title | `text-2xl font-semibold` |
| Card title | `text-lg font-semibold` |
| Body | `text-base text-slate-700` |
| Small text | `text-sm text-slate-500` |
| Caption | `text-xs text-slate-400` |

---

## 6.3 Spacing

Use consistent spacing:

| Usage | Tailwind Example |
|---|---|
| Page container | `container mx-auto px-4 md:px-6 lg:px-8` |
| Section spacing | `py-10 md:py-16` |
| Card padding | `p-4 md:p-6` |
| Form gap | `space-y-4` |
| Grid gap | `gap-4 md:gap-6` |

---

## 6.4 Border and Radius

Recommended:

```text
Cards: rounded-xl border
Buttons: rounded-lg
Inputs: rounded-md
Modals: rounded-xl
Images: rounded-lg
```

Tailwind example:

```text
rounded-xl border border-slate-200 bg-white shadow-sm
```

---

## 6.5 Shadows

Use subtle shadows only:

```text
shadow-sm for cards
shadow-md for dropdowns/modals
Avoid heavy shadow
```

---

## 7. Component Design

## 7.1 Button

Recommended variants:

| Variant | Usage |
|---|---|
| Primary | Main action: Search, Submit, Create |
| Secondary | Alternative action: Cancel, Back |
| Outline | Less important action |
| Ghost | Navbar/menu action |
| Danger | Delete, Reject, Block |

Example:

```tsx
<Button variant="default">Search</Button>
<Button variant="outline">Compare</Button>
<Button variant="destructive">Delete</Button>
```

Button rules:

```text
- Main CTA should be visually strongest.
- Avoid more than one primary button in the same small section.
- Destructive action should require confirmation.
```

---

## 7.2 Input

Input states:

```text
Default
Focus
Error
Disabled
```

Error message style:

```text
text-sm text-red-600 mt-1
```

Example:

```tsx
<Input placeholder="Enter city" />
<p className="text-sm text-red-600">City is required</p>
```

---

## 7.3 Badge

Use badges for property type, purpose, and status.

Property type badges:

```text
Apartment
House
Land
Villa
Office
```

Purpose badges:

```text
For Sale
For Rent
```

Status badges:

| Status | Style |
|---|---|
| pending | Yellow / amber |
| approved | Green |
| rejected | Red |
| hidden | Gray |

---

## 7.4 Card

Property card should show:

```text
- Main image
- Property title
- Price
- Address
- Area
- Bedrooms
- Bathrooms
- Purpose badge
- Favorite button
- Compare button
- View detail button
```

Recommended layout:

```text
Image on top
Content below
Main info first
Action buttons at bottom
```

---

## 7.5 Table

Use tables for:

```text
- Seller property management
- Admin property approval
- Admin user management
- Contact request management
```

Table should include:

```text
- Search/filter if needed
- Empty state
- Loading state
- Pagination if data is long
- Clear action buttons
```

---

## 8. Page-by-Page UI Design

# 8.1 Home Page

Route:

```text
/
```

Goal:

```text
Help users start searching quickly and understand what RealEstateHub offers.
```

Sections:

```text
1. Hero section
2. Search box
3. Featured properties
4. Property categories
5. Why choose us
6. Footer
```

Hero content example:

```text
Find your next home with RealEstateHub
Search apartments, houses, villas, and land in one place.
```

Primary CTA:

```text
Search Properties
```

Secondary CTA:

```text
Post a Property
```

Data:

```text
GET /api/properties?limit=6
```

UX rules:

```text
- Search box should be visible above the fold.
- Featured property cards should show strong images.
- Homepage should not feel crowded.
```

---

# 8.2 Property Listing Page

Route:

```text
/properties
```

Goal:

```text
Allow users to search, filter, and browse approved properties.
```

Main layout desktop:

```text
Left: Filter sidebar
Right: Property grid
Optional bottom/right: Map
```

Main layout mobile:

```text
Top: Search bar
Filter button opens drawer
Property cards in one column
Map can be collapsible
```

Filters:

```text
- Keyword
- City
- District
- Property type
- Purpose: sale/rent
- Min price
- Max price
- Min area
- Max area
```

Property grid:

```text
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column
```

States:

```text
Loading: skeleton cards
Empty: "No properties found"
Error: "Failed to load properties"
```

UX rules:

```text
- Filters should not reload the whole page unnecessarily.
- Show active filters clearly.
- Provide "Clear filters" button.
- Use pagination or load more.
```

---

# 8.3 Property Detail Page

Route:

```text
/properties/[id]
```

Goal:

```text
Help user evaluate one property and take action.
```

Sections:

```text
1. Image gallery
2. Property title and basic info
3. Price and purpose badge
4. Address and map
5. Description
6. Amenities
7. Seller information
8. Contact request form
9. Start chat button
10. Similar properties if time allows
```

Important actions:

```text
- Add to favorites
- Add to compare
- Submit contact request
- Start chat
```

Property detail info:

```text
- Price
- Area
- Bedrooms
- Bathrooms
- Property type
- Purpose
- City
- District
- Full address
```

UX rules:

```text
- Price should be highly visible.
- Contact action should be easy to find.
- Map should not block the main property information.
- Gallery should work on mobile.
```

---

# 8.4 Login Page

Route:

```text
/login
```

Fields:

```text
- Email
- Password
```

Actions:

```text
- Login
- Link to register
```

Validation:

```text
- Email must be valid.
- Password is required.
```

UX rules:

```text
- Show clear error if login fails.
- Disable button while submitting.
- Redirect based on role after login.
```

Role redirect:

```text
Admin → /admin
Seller → /dashboard
User → /
```

---

# 8.5 Register Page

Route:

```text
/register
```

Fields:

```text
- Full name
- Email
- Phone
- Role: user/seller
- Password
- Confirm password
```

Validation:

```text
- Full name at least 2 characters.
- Email must be valid.
- Password at least 8 characters.
- Confirm password must match.
- Role must be user or seller.
```

UX rules:

```text
- Do not allow public registration as admin.
- Show password mismatch clearly.
- After successful registration, redirect to login or auto-login.
```

---

# 8.6 Compare Page

Route:

```text
/compare
```

Goal:

```text
Allow users to compare 2-3 properties side by side.
```

Data flow:

```text
1. compareStore stores propertyIds.
2. /compare page calls GET /api/properties/compare?ids=id1,id2,id3.
3. Page displays latest property details.
```

Comparison fields:

```text
- Image
- Title
- Price
- Area
- Location
- Property type
- Purpose
- Bedrooms
- Bathrooms
- Amenities
```

UX rules:

```text
- Maximum 3 properties.
- Show empty state if no selected property.
- Allow removing property from compare table.
- On mobile, use horizontal scroll.
```

---

# 8.7 Favorites Page

Route:

```text
/favorites
```

Goal:

```text
Show saved properties of authenticated user.
```

Components:

```text
- Favorite property grid
- Empty state
- Remove favorite button
```

Empty state message:

```text
You have not saved any properties yet.
```

UX rules:

```text
- Favorite action should update UI immediately if possible.
- If unauthenticated, redirect to login.
```

---

# 8.8 Seller Dashboard

Routes:

```text
/dashboard
/dashboard/properties
/dashboard/properties/new
/dashboard/properties/[id]/edit
```

Goal:

```text
Allow seller to manage own property listings.
```

Dashboard overview cards:

```text
- Total properties
- Pending properties
- Approved properties
- Rejected properties
```

Seller property table columns:

```text
- Image
- Title
- Price
- Type
- Purpose
- Status
- Created date
- Actions
```

Actions:

```text
- View
- Edit
- Delete
```

UX rules:

```text
- Show status badge clearly.
- Explain pending status: "Waiting for admin approval".
- Confirm before delete.
```

---

# 8.9 Create/Edit Property Page

Routes:

```text
/dashboard/properties/new
/dashboard/properties/[id]/edit
```

Form sections:

```text
1. Basic information
2. Price and area
3. Location
4. Amenities
5. Images
6. Submit
```

Fields:

```text
- Title
- Description
- Type
- Purpose
- Price
- Area
- Bedrooms
- Bathrooms
- Address
- City
- District
- Ward
- Latitude
- Longitude
- Amenities
- Images
```

Image upload UX:

```text
- Drag and drop or file picker.
- Preview uploaded images.
- Allow removing selected image.
- Show max 10 images.
- Show file size/type error.
```

Submit behavior:

```text
- Disable button while submitting.
- Show success toast.
- New property status is pending.
- Redirect to seller property list after success.
```

---

# 8.10 Chat Page

Route:

```text
/chat
```

Goal:

```text
Allow users and sellers to chat about properties in realtime.
```

Layout desktop:

```text
Left: Conversation list
Right: Chat window
```

Layout mobile:

```text
Conversation list first
Tap conversation to open chat
Back button to conversation list
```

Chat window:

```text
- Property preview
- Message list
- Message input
- Send button
- Typing indicator if available
```

UX rules:

```text
- Show own messages on right.
- Show other messages on left.
- Show timestamp.
- Disable input if socket disconnected.
- Show reconnecting state.
```

---

# 8.11 Admin Dashboard

Routes:

```text
/admin
/admin/users
/admin/properties
/admin/contact-requests
```

Goal:

```text
Allow admin to manage users, properties, and contact requests.
```

Admin overview cards:

```text
- Total users
- Total properties
- Pending properties
- Approved properties
- Total conversations
- New contact requests
```

Admin property table:

```text
- Image
- Title
- Seller
- Price
- Status
- Created date
- Actions
```

Actions:

```text
- Approve
- Reject
- Hide
- View detail
```

Admin user table:

```text
- Full name
- Email
- Role
- Status
- Created date
- Actions
```

User actions:

```text
- Change role
- Block
- Activate
```

Contact request table:

```text
- Property
- Name
- Email
- Phone
- Message
- Status
- Created date
```

UX rules:

```text
- Admin actions should be clear and safe.
- Reject/hide/block actions should require confirmation.
- Use badges for user status and property status.
```

---

## 9. Form UX Rules

## 9.1 Required Field Indicator

Use `*` for required fields.

Example:

```text
Title *
Price *
Area *
City *
```

---

## 9.2 Validation Timing

Recommended:

```text
- Validate field on blur.
- Validate full form on submit.
- Show server error after API response.
```

---

## 9.3 Error Message

Error messages should be:

```text
- Short
- Specific
- Close to the field
```

Good examples:

```text
Price must be greater than 0.
At least one image is required.
Password confirmation does not match.
```

---

## 9.4 Loading State

All submit buttons should show loading state:

```text
Creating...
Saving...
Logging in...
Uploading...
Sending...
```

---

## 9.5 Success Feedback

Use toast or inline success message:

```text
Property created successfully. Waiting for admin approval.
Contact request submitted successfully.
Login successfully.
```

---

## 10. State UX Rules

## 10.1 Loading State

Use:

```text
- Skeleton cards for property list
- Spinner for small actions
- Disabled button for submitting form
```

---

## 10.2 Empty State

Examples:

```text
No properties found.
You have not saved any properties yet.
No conversations yet.
No pending properties.
```

Empty state should include a suggested action when useful:

```text
Try changing your filters.
Browse properties.
Create your first property.
```

---

## 10.3 Error State

Examples:

```text
Failed to load properties. Please try again.
Your session has expired. Please login again.
Image upload failed. Please try another image.
```

---

## 10.4 Unauthorized State

Rules:

```text
- If guest opens protected page, redirect to /login.
- If user opens seller page, show 403 or redirect.
- If non-admin opens admin page, show 403 or redirect.
```

---

## 11. Responsive Design Guide

## 11.1 Breakpoints

Use Tailwind defaults:

```text
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 11.2 Mobile Rules

On mobile:

```text
- Use single-column layout.
- Navbar should collapse into menu.
- Filters should open in drawer/sheet.
- Compare table should scroll horizontally.
- Chat page should show one panel at a time.
- Dashboard sidebar should collapse.
```

---

## 11.3 Tablet Rules

On tablet:

```text
- Property grid should use 2 columns.
- Sidebar may become top filter area.
- Dashboard can use collapsible sidebar.
```

---

## 11.4 Desktop Rules

On desktop:

```text
- Property grid should use 3 columns.
- Filter sidebar can stay visible.
- Dashboard sidebar can stay fixed.
- Chat can show conversation list and chat window side by side.
```

---

## 12. Accessibility Guide

## 12.1 Keyboard Accessibility

Required:

```text
- Buttons must be focusable.
- Form fields must be focusable.
- Modal/dialog can be closed by keyboard.
- Focus ring should be visible.
```

---

## 12.2 Labels

Every input should have a label:

```tsx
<label htmlFor="email">Email</label>
<Input id="email" />
```

---

## 12.3 Image Alt Text

Property images should have descriptive alt text:

```tsx
<img alt="Modern apartment in District 1" />
```

---

## 12.4 Color Contrast

Do not rely only on color.

Bad:

```text
Red border only for error.
```

Good:

```text
Red border + error message text.
```

---

## 13. UX Flows

## 13.1 Search Property Flow

```text
1. User opens /properties.
2. User enters keyword or chooses filters.
3. Page shows loading state.
4. API returns filtered properties.
5. User sees property cards and map markers.
6. User opens detail page.
```

---

## 13.2 Create Property Flow

```text
1. Seller logs in.
2. Seller opens /dashboard/properties/new.
3. Seller fills property information.
4. Seller uploads 1-10 images.
5. Seller submits form.
6. Backend creates property with pending status.
7. Seller sees success message.
8. Seller is redirected to property list.
```

---

## 13.3 Admin Approval Flow

```text
1. Admin logs in.
2. Admin opens /admin/properties.
3. Admin reviews pending property.
4. Admin approves, rejects, or hides property.
5. Status badge updates.
6. Approved property appears on public listing page.
```

---

## 13.4 Contact Request Flow

```text
1. User opens property detail page.
2. User fills contact request form.
3. Next.js Server Action validates data using Zod.
4. Server Action sends request to backend using BACKEND_API_URL.
5. Backend stores request with new status.
6. User sees success message.
7. Admin can view request in admin dashboard.
```

---

## 13.5 Chat Flow

```text
1. User logs in.
2. User opens property detail.
3. User clicks Start Chat.
4. Frontend calls POST /api/conversations with propertyId only.
5. Backend gets sellerId from property.ownerId.
6. Conversation is created or returned.
7. Frontend connects to Socket.io with access token.
8. User joins conversation room.
9. User sends message.
10. Seller receives message in realtime.
```

---

## 14. UI Components Checklist

## 14.1 Common Components

```text
- Navbar
- Footer
- Button
- Input
- Select
- Textarea
- Badge
- Card
- Table
- Dialog
- Toast
- LoadingSpinner
- SkeletonCard
- EmptyState
- ConfirmDialog
```

---

## 14.2 Property Components

```text
- PropertyCard
- PropertyGrid
- PropertyFilter
- PropertyGallery
- PropertyMap
- PropertyForm
- CompareTable
- FavoriteButton
- CompareButton
- ContactRequestForm
```

---

## 14.3 Auth Components

```text
- LoginForm
- RegisterForm
- ProtectedRoute
- RoleGuard
```

---

## 14.4 Chat Components

```text
- ConversationList
- ChatWindow
- MessageBubble
- ChatInput
- TypingIndicator
```

---

## 14.5 Admin Components

```text
- AdminStatsCards
- UserManagementTable
- PropertyApprovalTable
- ContactRequestTable
```

---

## 15. Page Acceptance Criteria

## 15.1 Home Page

```text
- Shows hero section.
- Shows search entry point.
- Shows featured properties.
- Responsive on mobile and desktop.
```

---

## 15.2 Property Listing Page

```text
- Shows filters.
- Shows property cards.
- Shows loading state.
- Shows empty state.
- Supports pagination.
- Supports mobile filter drawer.
```

---

## 15.3 Property Detail Page

```text
- Shows image gallery.
- Shows price, area, type, purpose, address.
- Shows map.
- Shows favorite and compare buttons.
- Shows contact request form.
- Shows start chat action.
```

---

## 15.4 Seller Dashboard

```text
- Shows seller property list.
- Shows property status.
- Allows create/edit/delete.
- Shows pending approval status clearly.
```

---

## 15.5 Admin Dashboard

```text
- Shows statistics cards.
- Shows pending properties.
- Allows approve/reject/hide.
- Allows user management.
- Allows contact request management.
```

---

## 16. Suggested Design References

The team can use these as visual inspiration, but should implement its own UI with Tailwind CSS:

```text
- Airbnb listing cards
- Zillow property detail layout
- Modern SaaS dashboard layout
- shadcn/ui dashboard examples
```

Important:

```text
Do not copy a paid template or submit template code as your own.
Use references only for layout inspiration.
```

---

## 17. Tailwind Utility Patterns

## 17.1 Page Container

```tsx
<div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
  {children}
</div>
```

---

## 17.2 Card

```tsx
<div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
  {children}
</div>
```

---

## 17.3 Section Header

```tsx
<div className="mb-6">
  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
    Properties
  </h1>
  <p className="mt-2 text-slate-500">
    Find your next home.
  </p>
</div>
```

---

## 17.4 Status Badge

```tsx
const statusClass = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  hidden: "bg-slate-100 text-slate-700"
};
```

---

## 18. Common UX Mistakes to Avoid

```text
- Hiding important filters on desktop.
- Showing too many buttons on property cards.
- Not showing loading state.
- Not showing empty state.
- Not confirming destructive actions.
- Using only color to represent status.
- Letting users submit forms multiple times.
- Not explaining pending approval to sellers.
- Making chat unusable on mobile.
- Forgetting responsive layout for admin tables.
```

---

## 19. Final UI/UX Checklist Before Submission

```text
- All public pages are responsive.
- Dashboard pages are usable on laptop.
- Property cards look consistent.
- Forms have validation messages.
- Submit buttons have loading state.
- Empty states are implemented.
- Error states are implemented.
- Status badges are clear.
- Contact request form uses Server Action.
- Image upload has preview.
- Map is visible on listing/detail.
- Chat UI works and shows messages clearly.
- Admin tables have clear actions.
- No broken layout on mobile.
- No real secrets are shown in UI or repo.
```

---

## 20. Conclusion

This UI/UX guide helps the RealEstateHub team build a consistent, modern, and user-friendly interface. The most important UI priorities are:

```text
- Clear property search and filtering.
- Strong property detail presentation.
- Simple seller property creation.
- Safe admin approval actions.
- Responsive layout.
- Clear loading, empty, error, and success states.
```

Following this guide will make the project easier to implement, easier to demo, and easier to explain during the final defense.
