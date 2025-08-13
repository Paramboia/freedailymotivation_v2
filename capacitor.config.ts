import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freedailymotivation.app',
  appName: 'Free Daily Motivation',
  webDir: 'out',
  server: {
    url: 'http://10.0.2.2:3000', // Android emulator's special IP to access host machine on port 3000
    cleartext: true
  }
};

export default config;
