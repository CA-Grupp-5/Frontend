## Delivra Mobile App quick start and overview(React Native Bare + Expo Router)
For other in depth docs check the docs folder

Bare React Native app with Expo modules and file-based routing. Uses TypeScript, Zustand + MMKV for state, Mapbox for maps/directions, and Expo Camera for QR scanning.



### Stack

- React Native 0.79, Expo SDK 53, Expo Router
- TypeScript, NativeWind color scheme
- State: Zustand with MMKV persistence
- Maps: `@rnmapbox/maps` (+ Mapbox Directions API)
- Tests/Tooling: Jest, ESLint, Prettier

### Requirements

- Node 22+
- Bun (preferred): https://bun.sh
- Android: Java 17 in PATH, Android Studio/SDK
- iOS (macOS): Xcode + CocoaPods

### Setup

1) Install dependencies

```powershell
bun install
```

2) Configure environment (create `.env`)

```env
# Mapbox runtime token (public, pk.*)
MAPBOX_ACCESS_TOKEN=pk.your_token_here

# Mapbox downloads token for Gradle (secret, sk.*) – required for Android builds
MAPBOX_DOWNLOADS_TOKEN=sk.your_token_here

# Backend base URL (must be HTTPS). Also exposed via app.config.ts → expo.extra
POSTGRES_URL=https://your-api-host
```

- Add allowed signup domains in `allowedDomains.json`.
- `app.config.ts` reads env vars and exposes them under `expo.extra`.

### Run (Dev Client)

Start Metro with a LAN host (good for real devices):

```powershell
bun run s
# or use the LAN-aware starter script
bun run sc
```

Open on device with the Expo Dev Client, or run native targets below.

### Android / iOS (bare)

Android:

```powershell
bun run android
# Prebuild native projects then run
bun run android:prebuild
```

iOS (macOS):

```powershell
bun run ios
# Prebuild then run
bun run ios:prebuild
```

Ensure Java 17 is installed for Android. The Gradle wrapper is used automatically.

### Dev Build Shortcuts (APK)

PowerShell scripts in `./scripts` create APKs. Exposed via package scripts:

- Debug/dev APK (includes expo-dev-client)

```powershell
bun run dev
```

- Release APK (Gradle release)

```powershell
bun run release
```

If PowerShell execution is blocked:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-android-debug.ps1
```

### Scripts

- Start dev server (Dev Client + LAN): `bun run s`
- Start with clear cache: `bun run sclear`
- Start with LAN auto-detect script: `bun run sc`
- Tests (watch): `bun run t`
- Lint: `bun run lint`
- Format: `bun run format`

### Project Structure

- `app/` Routes via Expo Router (`(tabs)`, `modal`, etc.)
- `components/` Reusable UI (Login, Driver/Scan sheets, Packages)
- `stores/` Zustand stores (auth, delivery, packages, settings)
- `lib/` API and utilities (mapbox helpers, scan parsing)
- `constants/` Theme palette and mapping
- `android/`, `ios/` – Native projects (bare workflow)

For a deeper walkthrough, see `docs/architecture.md`.

### API

Endpoints and client expectations live in `docs/api.md`.

### Notes / Roadmap

See `NOTESnTODOS.md` for short-term items.

### Troubleshooting

- If Metro binds to `127.0.0.1`, use `bun run sc` to force a LAN IPv4.
- Map not rendering or no route: verify `MAPBOX_ACCESS_TOKEN`.
- Android build fails fetching Mapbox: ensure `MAPBOX_DOWNLOADS_TOKEN` is set.
- Camera/scan not working: grant camera permission on the device/emulator.
- Windows: if scripts are blocked, run with `-ExecutionPolicy Bypass` as shown above.

