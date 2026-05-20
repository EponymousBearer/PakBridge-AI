import { create } from 'zustand';
import { parseAreaAndCity, AreaInfo } from '@/services/areaKnowledge';
import { auth, db } from '@/services/firebaseConfig';
import { signInAnonymously, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'Citizen' | 'Authority';

export interface UserProfile {
  uid: string;
  name: string;
  role: UserRole;
  neighborhood: string;
  location: AreaInfo;
  pushTokens?: string[];
}

interface AuthState {
  user: UserProfile | null;
  isRegistered: boolean;
  isLoading: boolean;
  initializeAuth: () => void;
  registerUser: (name: string, role: UserRole, neighborhood: string) => Promise<void>;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isRegistered: false,
  isLoading: true,

  initializeAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            set({ 
              user: userDoc.data() as UserProfile, 
              isRegistered: true,
              isLoading: false 
            });
          } else {
            set({ isLoading: false });
          }
        } catch (e) {
          console.error('Error fetching user profile from Firestore:', e);
          set({ isLoading: false });
        }
      } else {
        // Not logged in at all
        set({ user: null, isRegistered: false, isLoading: false });
      }
    });
  },

  registerUser: async (name, role, neighborhood) => {
    set({ isLoading: true });
    try {
      // 1. Ensure anonymous login
      let firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        const credential = await signInAnonymously(auth);
        firebaseUser = credential.user;
      }

      if (!firebaseUser) throw new Error('Failed to authenticate anonymously');

      // 2. Resolve location
      const location = parseAreaAndCity(neighborhood);
      
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        name,
        role,
        neighborhood,
        location,
      };

      // 3. Save to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), profile);

      set({
        user: profile,
        isRegistered: true,
        isLoading: false,
      });
    } catch (e) {
      console.error('Registration error:', e);
      set({ isLoading: false });
    }
  },

  clearSession: () => {
    auth.signOut();
    set({ user: null, isRegistered: false });
  },
}));
