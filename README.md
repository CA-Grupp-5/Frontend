## Delivra Mobile App (Expo + RN)

Modern React Native app using Expo Router, NativeWind (Tailwind for RN), Zustand + MMKV, and Mapbox.



### Stack

- Expo SDK 53, React Native 0.79
- TypeScript, Expo Router (file‑based routing)
- Inline styles, stylesheet and NativeWind 4 (Tailwind)
- State: Zustand, storage: MMKV
- Map: `@rnmapbox/maps` 
- Tooling: ESLint, Prettier, Jest

### Requirements

- Node 22+ (LTS recommended)
- Bun (recommended): https://bun.sh
- Java 17 in PATH for native Android builds

### Quick Start

1) Install deps (Bun recommended):

```ps
bun install
```

2) Configure environment (create `.env`):

```env
# Required for maps/geocoding/directions
MAPBOX_ACCESS_TOKEN=pk.your_token_here

# Mapbox downloads token for Android Maven (secret; starts with sk.)
MAPBOX_DOWNLOADS_TOKEN=sk.your_token_here
(see env.example)

-ADD THOSE TO GITHUB ACTION SECRETS AS WELL!


3) Start the app (Dev Client, LAN host):

```ps
bun run start
# or, if bundler picks 127.0.0.1, use the LAN-aware starter
bun run sc
```

Open on device with the Expo Dev Client, or run a native target (below).

### Android / iOS

- Android (run on a device/emulator):

```bash
bun run android
# or prebuild native projects then run
bun run android:prebuild
```

- iOS (on macOS):

```bash
bun run ios
# or prebuild then run
bun run ios:prebuild
```

Ensure Java 17 is installed for Android builds. The Gradle wrapper is used automatically.

### Dev Build Shortcuts (APK)

Convenience PowerShell scripts live in `./scripts` and are exposed via package scripts.

- Debug/dev APK (includes expo-dev-client):

```powershell
bun dev
```

- Release APK (Gradle release):

```powershell
bun release
```

These scripts will:
- Verify Java 17
- Ensure `expo-dev-client` is present (debug script)
- Run `bun install` when Bun is available
- Use the Gradle wrapper to assemble APKs

If PowerShell execution is blocked, bypass policy for a single run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ./scripts/build-android-debug.ps1
```


### Scripts

- Start dev server (Dev Client + LAN): `bun s`
- Start dev server with cleared cache (Dev Client + LAN): `bun sclear`
- Tests (watch): `bun t`
- Lint: `bun lint`
- Format: `bun format`


### Package manager

 Bun is preferred. The repo includes a `bun.lock` and scripts use Bun.

### Features in App

- Auth  with Zustand + MMKV 
- Theming with light/dark toggle
- Tabs: Home, Map (Mapbox),Scan, Settings
- Map: driver marker, geocoded home address, route line + ETA, style toggle
- Packages modal with grid/card/list views and a history modal

### Project Structure

- `app/` Expo Router routes (`(tabs)`, `modal`, etc.)
- `components/` UI components (LoginScreen, DriverSheet, PackagesModal)
- `stores/` Zustand stores (e.g., `authStore`)
- `lib/` Utilities (Mapbox helpers, MMKV, misc)
- `constants/` Theme colors
- `global.css` Tailwind entry used by `metro.config.js`



### Notes / Roadmap

Planned next steps (see `NOTESnTODOS.md`):
- Add filters/search in Packages view when real data is available
- Rebuild history charts
- Settings enhancements, QR scanning, push notifications

### Troubleshooting

- Windows PowerShell execution policy may block the build scripts. Run with `-ExecutionPolicy Bypass` as shown above.
- If the Expo packager binds to `127.0.0.1`, use `bun run sc` to pick your LAN IPv4 automatically.
- Ensure `MAPBOX_ACCESS_TOKEN` is set; without it Mapbox maps/geocoding will not work.

