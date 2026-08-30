import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexzonelabs.reelive',
  appName: 'REELIVE',
  webDir: 'dist',
  ios: {
    // iOS-specific settings for camera access
    contentInset: 'automatic',
    allowsLinkPreview: false,
    // Use bundled mode for App Store distribution — no hot-reload server
    scheme: 'reelive'
  },
  android: {
    // Android-specific settings for camera and fullscreen experience
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  }
};

export default config;
