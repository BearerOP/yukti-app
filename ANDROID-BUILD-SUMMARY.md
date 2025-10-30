# Android Debug Build - Quick Reference

## ✅ Environment Status

- **ADB Version**: 1.0.41 ✅
- **Connected Device**: ZD2225M2JY ✅
- **USB Debugging**: Enabled ✅
- **Expo SDK**: 54.0.14 ✅
- **Package**: com.bearer.yukti

## 🚀 Quick Commands

### Build and Install on Device
```bash
cd /Users/bearer/Downloads/Cohort/opinion-trading-platform/mobile-app/yukti
npm run android
```

### Development Workflow
```bash
# Start Metro bundler (after initial build)
npm start

# View logs
npm run android:logs

# Clean build
npm run android:clean
```

### Manual APK Management
```bash
# Build APK only
npm run android:build

# Install APK
npm run android:install

# Uninstall app
adb uninstall com.bearer.yukti
```

## 📱 Your Device

**Device ID**: `ZD2225M2JY`
**Status**: Connected via USB
**Ready for**: Development builds

## 🔧 Build Process

The current build is running in the background. It will:

1. ✅ Generate Android project structure
2. ⏳ Install dependencies and native modules
3. ⏳ Build debug APK with dev client
4. ⏳ Install on your device via ADB
5. ⏳ Start Metro bundler
6. ⏳ Launch app on device

**Estimated time**: 5-10 minutes (first build)

## 📦 Output Locations

**APK File**:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Build Logs**:
```bash
# View current build progress
tail -f /tmp/expo-build.log
```

## 🎯 What's Included

Your debug build includes:

✅ **All App Features**:
- Portfolio with "My Polls" tab
- Poll creation modal with custom date picker
- Wallet integration with Phantom
- Redux state management
- AsyncStorage persistence
- Auto-reconnect functionality

✅ **Native Modules**:
- Solana Mobile Wallet Adapter
- React Native Reanimated
- Vector Icons
- All required dependencies

✅ **Development Features**:
- Hot reload enabled
- Dev menu accessible (shake device)
- React DevTools support
- Metro bundler connection
- Console logging

## 🧪 Testing After Build

Once the build completes:

### 1. App Launches Automatically
The app will open on your device automatically.

### 2. Test Wallet Integration
```
1. Navigate to Wallet tab
2. Tap "Connect Phantom"
3. Approve in Phantom app
4. Return to Yukti
5. Balance should display ✅
```

### 3. Test Poll Creation
```
1. Navigate to Portfolio tab
2. Tap "My Polls" tab
3. Tap green FAB button
4. Create a poll
5. Poll appears in list ✅
```

### 4. Test Persistence
```
1. Connect wallet and note balance
2. Close app completely
3. Reopen app
4. Wallet should auto-reconnect ✅
5. Balance should be restored ✅
```

## 🔍 Debugging

### View Logs in Real-time
```bash
# React Native logs only
npm run android:logs

# All logs
adb logcat

# Filter by tag
adb logcat | grep "Yukti"
```

### Access Dev Menu
On device:
- Shake the device
- Or: `adb shell input keyevent 82`

### Reload App
- In Dev Menu: "Reload"
- Or: Double-tap R on keyboard (in Metro)

### Clear Cache
```bash
npm start -- --clear
```

## ⚡ Development Tips

### Faster Rebuilds
You only need to rebuild when:
- Native dependencies change
- Android configuration changes
- Native modules are added/updated

Otherwise, just use Metro bundler (hot reload)!

### Keep Metro Running
```bash
# Terminal 1: Metro bundler
npm start

# Make code changes - they hot reload automatically!
# No need to rebuild
```

### Installation Check
```bash
# Check if app is installed
adb shell pm list packages | grep yukti

# Should output: package:com.bearer.yukti
```

## 🛠️ Troubleshooting

### Build Fails
```bash
# Clean and rebuild
npm run android:clean
npm run android
```

### Device Not Found
```bash
# Restart ADB
adb kill-server
adb start-server
adb devices
```

### Metro Connection Issues
```bash
# Clear Metro cache
npm start -- --clear

# Or completely reset
rm -rf node_modules
npm install
npm start -- --clear
```

### App Crashes on Launch
```bash
# View crash logs
adb logcat | grep -i "fatal\|error"

# Common fix: Reinstall
adb uninstall com.bearer.yukti
npm run android
```

## 📊 Build Progress Monitoring

To check build progress:

```bash
# Method 1: Check process
ps aux | grep "expo run:android"

# Method 2: Check Metro bundler
# When build completes, Metro will start automatically
# You'll see: "Metro waiting on exp://..."
```

## ✅ Success Indicators

Build succeeded when you see:

```
✔ Built successfully!
✔ Installed the app on the device
✔ Starting Metro Bundler
✔ Opening app on device
```

## 🎉 Post-Build

After successful build:

1. **App is installed** on your device
2. **Metro is running** in terminal
3. **App is opened** on device
4. **Hot reload is active** - make changes and they reflect instantly!

## 📝 Next Steps

1. **Test all features** on device
2. **Make code changes** - they hot reload automatically
3. **Test wallet connection** with real Phantom app
4. **Test poll creation** and database integration
5. **Share APK** if needed: Copy from `android/app/build/outputs/apk/debug/`

## 🔗 Related Documentation

- [BUILD-ANDROID-DEBUG.md](BUILD-ANDROID-DEBUG.md) - Complete guide
- [WALLET-INTEGRATION-FIX.md](WALLET-INTEGRATION-FIX.md) - Wallet implementation
- [DATABASE-SETUP.md](../../backend-api/DATABASE-SETUP.md) - Backend setup

## 🆘 Need Help?

Common commands:
```bash
# Rebuild completely
rm -rf android
npm run android

# View device screen on computer
scrcpy  # If you have scrcpy installed

# Take screenshot
adb shell screencap -p /sdcard/screen.png
adb pull /sdcard/screen.png

# Record video
adb shell screenrecord /sdcard/demo.mp4
# Press Ctrl+C to stop
adb pull /sdcard/demo.mp4
```

---

**Build started**: Check progress in background terminal
**Your device**: ZD2225M2JY (Connected)
**Build command**: `npx expo run:android --device`

🚀 **Your Android debug build is in progress!**
