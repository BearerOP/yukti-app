# Android Debug Build Guide - USB Debugging

## Prerequisites ✅

Your environment is ready:
- ✅ ADB installed (version 1.0.41)
- ✅ Android device connected (ZD2225M2JY)
- ✅ USB debugging enabled
- ✅ Expo SDK 54 installed

## Quick Start - Build & Install

### Option 1: Using Expo Dev Client (Recommended for Development)

This is the **fastest** method for development with hot reload:

```bash
cd /Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti

# Build and install dev client on your device
npx expo run:android --device

# This will:
# 1. Build the Android app with dev client
# 2. Install it on your connected device via USB
# 3. Start Metro bundler
# 4. Launch the app automatically
```

**Features:**
- Hot reload enabled
- Full debugging capabilities
- Native module support (Solana Mobile Wallet Adapter)
- Automatic updates when you save code

### Option 2: Build Standalone Debug APK

If you want a standalone APK that doesn't need Metro bundler:

```bash
cd /Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti

# Build debug APK
npx expo run:android --variant debug --no-install

# The APK will be in:
# android/app/build/outputs/apk/debug/app-debug.apk

# Install manually via USB
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Step-by-Step Instructions

### Step 1: Prepare Your Device

1. **Enable Developer Options** (if not already):
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging**:
   - Settings → Developer Options
   - Enable "USB Debugging"

3. **Connect via USB**:
   - Plug your device into your computer
   - Allow USB debugging when prompted

4. **Verify connection**:
   ```bash
   adb devices
   # Should show: ZD2225M2JY    device
   ```

### Step 2: Build and Run

**Method A: Quick Development Build (Recommended)**

```bash
cd /Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti

# Clean previous builds (optional but recommended)
rm -rf android/app/build

# Build and run on device
npx expo run:android --device
```

**What this does:**
1. Generates Android project in `/android` folder
2. Installs dependencies
3. Builds debug APK with dev client
4. Installs on your device
5. Starts Metro bundler
6. Opens app on device

**Method B: Build APK Only**

```bash
cd /Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti

# Build APK without installing
npx expo run:android --variant debug --no-install

# Find your APK at:
# android/app/build/outputs/apk/debug/app-debug.apk

# Install manually
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 3: Launch the App

The app will launch automatically, or you can launch manually:

```bash
# Launch the app
adb shell am start -n com.bearer.yukti/.MainActivity

# View logs
adb logcat *:S ReactNative:V ReactNativeJS:V
```

## Troubleshooting

### Device Not Detected

```bash
# Check connection
adb devices

# If no devices listed:
# 1. Replug USB cable
# 2. Revoke and re-allow USB debugging on device
# 3. Try different USB port

# Kill and restart ADB server
adb kill-server
adb start-server
adb devices
```

### Build Fails

```bash
# Clean everything
cd android
./gradlew clean
cd ..
rm -rf android/app/build

# Rebuild
npx expo run:android --device
```

### Metro Bundler Issues

```bash
# Clear Metro cache
npx expo start --clear

# In another terminal, run:
npx expo run:android --device
```

### Native Module Issues (Solana Wallet Adapter)

The Solana Mobile Wallet Adapter requires a dev client build:

```bash
# This is already done with npx expo run:android
# But if you have issues, rebuild:
rm -rf android
npx expo prebuild --clean
npx expo run:android --device
```

## Development Workflow

### After Initial Build

Once you've built and installed the app, for daily development:

```bash
# Terminal 1: Start Metro bundler
cd /Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti
npx expo start --dev-client

# The app on your device will connect automatically
# Make code changes and they'll hot reload!
```

### Rebuild Only When Needed

You only need to rebuild when:
- Native dependencies change (package.json)
- Native modules are added
- Android configuration changes (app.json, build.gradle)

Otherwise, just use Metro bundler with hot reload!

## Build Scripts

I've added these scripts to your package.json:

```json
{
  "scripts": {
    "android": "npx expo run:android --device",
    "android:build": "npx expo run:android --variant debug --no-install",
    "android:install": "adb install -r android/app/build/outputs/apk/debug/app-debug.apk",
    "android:logs": "adb logcat *:S ReactNative:V ReactNativeJS:V",
    "android:clean": "cd android && ./gradlew clean && cd .."
  }
}
```

**Usage:**

```bash
# Build and run on device
npm run android

# Build APK only
npm run android:build

# Install existing APK
npm run android:install

# View logs
npm run android:logs

# Clean build
npm run android:clean
```

## APK Location

After building, your APK will be at:

```
/Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti/android/app/build/outputs/apk/debug/app-debug.apk
```

You can:
- Install it: `adb install -r app-debug.apk`
- Share it: Copy to another device
- Archive it: Keep for testing

## Testing Wallet Integration

After installing:

1. **Open the app** on your device
2. **Navigate to Wallet tab**
3. **Tap "Connect Phantom"**
4. **Phantom wallet will open** (make sure it's installed)
5. **Approve connection**
6. **Return to Yukti** - balance should show ✅

## Performance Tips

### Faster Builds

```bash
# Use daemon
cd android
./gradlew --daemon

# Parallel builds
cd android
./gradlew assembleDebug --parallel
```

### Faster Installs

```bash
# Skip animations
adb shell settings put global window_animation_scale 0
adb shell settings put global transition_animation_scale 0
adb shell settings put global animator_duration_scale 0
```

## Device Info

**Your Connected Device:**
- Device ID: `ZD2225M2JY`
- Connection: USB
- Status: Ready for development ✅

**Package Details:**
- Package Name: `com.bearer.yukti`
- Main Activity: `.MainActivity`

## Next Steps

1. **Build the app**:
   ```bash
   cd /Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti
   npx expo run:android --device
   ```

2. **Wait for build** (first build takes 5-10 minutes)

3. **App launches automatically** on your device

4. **Start developing** - code changes hot reload!

## Quick Command Reference

```bash
# Build and run
npx expo run:android --device

# Start dev server only
npx expo start --dev-client

# View device logs
adb logcat | grep -i yukti

# Uninstall app
adb uninstall com.bearer.yukti

# Reinstall
adb install -r app-debug.apk

# Take screenshot
adb shell screencap -p /sdcard/screen.png
adb pull /sdcard/screen.png

# Record screen
adb shell screenrecord /sdcard/demo.mp4
# Stop recording: Ctrl+C
adb pull /sdcard/demo.mp4
```

## Summary

✅ **Environment ready**
✅ **Device connected**
✅ **USB debugging enabled**
✅ **Ready to build!**

**Run this command to start:**
```bash
cd /Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti && npx expo run:android --device
```

The app will build, install, and launch on your device automatically! 🚀
