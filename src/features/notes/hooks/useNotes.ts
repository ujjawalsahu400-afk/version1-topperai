import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noteService } from "@/services/notes/noteService";
import { NoteType } from "../types/note";

export const useUserNotes = (userId: string, type?: NoteType) => {
  return useQuery({
    queryKey: ["notes", userId, type],
    queryFn: () => noteService.getNotes(userId, type),
    enabled: !!userId,
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => noteService.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
