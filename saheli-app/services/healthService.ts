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
import {
  AnemiaLogEntry,
  MoodLogEntry,
  PeriodLogEntry,
  SkinLogEntry,
} from "../utils/trackerData";
import { PCOSLogEntry } from "../utils/pcosTrackerData";
import { GeneralLogEntry } from "../utils/generalTrackerData";

// Helper to remove undefined fields from objects before saving to Firestore
const cleanData = (obj: any): any => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => {
    if (newObj[key] === undefined) {
      delete newObj[key];
    } else if (
      newObj[key] &&
      typeof newObj[key] === "object" &&
      !Array.isArray(newObj[key]) &&
      !(newObj[key] instanceof Date)
    ) {
      newObj[key] = cleanData(newObj[key]);
    }
  });
  return newObj;
};

// Storage helpers migrated to Firebase Firestore
export async function saveScreening(entry: ScreeningEntry): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await setDoc(
      doc(db, "screenings", entry.id),
      cleanData({
        user_id: user.uid,
        type: entry.type,
        condition: entry.condition,
        risk: entry.risk,
        confidence: entry.confidence,
        tests: entry.tests,
        image_uri: entry.imageUri,
        timestamp: entry.timestamp,
        answers: entry.answers,
      }),
    );
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
    await setDoc(
      newAssessmentRef,
      cleanData({
        user_id: user.uid,
        data: data,
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (e) {
    console.error("Failed to save full assessment to Firestore:", e);
    throw e;
  }
}

export async function getLatestAssessment(): Promise<AssessmentData | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const assessmentsQuery = query(
      collection(db, "assessments"),
      where("user_id", "==", user.uid),
    );
    const querySnapshot = await getDocs(assessmentsQuery);

    if (querySnapshot.empty) return null;

    // Sort manually to avoid index requirement
    const docs = querySnapshot.docs.sort((a, b) => {
      const tsA = a.data().timestamp || "";
      const tsB = b.data().timestamp || "";
      return tsB.localeCompare(tsA);
    });

    const row = docs[0].data();
    return row.data as AssessmentData;
  } catch (e) {
    console.error("Failed to load latest assessment from Firestore:", e);
    return null;
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
      cleanData({
        user_id: user.uid,
        date: today,
        data: newData,
        updated_at: new Date().toISOString(),
      }),
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

export async function saveBPReading(
  reading: Omit<BPReading, "userId">,
): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const newReadingRef = doc(collection(db, "bloodPressure"));
    await setDoc(
      newReadingRef,
      cleanData({
        ...reading,
        userId: user.uid,
      }),
    );
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
      orderBy("timestamp", "desc"),
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

// ─── Glucose Firestore CRUD ───

export interface GlucoseReading {
  id?: string;
  userId: string;
  value: number;
  timing:
  | "fasting"
  | "before_meal"
  | "after_meal_1h"
  | "after_meal_2h"
  | "random";
  source: "glucometer" | "lab" | "cgm";
  symptoms: string[];
  insulinMedication: boolean;
  mealType?: string;
  activity: boolean;
  notes: string;
  isPregnant: boolean;
  hasPCOS: boolean;
  stressLevel: "low" | "medium" | "high";
  category: string;
  alertStatus: "Green" | "Amber" | "Red" | "Crisis";
  timestamp: string; // ISO String
}

export async function saveGlucoseReading(
  reading: Omit<GlucoseReading, "userId">,
): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const newReadingRef = doc(collection(db, "glucose"));
    await setDoc(
      newReadingRef,
      cleanData({
        ...reading,
        userId: user.uid,
      }),
    );
  } catch (e) {
    console.error("Failed to save Glucose reading to Firestore:", e);
    throw e;
  }
}

export async function getGlucoseReadings(): Promise<GlucoseReading[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const glucoseQuery = query(
      collection(db, "glucose"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
    const querySnapshot = await getDocs(glucoseQuery);

    const readings: GlucoseReading[] = [];
    querySnapshot.forEach((docSnap) => {
      readings.push({ id: docSnap.id, ...docSnap.data() } as GlucoseReading);
    });

    return readings;
  } catch (e) {
    console.error("Failed to load Glucose readings from Firestore:", e);
    return [];
  }
}

// ─── Anemia Firestore CRUD ───
export async function saveAnemiaReading(entry: AnemiaLogEntry): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docId = `${user.uid}_${entry.date}`;
    await setDoc(
      doc(db, "anemia", docId),
      cleanData({ ...entry, userId: user.uid }),
    );
  } catch (e) {
    console.error("Failed to save Anemia reading to Firestore:", e);
    throw e;
  }
}

export async function getAnemiaReadings(): Promise<AnemiaLogEntry[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "anemia"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
    const snapshot = await getDocs(q);
    const readings: AnemiaLogEntry[] = [];
    snapshot.forEach((d) => readings.push({ ...d.data() } as AnemiaLogEntry));
    return readings;
  } catch (e) {
    console.error("Failed to load Anemia readings:", e);
    return [];
  }
}

// ─── PCOS Firestore CRUD ───
export async function savePCOSLog(entry: PCOSLogEntry): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docId = `${user.uid}_${entry.date}`;
    await setDoc(
      doc(db, "pcos", docId),
      cleanData({ ...entry, userId: user.uid }),
    );
  } catch (e) {
    console.error("Failed to save PCOS log to Firestore:", e);
    throw e;
  }
}

export async function getPCOSLogs(): Promise<PCOSLogEntry[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "pcos"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
    const snapshot = await getDocs(q);
    const logs: PCOSLogEntry[] = [];
    snapshot.forEach((d) => logs.push({ ...d.data() } as PCOSLogEntry));
    return logs;
  } catch (e) {
    console.error("Failed to load PCOS logs:", e);
    return [];
  }
}

// ─── General Health Firestore CRUD ───
export async function saveGeneralLog(entry: GeneralLogEntry): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docId = `${user.uid}_${entry.date}`;
    await setDoc(
      doc(db, "generalHealth", docId),
      cleanData({
        ...entry,
        userId: user.uid,
      }),
    );
  } catch (e) {
    console.error("Failed to save General Health log to Firestore:", e);
    throw e;
  }
}

export async function getGeneralLogs(): Promise<GeneralLogEntry[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "generalHealth"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
    const snapshot = await getDocs(q);
    const logs: GeneralLogEntry[] = [];
    snapshot.forEach((d) => logs.push({ ...d.data() } as GeneralLogEntry));
    return logs;
  } catch (e) {
    console.error("Failed to load General Health logs:", e);
    return [];
  }
}

// ─── Mood Firestore CRUD ───
export async function saveMoodEntry(entry: MoodLogEntry): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docId = `${user.uid}_${entry.date}`;
    await setDoc(
      doc(db, "mood", docId),
      cleanData({ ...entry, userId: user.uid }),
    );
  } catch (e) {
    console.error("Failed to save Mood log to Firestore:", e);
    throw e;
  }
}

export async function getMoodEntries(): Promise<MoodLogEntry[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "mood"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
    const snapshot = await getDocs(q);
    const logs: MoodLogEntry[] = [];
    snapshot.forEach((d) => logs.push({ ...d.data() } as MoodLogEntry));
    return logs;
  } catch (e) {
    console.error("Failed to load Mood logs:", e);
    return [];
  }
}

// ─── Period Firestore CRUD ───
export async function savePeriodLog(entry: PeriodLogEntry): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docId = `${user.uid}_${entry.date}`;
    await setDoc(
      doc(db, "periods", docId),
      cleanData({ ...entry, userId: user.uid }),
    );
  } catch (e) {
    console.error("Failed to save Period log to Firestore:", e);
    throw e;
  }
}

export async function getPeriodLogs(): Promise<PeriodLogEntry[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "periods"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
    const snapshot = await getDocs(q);
    const logs: PeriodLogEntry[] = [];
    snapshot.forEach((d) => logs.push({ ...d.data() } as PeriodLogEntry));
    return logs;
  } catch (e) {
    console.error("Failed to load Period logs:", e);
    return [];
  }
}

// ─── Skin Firestore CRUD ───
export async function saveSkinLog(entry: SkinLogEntry): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    const docId = `${user.uid}_${entry.date}`;
    await setDoc(
      doc(db, "skin", docId),
      cleanData({ ...entry, userId: user.uid }),
    );
  } catch (e) {
    console.error("Failed to save Skin log to Firestore:", e);
    throw e;
  }
}

export async function getSkinLogs(): Promise<SkinLogEntry[]> {
  try {
    const user = auth.currentUser;
    if (!user) return [];
    const q = query(
      collection(db, "skin"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
    );
    const snapshot = await getDocs(q);
    const logs: SkinLogEntry[] = [];
    snapshot.forEach((d) => logs.push({ ...d.data() } as SkinLogEntry));
    return logs;
  } catch (e) {
    console.error("Failed to load Skin logs:", e);
    return [];
  }
}
