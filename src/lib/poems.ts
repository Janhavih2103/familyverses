import { supabase } from "./supabase";

export interface Poem {
  id: string;
  title: string;
  content: string;
  author: "Janhavi" | "Rashmi" | "Ravindra";
  date: string;
  tags: string[];
  favorite: boolean;
}

export async function getPoems(): Promise<Poem[]> {
  const { data, error } = await supabase
    .from("poems")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error loading poems:", error);
    return [];
  }

  return data as Poem[];
}

export async function addPoem(poem: Omit<Poem, "id">) {
  const newPoem = {
    ...poem,
    id: Date.now().toString(),
  };

  const { data, error } = await supabase.from("poems").insert([newPoem]);

  if (error) {
    console.error("Error adding poem:", error);
  }

  return data;
}

export async function updatePoem(id: string, updates: Partial<Poem>) {
  const { error } = await supabase
    .from("poems")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating poem:", error);
  }
}

export async function deletePoem(id: string) {
  const { error } = await supabase
    .from("poems")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting poem:", error);
  }
}

export async function toggleFavorite(id: string, favorite: boolean) {
  const { error } = await supabase
    .from("poems")
    .update({ favorite })
    .eq("id", id);

  if (error) {
    console.error("Error toggling favorite:", error);
  }
}

export const authorLabels: Record<string, string> = {
  Janhavi: "My Poems",
  Rashmi: "Mom's Poems",
  Ravindra: "Dad's Poems",
};

export const authorDescriptions: Record<string, string> = {
  Janhavi: "Verses from my heart, capturing moments and musings.",
  Rashmi: "Words of wisdom, warmth, and the beauty she sees in everyday life.",
  Ravindra: "Stories of time, memory, and the quiet strength of fatherhood.",
};