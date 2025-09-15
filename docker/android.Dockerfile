# Android build environment for React Native / Expo (bare)
# - Node 20 (for RN 0.79+)
# - JDK 17 (required by modern AGP)
# - Android SDK + cmdline-tools, build-tools and platforms

FROM node:20-bullseye

ENV DEBIAN_FRONTEND=noninteractive \
    ANDROID_HOME=/opt/android-sdk \
    ANDROID_SDK_ROOT=/opt/android-sdk \
    # ensure bun (installed later) is on PATH; Android SDK paths first
    PATH=/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools:/opt/android-sdk/emulator:/opt/android-sdk/tools/bin:/opt/android-sdk/tools:/root/.bun/bin:${PATH}

# Base packages and JDK 17
RUN apt-get update && \
        apt-get install -y --no-install-recommends \
            openjdk-17-jdk \
            wget \
            unzip \
            git \
            bash \
            curl \
            ca-certificates && \
        rm -rf /var/lib/apt/lists/*

# Install Android commandline-tools
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    cd /tmp && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O cmdtools.zip && \
    unzip -q cmdtools.zip && \
    rm cmdtools.zip && \
    mv cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest

# Accept licenses non-interactively
RUN yes | sdkmanager --licenses >/dev/null

# Install required SDK packages (include common API levels)
# Adjust versions if your project needs different ones.
RUN sdkmanager --install \
    "platform-tools" \
    "platforms;android-34" \
    "build-tools;34.0.0" \
    "platforms;android-35" \
    "build-tools;35.0.0" \
    "ndk;27.0.12077973" \
    "cmake;3.22.1"

# Enable Corepack so Yarn 4 from packageManager field is respected
RUN corepack enable

# Install Bun (used by CI when bun.lock is present). Installer places bun in /root/.bun by default.
RUN set -eux; \
        if ! command -v bun >/dev/null 2>&1; then \
            curl -fsSL https://bun.sh/install | bash; \
            ln -sf /root/.bun/bin/bun /usr/local/bin/bun || true; \
        fi

WORKDIR /workspace

# No source copied here; the workflow mounts the workspace into this container.

