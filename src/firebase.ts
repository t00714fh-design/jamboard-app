import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyAdCcvwgKiPi6a293O4blxEkL91TMueU2A", // ★元のapiKeyを入れてください
  authDomain: "jamboard-app-48edd.firebaseapp.com",
  databaseURL: "https://jamboard-app-48edd-default-rtdb.firebaseio.com",
  projectId: "jamboard-app-48edd",
  storageBucket: "jamboard-app-48edd.appspot.com",
  messagingSenderId: "953568207405",
  appId: "1:953568207405:web:b91cccee0dc82e3ea64ea4", // ★元のappIdを入れてください
  measurementId: "G-L39MX9LN3Q"
};

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)