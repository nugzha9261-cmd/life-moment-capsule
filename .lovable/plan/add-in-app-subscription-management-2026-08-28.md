# Add In-App Subscription Management

## Goal
Give premium users a clear, Apple-compliant way to manage or cancel their subscription from inside REELIVE.

## Current state
- The Profile screen shows "Premium active" but has no manage/cancel action.
- The Paywall footer and Delete Account dialog only mention "Apple ID Account Settings" in text.
- There is no code path that opens the App Store subscriptions page.

## Plan

1. **Add a "Manage Subscription" row to Profile**
   - Show it only when the user is premium AND has a recurring (non-lifetime) subscription.
   - Place it directly under the premium banner on the Profile screen.
   - Label: "Manage subscription" with description "Cancel or change your plan".

2. **Open the App Store subscriptions page**
   - Use the `@capacitor/app` plugin's `openUrl` method.
   - URL: `https://apps.apple.com/account/subscriptions`.
   - On non-native platforms, fall back to a toast: "Open your Apple ID Subscriptions on your iPhone."

3. **Update existing copy**
   - Keep the Paywall footer disclosure text as-is (it already mentions Apple ID Account Settings).
   - Update the Delete Account dialog copy so it is consistent: "Any active subscription must be cancelled separately in your Apple ID Subscriptions."

4. **Verify the change**
   - Confirm the new row renders conditionally.
   - Confirm tapping it calls `App.openUrl` with the subscriptions URL.
   - Run the build/typecheck to ensure no regressions.

## Technical notes
- RevenueCat/StoreKit do not expose a direct "cancel subscription" API; Apple requires users to manage subscriptions through their Apple ID.
- The `@capacitor/app` plugin is already in the project and used elsewhere.
- No backend changes are needed; this is a client-side deep-link.
