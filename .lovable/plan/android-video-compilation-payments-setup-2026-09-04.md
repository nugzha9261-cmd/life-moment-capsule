# Android: video compilation + payments setup

## Short answers

**Shotstack** — no new account or second API key. Compilation runs entirely in your backend functions (`compile-video`, `compile-status`) using the `SHOTSTACK_API_KEY` / `SHOTSTACK_ENV` backend secrets. The same key serves iOS, Android and web. If compiling fails on Android it is not a platform key issue — it is either the secret's current value/environment (`stage` vs `v1`) or a request error we need to read from the function logs.

**Payments** — this one does need Android-specific work. RevenueCat uses a *different public key per platform*. The app currently hardcodes a single key (`appl_…`, an Apple key) for every platform, so on Android the SDK configures with an iOS key and purchases cannot work. You also need Google Play Console products wired to RevenueCat.

## What I will do in code

1. **Platform-aware RevenueCat key** — read an Android key (`VITE_REVENUECAT_ANDROID_KEY`, `goog_…`) and keep the existing Apple key for iOS, selecting via `Capacitor.getPlatform()`. Falls back gracefully with a clear console warning when the platform key is missing, so nothing breaks before you supply it.
2. **Compilation diagnostics** — check the backend function logs for the failing compile job and confirm the Shotstack secrets are set and pointing at the right environment; fix whatever the logs show (bad key, `stage` vs `v1`, clip URL access). No rewrite of the compile pipeline.

Nothing else changes.

## What you need to provide / do outside the app

Shotstack:
- Confirm/refresh `SHOTSTACK_API_KEY` and set `SHOTSTACK_ENV` to `stage` (free testing, watermark) or `v1` (production).

Payments (Google Play):
- Google Play Console developer account, app created, billing enabled.
- Create the subscription/one-time products with the **same product IDs** you used on iOS.
- In RevenueCat: add a **Google Play app** to the same project, upload the Play service-account credentials, attach the Play products to your existing entitlement and offerings.
- Copy the RevenueCat **Google API key** (`goog_…`) — send it to me and I will wire it in.
- Purchases only work from a build installed via Play (internal testing track) with a licensed tester account — not from a raw Android Studio debug install.

The RevenueCat webhook and entitlement logic already in the backend are platform-agnostic and need no changes.

## Testing

1. Rebuild: `npm run build && npx cap sync android`.
2. Try a compilation, then I read the backend logs to confirm the Shotstack render succeeded.
3. Upload an internal-testing build to Play, sign in with a licence tester, verify the paywall lists Android prices and a test purchase unlocks premium.
