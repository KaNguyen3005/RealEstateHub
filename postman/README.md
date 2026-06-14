# Postman

## Auth Collection

Files:

- `RealEstateHub-Auth.postman_collection.json`
- `RealEstateHub-Local.postman_environment.json`

## Phase 12 Testing Collection

Files:

- `RealEstateHub-Phase12-Testing.postman_collection.json`
- `RealEstateHub-Local.postman_environment.json`

This collection covers the backend API cases from Phase 12:

- Auth: register, duplicate register, login, refresh, current user, blocked login.
- Property: approved search, create as seller, forbidden create as user, validation errors.
- Favorite: duplicate favorite conflict.
- Contact request and conversation creation.
- Admin: stats, pending properties, approve property, contact requests.
- Upload invalid file type as a semi-automated check.

## How to test

1. Import both files into Postman.
2. Select the `RealEstateHub Local` environment.
3. Make sure the backend is running on `http://localhost:5000`.
4. Run requests in this order:
   - `Register`
   - `Login`
   - `Me`
   - `Refresh`
   - `Logout`

## How to test Phase 12

1. Seed demo data:
   ```powershell
   cd backend
   npm run seed
   ```
2. Start the backend:
   ```powershell
   cd backend
   npm run dev
   ```
3. Import `RealEstateHub-Phase12-Testing.postman_collection.json`.
4. Select the `RealEstateHub Local` environment.
5. Run folders in order:
   - `01 - Auth and Setup`
   - `02 - Property APIs`
   - `03 - Favorite, Contact, and Chat APIs`
   - `04 - Admin APIs`
6. For `T-15 Upload Invalid File Type`, attach a local `.txt` file named `phase12-invalid.txt` to the `images` form-data field before running.

## Notes

- `refreshToken` is stored as an HttpOnly cookie by the backend, so Postman must keep cookies enabled.
- `Me` uses the `accessToken` saved by the `Register`, `Login`, or `Refresh` request tests.
- If you want to reuse the collection with another backend URL, update `baseUrl` in the environment.
- Phase 12 Socket.io authentication rejection is tracked in `docs/08_TESTING_CHECKLIST.md` as a manual check because it is not a normal REST request.
