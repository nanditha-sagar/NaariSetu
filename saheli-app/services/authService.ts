import { auth, db } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

export interface ProfileInput {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  age?: number | null;
  dob?: string | null;
  country?: string;
  state?: string;
  city?: string;
  blood_group?: string;
  marital_status?: string;
  occupation?: string;
  height?: string;
  weight?: string;
}

export const authService = {
  async signUp(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    return { user: userCredential.user };
  },

  async createProfile(profile: ProfileInput) {
    await setDoc(doc(db, "profiles", profile.id), profile);
  },

  async updateProfile(profile: Partial<ProfileInput> & { id: string }) {
    const { id, ...data } = profile;
    await updateDoc(doc(db, "profiles", id), data);
  },

  async getProfile(id: string) {
    const docSnap = await getDoc(doc(db, "profiles", id));
    if (!docSnap.exists()) throw new Error("Profile not found");
    return docSnap.data() as ProfileInput;
  },
};
