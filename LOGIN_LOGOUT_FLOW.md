# Login and Logout Flow

This document explains only the React UI side of SheetSense Hub authentication. It is written as an interview-friendly reference.

## High-Level UI Flow

```txt
/login
  -> user clicks LOG IN
  -> UI builds Google authorization URL
  -> browser navigates to Google
Google
  -> redirects browser to /auth/callback?code=...&state=...
/auth/callback
  -> UI reads code from URL
  -> UI validates state
  -> UI sends code to backend POST /api/auth/session
Backend
  -> sets HttpOnly id_token cookie
UI
  -> stores current user in AuthContext
  -> navigates to /dashboard
```

## Why `/auth/callback` Exists

`/auth/callback` is not a backend API. It is a temporary React route that Google redirects to after successful Google login.

Example callback URL:

```txt
http://localhost:5173/auth/callback?code=4/0AfJoh...&state=...
```

The user may briefly see this URL, but it is only a short-lived Google authorization code. It is not the application JWT.

## UI File Guide

### `src/config/environments.json`

Stores frontend runtime settings by hostname. Local UI points to `http://localhost:8080`; production UI points to the Render backend.

### `src/config/config.js`

Loads the correct environment config and exposes `apiBaseUrl`, `googleAuthUrl`, and `googleClientId` to the UI.

### `src/reusable/apiClient.js`

Central fetch wrapper for backend API calls.

Important behavior:

- prefixes paths with `config.apiBaseUrl`
- sets JSON headers
- uses `credentials: 'include'` so browser sends the HttpOnly `id_token` cookie automatically
- reads backend error messages consistently

### `src/reusable/auth.js`

OAuth helper functions.

Important methods:

- `buildGoogleLoginUrl()`: creates the Google login URL with `client_id`, `redirect_uri`, `response_type=code`, `scope`, and `state`.
- `validateOAuthState(...)`: checks that the callback belongs to the same browser login attempt.
- `createSessionFromGoogleCode(...)`: sends only the Google authorization code and redirect URI to backend.

### `src/reusable/cookies.js`

Manages browser-readable app cookies.

Important cookies:

- `SELECTED_BUSINESS`: readable by UI and used for selected business context.
- `id_token`: auth cookie name, but it is HttpOnly and owned by backend; UI cannot read or delete it directly.

This helper also cleans old duplicate cookie names from earlier iterations.

### `src/context/AuthContext.jsx`

Central auth state for the React app.

Important methods:

- `refreshUser()`: calls `GET /api/auth/session` on protected routes to restore logged-in user from cookie.
- `startLogin()`: clears old cookies and redirects browser to Google login.
- `completeLogin(code)`: sends Google authorization code to backend and stores returned user in React state.
- `logout()`: calls backend logout and clears selected business state.

It intentionally skips `/api/auth/session` on public routes like `/`, `/login`, `/auth/callback`, `/error`, and `/logout` to avoid noisy unauthenticated calls.

### `src/pages/LoginPage/LoginPage.jsx`

Shows the login screen and calls `startLogin()` when user clicks `LOG IN`.

### `src/pages/AuthCallbackPage/AuthCallbackPage.jsx`

Temporary callback page used after Google login.

Important behavior:

- reads `code` using `useSearchParams()`
- validates OAuth `state`
- calls `completeLogin(code)`
- redirects successful users to `/dashboard`
- redirects failed/unauthorized users to `/error`

### `src/pages/ErrorPage/ErrorPage.jsx`

Shows access restricted UI when Google login fails, user is not in DB, or route access is denied.

It also clears app cookies and calls backend logout to expire `id_token` if needed.

### `src/pages/LogoutPage/LogoutPage.jsx`

Shows signed-out screen and calls `logout()` once. A `useRef` guard prevents duplicate logout calls in React dev StrictMode.

### `src/routes/ProtectedRoute.jsx`

Protects authenticated pages. If there is no logged-in user after loading, it redirects to `/login`.

### `src/routes/RoleRoute.jsx`

Protects role-specific pages. If the user does not have required role access, it redirects to `/error`.

### `src/App.jsx`

Registers public and protected routes:

Public:

```txt
/login
/auth/callback
/error
/logout
```

Protected:

```txt
/dashboard
/report
/analytics
/user-management
```

### `src/AppLayout/header/Header.jsx`

Shows the logged-in user menu and logout entry. Also uses MUI `slotProps.paper` for menus/popovers to avoid React DOM prop warnings.

### `src/AppLayout/header/UserPanel/UserPanel.jsx`

Displays user summary and provides logout navigation.

## Logout Flow

```txt
User opens user menu
  -> clicks logout
  -> UI navigates to /logout
/logout page
  -> calls AuthContext.logout()
AuthContext.logout()
  -> POST /api/auth/logout
  -> clears SELECTED_BUSINESS
Backend
  -> expires HttpOnly id_token cookie
UI
  -> displays signed-out page
```

## Testing Checklist

1. Open `http://localhost:5173/login`.
2. Confirm no `/api/auth/session` call fires before login.
3. Click `LOG IN`.
4. Complete Google login.
5. Confirm `/auth/callback` receives `code` and then navigates to `/dashboard`.
6. Confirm browser cookies include only:

```txt
id_token
SELECTED_BUSINESS
```

7. Click logout from user menu.
8. Confirm backend logs logout and cookie expires.
9. Confirm UI shows signed-out page.
10. Confirm console has no MUI `PaperProps` or `disableEscapeKeyDown` warnings.
