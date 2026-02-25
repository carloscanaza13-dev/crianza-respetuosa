#!/bin/bash

# Build script for Crianza Respetuosa APK
# This script prepares everything needed to build the Android APK

set -e

echo "=========================================="
echo "  Crianza Respetuosa - APK Build Script"
echo "=========================================="
echo ""

PROJECT_ROOT=$(pwd)
ANDROID_PROJECT="$PROJECT_ROOT/android-app"
DIST_DIR="$PROJECT_ROOT/dist"

# Check for Java
echo "Checking prerequisites..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
    echo "✓ Java $JAVA_VERSION found"
else
    echo "✗ Java not found. Please install JDK 17+"
    exit 1
fi

# Check for Android SDK
if [ -z "$ANDROID_HOME" ]; then
    if [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
    elif [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
    elif [ -d "/usr/local/android-sdk" ]; then
        export ANDROID_HOME="/usr/local/android-sdk"
    fi
fi

if [ -n "$ANDROID_HOME" ]; then
    echo "✓ Android SDK found at $ANDROID_HOME"
else
    echo "⚠ Android SDK not found. Building without native SDK..."
fi

# Create dist directory
mkdir -p "$DIST_DIR"

# Generate icons
echo ""
echo "Generating application icons..."
bun run scripts/generate-icons.ts 2>/dev/null || echo "  Using existing icons"

# Build Next.js app
echo ""
echo "Building Next.js application..."
bun run build 2>/dev/null || echo "  Next.js build skipped (using static files)"

# Create a standalone HTML for the WebView
echo ""
echo "Preparing WebView content..."
cp -r "$PROJECT_ROOT/public"/* "$ANDROID_PROJECT/app/src/main/assets/" 2>/dev/null || true

# Build the Android project
echo ""
echo "Building Android APK..."
echo ""

cd "$ANDROID_PROJECT"

# Check if Gradle wrapper exists
if [ ! -f "gradlew" ]; then
    echo "Creating Gradle wrapper..."
    if command -v gradle &> /dev/null; then
        gradle wrapper --gradle-version 8.5
    else
        echo "Creating gradlew script..."
        cat > gradlew << 'GRADLEW'
#!/bin/bash
################################################################################
# Gradle wrapper script for Crianza Respetuosa
################################################################################

DEFAULT_GRADLE_VERSION=8.5
GRADLE_USER_HOME="${GRADLE_USER_HOME:-$HOME/.gradle}"
GRADLE_WRAPPER_DIR="$GRADLE_USER_HOME/wrapper/dists"
GRADLE_ZIP_URL="https://services.gradle.org/distributions/gradle-${DEFAULT_GRADLE_VERSION}-bin.zip"

# Download Gradle if not present
if [ ! -d "$GRADLE_WRAPPER_DIR/gradle-${DEFAULT_GRADLE_VERSION}" ]; then
    echo "Downloading Gradle ${DEFAULT_GRADLE_VERSION}..."
    mkdir -p "$GRADLE_WRAPPER_DIR"
    TEMP_ZIP=$(mktemp)
    curl -fsSL "$GRADLE_ZIP_URL" -o "$TEMP_ZIP"
    unzip -q "$TEMP_ZIP" -d "$GRADLE_WRAPPER_DIR"
    rm "$TEMP_ZIP"
fi

# Find Gradle installation
GRADLE_HOME=$(find "$GRADLE_WRAPPER_DIR" -name "gradle-${DEFAULT_GRADLE_VERSION}" -type d 2>/dev/null | head -1)

if [ -z "$GRADLE_HOME" ]; then
    echo "Gradle not found. Please install Gradle manually."
    exit 1
fi

# Execute Gradle
exec "$GRADLE_HOME/bin/gradle" "$@"
GRADLEW
        chmod +x gradlew
    fi
fi

# Build APK
if [ -n "$ANDROID_HOME" ]; then
    echo "Building with Android SDK..."
    ./gradlew assembleDebug
    cp "$ANDROID_PROJECT/app/build/outputs/apk/debug/app-debug.apk" "$DIST_DIR/CrianzaRespetuosa.apk"
    echo ""
    echo "✅ APK built successfully: $DIST_DIR/CrianzaRespetuosa.apk"
else
    echo "Building project structure for Android Studio..."
    
    # Create a ZIP file with the project
    cd "$PROJECT_ROOT"
    zip -r "$DIST_DIR/CrianzaRespetuosa-Android.zip" android-app -x "*.git*" -x "*node_modules*"
    
    echo ""
    echo "✅ Android project packaged: $DIST_DIR/CrianzaRespetuosa-Android.zip"
    echo ""
    echo "To build the APK:"
    echo "1. Open Android Studio"
    echo "2. Import the project from the ZIP file"
    echo "3. Build > Build Bundle(s) / APK(s) > Build APK(s)"
fi

echo ""
echo "=========================================="
echo "  Build Complete!"
echo "=========================================="
echo ""
echo "Output files:"
ls -la "$DIST_DIR/" 2>/dev/null || echo "  Check $DIST_DIR"
echo ""
