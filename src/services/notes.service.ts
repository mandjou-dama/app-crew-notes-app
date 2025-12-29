import { supabase } from "./supabase";
import { Note, CreateNoteDTO, UpdateNoteDTO } from "@/types/note";

export const notesService = {
  getNotes: async (): Promise<Note[]> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false })
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return data || [];
  },

  getNoteById: async (noteId: string): Promise<Note | null> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", noteId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      // If note doesn't exist or user doesn't own it,
      // Supabase returns an error with no data
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(error.message);
    }

    return data;
  },

  createNote: async (note: CreateNoteDTO): Promise<Note> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("notes")
      .insert({
        ...note,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateNote: async (id: string, note: UpdateNoteDTO): Promise<Note> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    // Automatically update updated_at if trigger doesn't cover it or just rely on trigger
    const { data, error } = await supabase
      .from("notes")
      .update(note)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteNote: async (id: string): Promise<void> => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
  },
};
