# Architecture

High-level overview of the Delivra mobile app architecture, focused on navigation, state, async data flow, and native integrations. The project uses a bare React Native workflow with Expo modules and Expo Router.

## Overview

- Runtime: React Native (bare) with Expo SDK 53 and Expo Router.
- Language/Types: TypeScript.
- State: Zustand with MMKV persistence (per-store namespace + partial persistence).
- UI/Theming: Inline styles + StyleSheet + NativeWind color scheme; central palette in `constants/Colors.ts` and a `useThemeColors` hook.
- Navigation: File‑based via Expo Router (`app/`), tab layout group `(tabs)` and a `modal` route.
- Native Integrations:
  - Mapbox: `@rnmapbox/maps` for map rendering and Directions API (route + ETA).
  - Camera/QR: `expo-camera` for QR code scanning.
  - Storage: `react-native-mmkv` for fast on‑device persistence.Superior to AsyncStorage.

## Folder Structure

- `app/` – Routes for Expo Router. Key files:
  - `_layout.tsx` – App bootstrap: fonts/splash, theme provider, auth gate, and packages polling lifecycle.
  - `(tabs)/_layout.tsx` – Tab navigator configuration and tab icon rendering.
  - `(tabs)/index.tsx` – Home (dashboard) screen.
  - `(tabs)/map.tsx` – Map screen (Mapbox map + driver details + packages modal).
  - `(tabs)/scan.tsx` – QR scanner screen (camera lifecycle + result sheet).
  - `(tabs)/settings.tsx` – Settings (theme, map style, scanner options, logout).
- `components/` – Reusable UI (alerts, login, map, packages, sheets).
- `stores/` – Zustand stores (`authStore`, `deliveryStore`, `packagesStore`, `settingsStore`).
- `lib/` – API + utilities (`api.ts`, `mapbox.ts`, `map-geometry.ts`, `scan.ts`, `utils.ts`).
- `hooks/` – Custom hooks (`useThemeColors`, `useAlert` re-export).
- `constants/` – Color palette and theme mapping.
- `assets/` – Images, fonts, splash assets.
- `android/`, `ios/` – Native projects (bare workflow).Ios available for future use but not currently used due to lack of hardware for testing. Still code is ready to be ported to IOS with minimal changes.
- `scripts/` – Dev convenience scripts (LAN host selection, Android build scripts).

## Navigation

- Expo Router is used with an initial route of `(tabs)`, configured in `app/_layout.tsx`.
- Tabs: Home (`index`), Map (`map`), Scan (`scan`), Settings (`settings`).
- When unauthenticated, `app/_layout.tsx` renders the login flow directly instead of the tab stack.

## State Management (Zustand + MMKV)

Each store persists a subset of fields via `zustand/middleware/persist` with `createJSONStorage` bound to an MMKV namespace. Persisted shape is controlled via `partialize` to avoid storing ephemeral data.

- `authStore`
  - Flags: `isAuthenticated`
  - Actions: `login(email?, password?, rememberMe?)`, `loginGuest()`, `logout()`.
  - Persistence: `auth` namespace; only flags are saved (no tokens stored client‑side at this time).
- `deliveryStore`
  - UI data for driver summary and ETA shown on dashboard/sheets.
  - Actions: `setEta`, `setDriver`, `setPackages`.
  - Persistence: `delivery` namespace.
- `packagesStore`
  - State: `packages`, `lastUpdated`, `loading`, `error`.
  - Actions:
    - `fetchNow()` – Fetch packages immediately, normalize numeric fields.
    - `startPolling()` – One immediate fetch, then every 5 minutes (no‑op if already active).
    - `stopPolling()` – Clears the polling interval.
  - Persistence: `packages` namespace; persists `packages` and `lastUpdated` only.
- `settingsStore`
  - State: map style (`light` | `dark` | `satellite`), scanner vibration preference.
  - Persistence: `settings` namespace.

## Async Data Flow

### Auth

- Auth flow is controlled by `useAuthStore.isAuthenticated`.
- Login/Signup are validated with `zod` (`lib/authValidation.ts`). Login calls the backend via `lib/api.ts`.
- On successful auth, `app/_layout.tsx` switches to the tab stack and starts packages polling.

### Packages

- `packagesStore.fetchNow()` uses `lib/api.fetchPackages()` and normalizes numeric fields from the backend (string → number when needed).
- `startPolling()` triggers an immediate fetch and then fetches every 5 minutes while authenticated; `stopPolling()` is called when leaving the authenticated app.

### Map (Mapbox)

- `components/map/MapView.tsx`:
  - Geocodes a destination address (configurable in file) using `lib/mapbox.geocodeAddress`.
  - Requests a driving route and estimates ETA via Mapbox Directions API.
  - Fits camera to route bounds once geometry is available.
  - Exposes `onEtaChange` and `onDriverPress` props to coordinate with sheets and dashboard.
  - Map style is driven by `settingsStore.mapStyle` and selectable in‑app.

### Scan (QR / Camera)

- `app/(tabs)/scan.tsx` renders an `expo-camera` `CameraView` and listens for QR codes.
- Scanned payloads are parsed via `lib/scan.parseScannedPayload` to normalize multiple possible QR schemas.
- A result sheet (`components/ScanResultSheet.tsx`) summarizes vital data and offers “Mark as delivered”.
- Camera lifecycle and scanning activation are gated by focus, permission, and sheet visibility.

## Theming

- Color palette in `constants/Colors.ts` provides brand tint and semantic roles per theme.
- `hooks/useThemeColors` returns the active theme colors and the shared palette.
- NativeWind `useColorScheme()` drives dark/light mode for UI and tabs.
- `components/ToggleTheme.tsx` renders selectable theme rows.

## Environment & Configuration

- `.env` (see `.env.example`) provides:
  - `MAPBOX_ACCESS_TOKEN` – Public Mapbox token (pk.*) used at runtime.
  - `MAPBOX_DOWNLOADS_TOKEN` – Secret token (sk.*) for the Android Gradle registry (required to build Mapbox RN SDK).
  - `POSTGRES_URL` – Base API URL (must be HTTPS). Also exposed to the app via `app.config.ts` → `expo.extra.POSTGRES_URL`.
- Mapbox access token is set on startup in `app/_layout.tsx` via `Mapbox.setAccessToken`.
- Email domain restrictions for signup are defined in `allowedDomains.json` and enforced by `lib/authValidation.ts`.

## Error Handling & Resilience

- API helpers throw errors with contextual messages; `fetchPackages` logs unexpected response shapes and rejects.
- Mapbox geocoding/directions failures are caught and logged without crashing the app.

## Performance Notes

- Map route camera fitting occurs once per route load using a ref guard to avoid repeated animations.
- MMKV provides fast persistent storage; stores only persist necessary fields.

## Build & Runtime Modes

- Bare workflow: Android and iOS native projects live under `android/` and `ios/`.
- Dev client: Start Metro with LAN binding for device testing (see `scripts/start-expo.cjs` and package scripts).
- Android APK shortcuts: PowerShell scripts for debug and release builds under `scripts/`.

## Related Docs

- API endpoints and shapes: `docs/api.md`
- Authentication details: `AUTH.MD`

