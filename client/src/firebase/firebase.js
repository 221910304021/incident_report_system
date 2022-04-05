import {initializeApp} from 'firebase/app'
import 'firebase/auth'
import config from './config'
import { getAuth } from 'firebase/auth'

const app = initializeApp({
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId
})

export default app