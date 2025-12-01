import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.maha.jamiareport',
  appName: 'JamiaReport',
  webDir: 'build', // or 'build' depending on your setup
  server: {
    androidScheme: 'https',
    cleartext: true, // Allow HTTP traffic for development //xml sy  bhi hatao
    allowNavigation: [
      'https://jamiat-report-app.vercel.app',
      'localhost:5000',
      'http://192.168.10.9:5000/api'
    ]
  },
  android: {
    allowMixedContent: true
  }
};

export default config;