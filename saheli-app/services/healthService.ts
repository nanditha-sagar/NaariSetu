import { supabase } from "../utils/supabase";
import { ScreeningEntry, AssessmentData } from "../utils/data";

// Storage helpers migrated to Supabase
export async function saveScreening(entry: ScreeningEntry): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { error } = await supabase.from("screenings").insert([
      {
        id: entry.id,
        user_id: user.id,
        type: entry.type,
        condition: entry.condition,
        risk: entry.risk,
        confidence: entry.confidence,
        tests: entry.tests,
        image_uri: entry.imageUri,
        timestamp: entry.timestamp,
        answers: entry.answers,
      },
    ]);

    if (error) throw error;
  } catch (e) {
    console.error("Failed to save screening to Supabase:", e);
  }
}

export async function saveFullAssessment(data: AssessmentData): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // 1. Update Profile with persistent data
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        dob: data.dob,
        blood_group: data.bloodGroup,
        marital_status: data.maritalStatus,
        occupation: data.occupation,
        height: data.height,
        weight: data.weight,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (profileError) {
      if (profileError.code === "PGRST204") {
        console.warn(
          "Database schema mismatch: Ensure the 'profiles' table has columns: dob, blood_group, marital_status, occupation, height, weight.",
        );
      } else {
        console.error("Profile update error:", profileError);
      }
    }

    // 2. Save assessment record
    const { error: assessmentError } = await supabase
      .from("assessments")
      .insert([
        {
          user_id: user.id,
          data: data,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (assessmentError) throw assessmentError;
  } catch (e) {
    console.error("Failed to save full assessment to Supabase:", e);
    throw e;
  }
}

export async function getScreenings(): Promise<ScreeningEntry[]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("screenings")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) throw error;

    return (data || []).map((row) => ({
      id: row.id,
      type: row.type,
      condition: row.condition,
      risk: row.risk,
      confidence: row.confidence,
      tests: row.tests,
      imageUri: row.image_uri,
      timestamp: row.timestamp,
      answers: row.answers,
    }));
  } catch (e) {
    console.error("Failed to load screenings from Supabase:", e);
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const today = new Date().toISOString().split("T")[0];

    // Get existing logs for today to merge
    const { data: existingLog } = await supabase
      .from("daily_logs")
      .select("data")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    const currentData = existingLog?.data || {};
    const newData = { ...currentData, [category]: value };

    const { error } = await supabase.from("daily_logs").upsert(
      {
        user_id: user.id,
        date: today,
        data: newData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,date" },
    );

    if (error) throw error;
  } catch (e) {
    console.error("Failed to save daily log to Supabase:", e);
  }
}

export async function getDailyLog(date?: string): Promise<Record<string, any>> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return {};

    const targetDate = date || new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("daily_logs")
      .select("data")
      .eq("user_id", user.id)
      .eq("date", targetDate)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return data?.data || {};
  } catch (e) {
    console.error("Failed to load daily log from Supabase:", e);
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
