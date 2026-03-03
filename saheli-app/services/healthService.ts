import { auth, db } from "../utils/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { ScreeningEntry, AssessmentData } from "../utils/data";

// Storage helpers migrated to Firebase Firestore
export async function saveScreening(entry: ScreeningEntry): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await setDoc(doc(db, "screenings", entry.id), {
      user_id: user.uid,
      type: entry.type,
      condition: entry.condition,
      risk: entry.risk,
      confidence: entry.confidence,
      tests: entry.tests,
      image_uri: entry.imageUri,
      timestamp: entry.timestamp,
      answers: entry.answers,
    });
  } catch (e) {
    console.error("Failed to save screening to Firestore:", e);
  }
}

export async function saveFullAssessment(data: AssessmentData): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    // 1. Update Profile with persistent data
    const profileRef = doc(db, "profiles", user.uid);
    await setDoc(
      profileRef,
      {
        dob: data.dob,
        blood_group: data.bloodGroup,
        marital_status: data.maritalStatus,
        occupation: data.occupation,
        height: data.height,
        weight: data.weight,
        updated_at: new Date().toISOString(),
      },
      { merge: true },
    );

    // 2. Save assessment record
    const newAssessmentRef = doc(collection(db, "assessments"));
    await setDoc(newAssessmentRef, {
      user_id: user.uid,
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Failed to save full assessment to Firestore:", e);
    throw e;
  }
}

export async function getScreenings(): Promise<ScreeningEntry[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const screeningsQuery = query(
      collection(db, "screenings"),
      where("user_id", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
    const querySnapshot = await getDocs(screeningsQuery);

    const screenings: ScreeningEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      const row = docSnap.data();
      screenings.push({
        id: docSnap.id,
        type: row.type,
        condition: row.condition,
        risk: row.risk,
        confidence: row.confidence,
        tests: row.tests,
        imageUri: row.image_uri,
        timestamp: row.timestamp,
        answers: row.answers,
      });
    });

    return screenings;
  } catch (e) {
    console.error("Failed to load screenings from Firestore:", e);
    return [];
  }
}

export async function getLatestScreening(): Promise<ScreeningEntry | null> {
  const screenings = await getScreenings();
  return screenings.length > 0 ? screenings[0] : null;
}

export async function saveDailyLog(
  category: string,
  value: number | boolean,
): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];
    const logId = `${user.uid}_${today}`;
    const logRef = doc(db, "daily_logs", logId);

    const docSnap = await getDoc(logRef);
    const currentData = docSnap.exists() ? docSnap.data().data || {} : {};
    const newData = { ...currentData, [category]: value };

    await setDoc(
      logRef,
      {
        user_id: user.uid,
        date: today,
        data: newData,
        updated_at: new Date().toISOString(),
      },
      { merge: true },
    );
  } catch (e) {
    console.error("Failed to save daily log to Firestore:", e);
  }
}

export async function getDailyLog(date?: string): Promise<Record<string, any>> {
  try {
    const user = auth.currentUser;
    if (!user) return {};

    const targetDate = date || new Date().toISOString().split("T")[0];
    const logId = `${user.uid}_${targetDate}`;
    const logRef = doc(db, "daily_logs", logId);

    const docSnap = await getDoc(logRef);
    if (!docSnap.exists()) return {};

    return docSnap.data().data || {};
  } catch (e) {
    console.error("Failed to load daily log from Firestore:", e);
    return {};
  }
}

// Format date helpers
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

export function getTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Blood Pressure Firestore CRUD ───

export interface BPReading {
  id?: string;
  userId: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  position: "Sitting" | "Standing" | "Lying down";
  arm: "Left" | "Right";
  symptoms: string[];
  stressLevel: "Low" | "Medium" | "High";
  notes: string;
  category: string;
  alertStatus: "green" | "orange" | "red";
  timestamp: string; // ISO String
}

export async function saveBPReading(reading: Omit<BPReading, "userId">): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const newReadingRef = doc(collection(db, "bloodPressure"));
    await setDoc(newReadingRef, {
      ...reading,
      userId: user.uid,
    });
  } catch (e) {
    console.error("Failed to save BP reading to Firestore:", e);
    throw e;
  }
}

export async function getBPReadings(): Promise<BPReading[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const bpQuery = query(
      collection(db, "bloodPressure"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(bpQuery);

    const readings: BPReading[] = [];
    querySnapshot.forEach((docSnap) => {
      readings.push({ id: docSnap.id, ...docSnap.data() } as BPReading);
    });

    return readings;
  } catch (e) {
    console.error("Failed to load BP readings from Firestore:", e);
    return [];
  }
}
