import {initializeApp} from 'firebase/app'
import 'firebase/auth'

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY_ADMIN,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_ADMIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_ADMIN,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_ADMIN,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_ADMIN,
  appId: process.env.REACT_APP_FIREBASE_APP_ID_ADMIN
})

export default app