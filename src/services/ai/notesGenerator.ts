import { openRouterService } from "./openRouterService";
import { getNotesPrompt } from "./notesPrompts";
import { NoteType, NoteSource } from "@/features/notes/types/note";

export const notesGenerator = {
  async generateFromTopic(topic: string, type: NoteType) {
    const prompt = getNotesPrompt(type, topic);
    return openRouterService.sendMessage(prompt);
  },

  async generateFromImage(imageUri: string, type: NoteType, userPrompt?: string) {
    const topic = userPrompt || "the content in this image";
    const prompt = getNotesPrompt(type, topic);
    return openRouterService.analyzeImage(imageUri, prompt);
  },

  async generateFromText(text: string, type: NoteType) {
    const prompt = `${getNotesPrompt(type, "the provided text")}\n\nSource Text:\n${text}`;
    return openRouterService.sendMessage(prompt);
  },

  async generateFromPDF(pdfText: string, type: NoteType) {
    // PDF text extraction should be done before calling this
    const prompt = `${getNotesPrompt(type, "the provided PDF content")}\n\nPDF Content:\n${pdfText}`;
    return openRouterService.sendMessage(prompt);
  }
};
