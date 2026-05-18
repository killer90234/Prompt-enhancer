'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, increment, runTransaction } from 'firebase/firestore';
import { auth, db, googleProvider, PLAN_LIMITS } from './firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: 'free' | 'basic' | 'premium' | 'max';
  promptsUsedToday: number;
  lastPromptReset: string; // YYYY-MM-DD
  createdAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  promptsRemaining: number;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  incrementPromptUsage: () => Promise<boolean>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Calculate prompts remaining
  const promptsRemaining = profile
    ? PLAN_LIMITS[profile.plan]?.promptsPerDay === -1
      ? Infinity
      : Math.max(0, PLAN_LIMITS[profile.plan].promptsPerDay - profile.promptsUsedToday)
    : 0;

  // Fetch or create user profile in Firestore
  async function fetchOrCreateProfile(user: User): Promise<UserProfile> {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      // Reset daily counter if new day
      if (data.lastPromptReset !== getTodayStr()) {
        const updated = { ...data, promptsUsedToday: 0, lastPromptReset: getTodayStr() };
        await setDoc(ref, updated, { merge: true });
        return updated;
      }
      return data;
    }

    // Create new profile
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'User',
      plan: 'free',
      promptsUsedToday: 0,
      lastPromptReset: getTodayStr(),
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, newProfile);
    return newProfile;
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userProfile = await fetchOrCreateProfile(firebaseUser);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Login with email/password
  async function login(email: string, password: string) {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
      throw err;
    }
  }

  // Sign up with email/password
  async function signup(email: string, password: string, name: string) {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Profile will be created by onAuthStateChanged
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
      throw err;
    }
  }

  // Login with Google
  async function loginWithGoogle() {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
      throw err;
    }
  }

  // Logout
  async function logout() {
    await signOut(auth);
    setProfile(null);
  }

  // Increment prompt usage (rate limiting) — uses Firestore transaction to prevent race conditions
  async function incrementPromptUsage(): Promise<boolean> {
    if (!user || !profile) return false;

    const limit = PLAN_LIMITS[profile.plan]?.promptsPerDay;
    const ref = doc(db, 'users', user.uid);
    const today = getTodayStr();

    try {
      const allowed = await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) return false;

        const data = snap.data() as UserProfile;
        let currentCount = data.promptsUsedToday;
        let lastReset = data.lastPromptReset;

        // Reset counter if new day
        if (lastReset !== today) {
          currentCount = 0;
          lastReset = today;
        }

        // Unlimited for max plan
        if (limit === -1) {
          transaction.update(ref, {
            promptsUsedToday: currentCount + 1,
            lastPromptReset: lastReset,
          });
          return true;
        }

        // Check rate limit
        if (currentCount >= limit) {
          return false;
        }

        // Increment atomically
        transaction.update(ref, {
          promptsUsedToday: currentCount + 1,
          lastPromptReset: lastReset,
        });
        return true;
      });

      if (!allowed) {
        if (limit !== -1) {
          setError(`Daily limit reached (${limit} prompts/day). Upgrade your plan for more.`);
        }
        return false;
      }

      // Update local state
      setProfile((prev) => prev ? { ...prev, promptsUsedToday: (prev.lastPromptReset !== today ? 0 : prev.promptsUsedToday) + 1, lastPromptReset: today } : prev);
      return true;
    } catch (err: any) {
      console.error('Rate limit check failed:', err);
      // Allow the request on Firestore errors (fail open)
      return true;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        promptsRemaining,
        login,
        signup,
        loginWithGoogle,
        logout,
        incrementPromptUsage,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
