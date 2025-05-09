// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {

    apiKey: "AIzaSyDz73cdRmtV2RPzOWl7PcUINomyX_sUqoM",
  
    authDomain: "relevamiento-visual-5d337.firebaseapp.com",
  
    projectId: "relevamiento-visual-5d337",
  
    storageBucket: "relevamiento-visual-5d337.firebasestorage.app",
  
    messagingSenderId: "269445534969",
  
    appId: "1:269445534969:web:9f63e7c4fed48f0bd97e28"
  
  }  
};


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cajfqwqdaennyaaakxvo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhamZxd3FkYWVubnlhYWFreHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NzM3MDYsImV4cCI6MjA2MjI0OTcwNn0.9jxR4IEYNrVs3gdlExh6LojgvBmRQ-LkDFBQzBUpGQI';

export const supabase = createClient(supabaseUrl, supabaseKey);
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
