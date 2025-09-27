# Android Release Build Notes

This document captures the settings that allow `assembleRelease` to succeed after recent dependency and configuration updates.
****
## Expo / App Configuration

- `app.config.ts`
  - `newArchEnabled: false` to keep the classic architecture; `gradlew clean` can revert to defaults if this flag is removed.
  - Plugin list built from `expoPlugins`; `expo-dev-client` only added when `EXPO_DEV_CLIENT=true`.
  - Expo `android.package`: `com.delivra`.

## Dependency Versions

| Package | Version | Notes |
| ------- | ------- | ----- |
| `react-native` | `0.79.5` | Expo SDK 53 baseline. |
| `react-native-reanimated` | `3.16.0` | Babel config filters out the optional `react-native-worklets/plugin`. |
| `react-native-mmkv` | `2.12.2` | Works with classic architecture + Hermes. |
| `@rnmapbox/maps` | `^10.1.41` | Requires Mapbox downloads token (see Gradle config). |
| `expo` | `^53.0.9` | Provides Expo Router + modules. |
| `nativewind` | `4.1.23` | Requires custom Babel integration (see below). |

## Babel Configuration (`babel.config.js`)

```js
const nativewind = require('nativewind/babel');

module.exports = function (api) {
  api.cache(true);
  const { plugins: nativewindPlugins } = nativewind(api);
  const filteredNativewindPlugins = nativewindPlugins.filter(
    (plugin) => !(typeof plugin === 'string' && plugin === 'react-native-worklets/plugin')
  );

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: [...filteredNativewindPlugins, 'react-native-reanimated/plugin'],
  };
};
```

This avoids pulling in `react-native-worklets/plugin`, which caused Metro/Babel failures when the module was absent.

## Gradle Configuration

### `android/gradle.properties`

```
hermesEnabled=true
android.useAndroidX=true
org.gradle.jvmargs=-Xmx6g -XX:MaxMetaspaceSize=1g -XX:+HeapDumpOnOutOfMemoryError -Dkotlin.daemon.jvm.options=-Xmx4g
```

- Hermes stays enabled (`true`).
- Additional JVM heap (6 GB) prevents `lintVitalAnalyzeRelease` from exhausting heap when building bundles.
- Mapbox downloads token is now resolved automatically; keep secrets out of version control and let `settings.gradle` read them from your preferred source.

### `android/settings.gradle`

```
dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    google()
    mavenCentral()
    maven { url = uri("$rootDir/../node_modules/react-native/android") }
    maven { url = uri("$rootDir/../node_modules/jsc-android/dist") }
    maven {
      url = uri("https://api.mapbox.com/downloads/v2/releases/maven")
      credentials {
        username = "mapbox"
        password = mapboxDownloadsToken
      }
      authentication { basic(BasicAuthentication) }
    }
  }
}
```

- `mapboxDownloadsToken` resolves once at the top of the file in this order: `-PMAPBOX_DOWNLOADS_TOKEN=...`, `MAPBOX_DOWNLOADS_TOKEN` environment variable, `.env.local` in the repo root, then `~/.gradle/gradle.properties`. An empty or missing token throws a clear Gradle exception.
- Developers can copy `.env.example` to `.env.local` and paste their personal tokens; `.env.local` is git-ignored.
- CI exposes both `MAPBOX_DOWNLOADS_TOKEN` and `MAPBOX_ACCESS_TOKEN` via workflow `env`, so no files need to be rewritten during builds.

### `android/app/build.gradle`

```
        def mapboxAccessToken = (findProperty("MAPBOX_ACCESS_TOKEN") ?: System.getenv("MAPBOX_ACCESS_TOKEN") ?: "")
        def escapedMapboxAccessToken = mapboxAccessToken.replace('\\', '\\\\').replace('"', '\\"')
        buildConfigField("String", "MAPBOX_ACCESS_TOKEN", "\"${escapedMapboxAccessToken}\"")
```

- Exposes the public Mapbox access token as `BuildConfig.MAPBOX_ACCESS_TOKEN` for runtime use while keeping it out of source files.
### `android/app/src/main/res/values/styles.xml`

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
  <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
  <item name="colorPrimary">@color/colorPrimary</item>
  <item name="android:statusBarColor">#ffffff</item>
</style>
```

Switching the base theme back to `Theme.AppCompat.Light.NoActionBar` resolves missing `Theme.EdgeToEdge` resources when rebuilding from a clean state.

## Build Command

```
cd android
./gradlew.bat assembleRelease --no-daemon
```

Make sure `MAPBOX_DOWNLOADS_TOKEN` is available through `~/.gradle/gradle.properties` or the environment before running the release build.
