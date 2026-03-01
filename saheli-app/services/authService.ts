import { supabase } from "@/utils/supabase";

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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async createProfile(profile: ProfileInput) {
    const { error } = await supabase.from("profiles").insert([profile]);
    if (error) throw error;
  },

  async updateProfile(profile: Partial<ProfileInput> & { id: string }) {
    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", profile.id);
    if (error) throw error;
  },

  async getProfile(id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
};
