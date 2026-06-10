# Postman

## Collections

Files:

- `RealEstateHub-Auth.postman_collection.json`
- `RealEstateHub-Property.postman_collection.json`
- `RealEstateHub-Local.postman_environment.json`

## How to test

1. Run the backend seed scripts:
   - `npm --prefix backend run seed:admin`
   - `npm --prefix backend run seed:demo`
2. Import the three Postman files into Postman.
3. Select the `RealEstateHub Local` environment.
4. Make sure the backend is running on `http://localhost:5000`.
5. Run the property collection requests in this order:
   - `Login Seller 1`
   - `Login Seller 2`
   - `Login Admin`
   - `Get Properties List`
   - `Get Property Detail`
   - `Get Compare Properties`
   - `Create Property`
   - `Update Own Property`
   - `Delete Own Property`
   - `Update Other Seller Property`
   - `Delete Other Seller Property`
   - `Update Property Status`

## Notes

- `refreshToken` is stored as an HttpOnly cookie by the backend, so Postman must keep cookies enabled for auth tests.
- The property collection uses seeded demo accounts:
  - `seller1@realestatehub.local` / `Seller@123`
  - `seller2@realestatehub.local` / `Seller@123`
  - `admin@realestatehub.local` / `Admin@123`
- `Get Properties List` stores `sellerOnePropertyId`, `sellerTwoPropertyId`, and `compareIds` for the later requests.
- `Create Property` stores `ownedPropertyId`, which is reused by update and delete requests.
- If you want to reuse the collections with another backend URL, update `baseUrl` in the environment.
