import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesService } from "@/services/notes.service";
import { notesKeys } from "./queryKeys";
import { CreateNoteDTO, UpdateNoteDTO } from "@/types/note";

export function useNotes() {
  return useQuery({
    queryKey: notesKeys.lists(),
    queryFn: () => notesService.getNotes(),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNoteDTO) => notesService.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}

export const useGetNoteById = (noteId: string) => {
  return useQuery({
    queryKey: notesKeys.detail(noteId),
    queryFn: () => notesService.getNoteById(noteId),
  });
};

export function searchNotes(query: string) {
  return useQuery({
    queryKey: notesKeys.search(query),
    queryFn: async () => {
      const allNotes = await notesService.getNotes();
      return allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase())
      );
    },
    enabled: query.length > 0,
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNoteDTO }) =>
      notesService.updateNote(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: notesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notesService.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}

export function useDeleteAllNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notesService.deleteAllNotes(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}
