import { auth } from './admin.js';
import dotenv from "dotenv"
dotenv.config();

const uid = process.env.ADMIN_UID;
await auth.setCustomUserClaims(uid, { isAdmin: true });
console.log(`Set admin claim for ${uid}`);
