import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import dotenv from "dotenv"
dotenv.config();
const raw = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

raw.private_key = raw.private_key.replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert(raw),
});

const auth = getAuth(app);
export { auth };
