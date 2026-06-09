# Postman

## Auth Collection

Files:

- `RealEstateHub-Auth.postman_collection.json`
- `RealEstateHub-Local.postman_environment.json`

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

## Notes

- `refreshToken` is stored as an HttpOnly cookie by the backend, so Postman must keep cookies enabled.
- `Me` uses the `accessToken` saved by the `Register`, `Login`, or `Refresh` request tests.
- If you want to reuse the collection with another backend URL, update `baseUrl` in the environment.
