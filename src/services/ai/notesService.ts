import { openRouterService } from './openRouterService';

export type NoteType = 'short' | 'detailed' | 'revision' | 'exam' | 'bullet';

export const notesService = {
  async generateNotes(prompt: string, type: NoteType) {
    const typeInstructions = {
      short: "Provide concise, high-level summaries of the core concepts.",
      detailed: "Provide in-depth explanations, background context, and thorough details.",
      revision: "Focus on quick-recall facts, key dates, and primary formulas.",
      exam: "Focus on likely exam questions, model answers, and critical terminology.",
      bullet: "Provide information strictly in a bulleted list format for easy scanning."
    };

    const systemPrompt = `
      You are an expert academic note-taker.
      Format: Markdown.
      Specific Type Instructions: \${typeInstructions[type]}
    `;

    const userPrompt = `Generate academic notes for the following content: \${prompt}`;

    return await openRouterService.sendMessage(userPrompt, [
      { role: 'system', content: systemPrompt }
    ]);
  }
};
