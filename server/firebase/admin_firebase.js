import { initializeApp } from "firebase-admin/app";
import admin from 'firebase-admin'
import serviceAccount from './admin-incident-report-dev-firebase-adminsdk-mufh9-9e6b7ad814.js'

const app = initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export default app;