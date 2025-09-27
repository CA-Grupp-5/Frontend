### Features

Developer experience first:

- ⚡ [Expo](https://expo.dev) for mobile development
- ⚛️ [React Native](https://reactnative.dev) for building native apps using React
- 🔥 Type checking [TypeScript](https://www.typescriptlang.org)
- 💎 Integrate with [NativeWind](https://www.nativewind.dev), Tailwind CSS for React Native
- 🌜 Light/Dark mode already setup with toggle
- 📊 MMKV (~30x faster than AsyncStorage and not Async usage)
- 📁 File-based routing with Expo Router
- 📏 Linter with [ESLint](https://eslint.org)
- 💖 Code Formatter with [Prettier](https://prettier.io)
- 🤡 Unit Testing with Jest
- 💡 Absolute Imports using `@` prefix

### Last Boilerplate Update

- ⚡ Expo SDK 53 (Including Expo Router 3.5, Expo UI...) + update all libraries
- ⚛️ React Native 0.79 (Including New Arch, Android Edge-to-Edge...)
- 💎 NativeWind 4.0
- 🥟 Bun

### Requirements

- Node.js 22+ (Recommended LTS)
- BUN IS VERY RECOMMENDED

### Mapbox Setup

- Copy `.env.example` to `.env.local` and populate both `MAPBOX_DOWNLOADS_TOKEN` (secret, starts with `sk.`) and `MAPBOX_ACCESS_TOKEN` (public, starts with `pk.`). `.env.local` is git-ignored.
- Alternatively, add `MAPBOX_DOWNLOADS_TOKEN=sk.your_token` to `~/.gradle/gradle.properties` if you prefer managing secrets there. Never commit the real token to this repo.
- CI workflows read the tokens from GitHub Actions secrets and expose them as environment variables, so no files are rewritten during automated builds.

### Dev build shortcuts

Two convenience scripts are available to run CI-style builds with Bun:

- Debug/dev APK (includes expo dev client):

```powershell
# from repo root
bun run dev
```

- Release APK (runs a release Gradle build):

```powershell
# from repo root
bun run release
```

Both commands execute the PowerShell scripts in `./scripts`, perform `bun install` when Bun is available, and invoke the Gradle wrapper. If PowerShell execution is blocked by policy, run the script with an explicit bypass:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ./delivra/scripts/build-android-debug.ps1
```

To enable automatic signing for releases in CI, provide a keystore and the CI secret names; the release workflow can be configured to use those secrets.
