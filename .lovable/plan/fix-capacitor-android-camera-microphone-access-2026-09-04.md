# Fix Capacitor Android camera/microphone access

## Diagnosis

### A. Root cause

The Android permissions are declared, but permission ownership is duplicated across three independent flows:

1. `MainActivity.onCreate()` immediately requests `CAMERA` and `RECORD_AUDIO` (and notifications) through the legacy Android permission API.
2. `useVideoRecording` then calls the Capacitor Camera plugin to request `CAMERA` again when the recording page mounts.
3. The combined `getUserMedia({ video, audio })` request triggers Capacitor's built-in `BridgeWebChromeClient`, which requests `CAMERA`, `RECORD_AUDIO`, and `MODIFY_AUDIO_SETTINGS` and grants or denies Chromium's WebView `PermissionRequest`.

Because the recording page initializes on mount, these flows can overlap during startup. The OS permission can appear **Allowed** in Settings while the WebView's own pending resource request is denied or interrupted, producing `NotAllowedError` and the current “Camera/microphone access denied” message. The minimum safe fix is to have one owner: Capacitor's built-in WebView permission handler.

### B. Evidence

- `src/pages/Record.tsx:58-62` calls `initCamera()` when the page mounts.
- `src/hooks/useVideoRecording.ts:76-103` separately calls `Camera.requestPermissions({ permissions: ['camera'] })`; this checks camera only, not microphone.
- `src/hooks/useVideoRecording.ts:150-160` makes a combined request with video constraints and audio constraints. Either track being denied causes the entire request to reject.
- `src/hooks/useVideoRecording.ts:167-188` maps `NotAllowedError` to one combined camera/microphone message, so it cannot identify which resource or permission flow failed.
- `android/app/src/main/java/com/nexzonelabs/reelive/MainActivity.java:17-51` independently requests camera, microphone, and notifications at startup.
- Capacitor 8.5's `BridgeWebChromeClient.onPermissionRequest()` already maps WebView video capture to `CAMERA`, audio capture to `RECORD_AUDIO` plus `MODIFY_AUDIO_SETTINGS`, and grants the WebView request only when all required Android permissions are granted.
- `android/app/src/main/AndroidManifest.xml:40-44` already declares `INTERNET`, `CAMERA`, `RECORD_AUDIO`, and `MODIFY_AUDIO_SETTINGS` once each; no duplicate or conflicting declarations were found.
- `capacitor.config.ts` uses bundled `webDir: 'dist'` and has no remote server or scheme override. Capacitor 8 defaults Android to `https://localhost`, so media capture runs in a secure context. No custom `WebChromeClient`, mixed-content setting, or origin override was found.
- Installed native/core Capacitor packages resolve to the compatible 8.x line; Android targets SDK 36 and uses the expected Capacitor bridge. No additional camera or microphone plugin is required for `getUserMedia`.

### C. Minimum fix

1. Simplify `MainActivity.java` to the standard `BridgeActivity` without requesting camera/microphone at startup.
2. Remove the Camera plugin permission preflight from `useVideoRecording.ts` and call the combined `getUserMedia` request directly. This lets Capacitor's built-in `BridgeWebChromeClient` perform the single Android runtime request for both resources.
3. Keep the existing exact-to-ideal camera constraint fallback and all recording/processing behavior unchanged.
4. Improve the permission error and diagnostic logging without changing the page layout: distinguish permanent/OS denial guidance from camera-busy, device-missing, and unsupported-constraint errors.
5. Do not add a custom `WebChromeClient`, new plugin, video-only fallback, or recording rewrite.

### D. Expected Android behavior

Because recording requests both `video` and `audio`, Android must grant both `CAMERA` and `RECORD_AUDIO`. Chromium sends one WebView resource request containing video and audio capture. Capacitor's stock `BridgeWebChromeClient` requests the matching Android permissions and grants the WebView resources only when all are allowed. If either permission is denied, the combined `getUserMedia` promise rejects; that is expected because Reelive records clips with sound.

If “Don't ask again” was selected, Android will not show another prompt. The app must direct the user to **Settings → Apps → Reelive → Permissions**; after both permissions are allowed, returning to the recording page and tapping **Try Again** will retry acquisition.

## Files to change

- `android/app/src/main/java/com/nexzonelabs/reelive/MainActivity.java`
  - Remove the duplicate startup runtime-permission request and related imports/constants.
- `src/hooks/useVideoRecording.ts`
  - Remove the Camera plugin preflight/import.
  - Let the combined `getUserMedia` call drive Capacitor's native WebView permission flow.
  - Preserve recording constraints and improve denial diagnostics/guidance.

No manifest, Capacitor config, dependency, UI, or unrelated feature changes are planned.

## Verification

1. Run the focused web tests/build checks after editing.
2. Confirm by source search that there is one media acquisition path and no custom Android WebView permission override.
3. On the development machine run:
   ```bash
   git pull
   npm install
   npm run build
   npx cap sync android
   ```
4. In Android Studio, uninstall the existing Reelive app from the physical phone (or clear its app data), then run the app again.
5. Open Record and allow **Camera** and **Microphone** when Android prompts. Confirm the live preview opens and a clip records with audio.
6. Test denial recovery: deny Microphone, confirm capture is rejected with Settings guidance, then enable it at **Settings → Apps → Reelive → Permissions → Microphone → Allow while using the app**, return, and tap **Try Again**.
7. Verify both **Camera** and **Microphone** show Allowed. Notification and photo/media permissions do not control `getUserMedia` capture.
8. If a device still rejects capture, collect Android Studio Logcat filtered by `chromium`, `PermissionRequest`, `Camera`, and `AudioRecord`; the enhanced browser error log will preserve the actual exception name/message for device-specific diagnosis.
