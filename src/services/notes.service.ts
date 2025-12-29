import { supabase } from './supabase';
import { Note, CreateNoteDTO, UpdateNoteDTO } from '@/types/note';

export const notesService = {
  getNotes: async (): Promise<Note[]> => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  createNote: async (note: CreateNoteDTO): Promise<Note> => {
    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateNote: async (id: string, note: UpdateNoteDTO): Promise<Note> => {
    // Automatically update updated_at if trigger doesn't cover it or just rely on trigger
    const { data, error } = await supabase
      .from('notes')
      .update(note)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteNote: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};
