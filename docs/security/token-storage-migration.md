# Token storage migration plan

The frontend currently stores the access JWT and user record in `localStorage` under the `auth` key (`src/lib/auth.js`) and sends the JWT as a bearer token. The backend also supports an HTTP-only cookie, but switching the client to cookie-only authentication changes the login, refresh, logout, CSRF, and session-expiry contracts.

Before changing storage, agree with the backend on these requirements:

1. Login and refresh issue `Secure`, `HttpOnly`, appropriately `SameSite` cookies scoped to the API.
2. Every authenticated endpoint accepts the cookie, and logout invalidates the server-side session or refresh token.
3. State-changing requests require the existing CSRF token flow; cross-origin credential and CORS settings are explicit.
4. A migration window supports users with an existing localStorage token, or users are asked to sign in again.
5. The frontend uses a non-sensitive `/me` response for role and profile data rather than decoding a token for UI state.

After the backend contract is deployed, remove the bearer-token interceptor and localStorage token writes, add cookie-session regression tests, and verify login, reload, refresh, logout, 401, 403, and CSRF behavior in browser tests. Keep role authorization server-enforced throughout.
