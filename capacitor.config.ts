import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.freedailymotivation.app',
  appName: 'Free Daily Motivation',
  webDir: 'out',
  // Production: Point to your live website with app parameter
  server: {
    url: 'https://freedailymotivation.com?app=true',
    cleartext: false // Use HTTPS
  }
  
  // For development: uncomment the config below and comment out the production config above
  /*
  server: {
    url: 'http://10.0.2.2:3000?app=true', // Development only
    cleartext: true
  }
  */
};

export default config;
