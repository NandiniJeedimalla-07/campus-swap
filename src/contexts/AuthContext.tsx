import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string, name: string, collegeId: string, phone: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setUserRole: (role: 'buyer' | 'seller') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Enforce domain restriction on session restoration as well? 
        // If we want to strictly block access, we should check here too.
        // But the user specifically asked about "when we are login in". 
        // Let's implement strict check here to be safe, or just rely on login/signup gates.
        // For now, let's keep it safe. If email doesn't match, force logout.
        if (firebaseUser.email && !firebaseUser.email.endsWith('@svecw.edu.in')) {
          console.log("User domain not allowed, signing out.");
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch extended user details from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({ ...userData, id: firebaseUser.uid }); // Ensure ID matches auth UID
        } else {
          // Fallback if doc doesn't exist yet (shouldn't happen in normal flow)
          console.error("User document not found in Firestore");
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Pre-check domain before even trying to auth (optimization)
      if (!email.endsWith('@svecw.edu.in')) {
        return { success: false, message: 'Access denied: Email must belong to @svecw.edu.in domain.' };
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Double check strictly
      if (!userCredential.user.email?.endsWith('@svecw.edu.in')) {
        await signOut(auth);
        return { success: false, message: 'Access denied: Email must belong to @svecw.edu.in domain.' };
      }

      return { success: true };
    } catch (error) {
      console.error("Login failed", error);
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    collegeId: string,
    phone: string
  ): Promise<{ success: boolean; message?: string }> => {
    // 1. Email Domain Validation
    if (!email.endsWith('@svecw.edu.in')) {
      return { success: false, message: 'Email must belong to @svecw.edu.in domain.' };
    }

    // 2. Strong Password Validation (Min 6 chars)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return {
        success: false,
        message: 'Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'
      };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const newUser: User = {
        id: user.uid,
        email,
        name,
        collegeId,
        phone,
        role: 'buyer',
        createdAt: new Date(), // This will be stored as Timestamp in Firestore
      };

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), newUser);

      // No need to setUser here, onAuthStateChanged will pick it up
      return { success: true };
    } catch (error: any) {
      console.error("Signup failed", error);
      let errorMessage = 'An error occurred during signup.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use the Login page to sign in with your existing credentials.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak.';
      }
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const setUserRole = async (role: 'buyer' | 'seller') => {
    if (user) {
      try {
        // Update in Firestore
        const userDocRef = doc(db, 'users', user.id);
        await setDoc(userDocRef, { role }, { merge: true });

        // Optimistically update local state
        setUser({ ...user, role });
      } catch (error) {
        console.error("Failed to update role", error);
      }
    }
  };

  // Prevent rendering children until initial load is done to avoid redirects
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      setUserRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
