# Frontend

This is the main frontend repository for the project.

## Tech Stack & Workflow

- **State Management:** [Zustand](https://github.com/pmndrs/zustand) for context and state management.
- **Expo SDK:** Using Expo 53 and EAS workflow (free tier) initially. Will migrate to GitHub Actions and Fastlane for CI/CD.
- **Styling:** [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native). Fallback to StyleSheet only when needed.
- **Local Storage:** [MMKV](https://github.com/mrousavy/react-native-mmkv) for fast local storage.
- **Maps:** [Mapbox](https://docs.mapbox.com/) for map components, with builds tailored for Expo.
- **Development Builds:** Using Expo development builds early, as required features need custom native code.
- **Boilerplate:** Initial setup uses a fast Expo app template from npm. Some GitHub Actions adapted from the [obites repo](https://github.com/obites).
- **Testing:** [Jest](https://jestjs.io/) for unit testing. [Codecov](https://about.codecov.io/) enabled for pull request reviews.
- **Code Review:** Every pull request requires both automated and secondary human review/testing.

## Getting Started

1. **Clone the repo:**
   ```sh
   git clone <repo-url>
   cd Frontend
   ```

2. **Install dependencies (using Bun):**
   ```sh
   bun install
   ```

3. **Start the development server:**
   ```sh
   bunx expo start
   ```

## Contributing

- Ensure all tests pass before submitting a PR.
- PRs require both automated checks and manual review.
- Follow the established code style and conventions.
