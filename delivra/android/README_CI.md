CI notes for Android build

This repository includes a GitHub Actions workflow at `.github/workflows/android-release.yml` that builds the release APK using Java 17.

Optional keystore/signing
- To sign the APK in CI, add the following secrets to the GitHub repo settings:
  - SIGNING_KEYSTORE: base64-encoded contents of your JKS file
  - KEY_ALIAS
  - KEYSTORE_PASSWORD
  - KEY_PASSWORD

The workflow decodes `SIGNING_KEYSTORE` into `delivra/android/keystore.jks` and appends properties to `delivra/android/gradle.properties` so the Gradle signing config can pick them up.

Triggering
- Workflow runs on push to `main` and `test-build`, on PRs targeting those branches, or manually via the Actions tab (workflow_dispatch).

Automatic issue creation on failure
- When the build fails, the workflow will capture the Gradle build log and open a GitHub issue (using `peter-evans/create-issue`) with the last 1000 lines of the log attached as the issue body.
- The workflow also uploads the full Gradle build log as a workflow artifact and the created issue includes a link to the run artifacts page so you can download the complete log.
- The issue will be labeled `ci-failure, android` for easy triage.
- The action uses the repository `GITHUB_TOKEN` so no additional token is required.
