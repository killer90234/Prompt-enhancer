import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBIWJS-hhVEb2-emiaH-tbhvv8ZRO2x1vg",
  authDomain: "prompt-enchancer-31c64.firebaseapp.com",
  projectId: "prompt-enchancer-31c64",
  storageBucket: "prompt-enchancer-31c64.firebasestorage.app",
  messagingSenderId: "717712903133",
  appId: "1:717712903133:web:1103305430770dd8a90434",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Rate limits per plan
export const PLAN_LIMITS: Record<string, { promptsPerDay: number; label: string }> = {
  free: { promptsPerDay: 5, label: 'Free' },
  basic: { promptsPerDay: 30, label: 'Basic' },
  premium: { promptsPerDay: 150, label: 'Premium' },
  max: { promptsPerDay: -1, label: 'Max' }, // -1 = unlimited
};
