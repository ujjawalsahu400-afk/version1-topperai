import { NoteType } from "@/features/notes/types/note";

export const getNotesPrompt = (type: NoteType, topic: string) => {
  const typeInstructions: Record<NoteType, string> = {
    'Short': "Create concise, high-level summary notes. Keep it very brief but cover the core idea.",
    'Detailed': "Create comprehensive, in-depth notes. Explain everything thoroughly with all necessary details.",
    'Revision': "Focus on key formulas, definitions, and quick facts. Best for last-minute review.",
    'Exam': "Highlight 'Important for Exams' sections. Include potential questions and focused tips.",
    'Bullet': "Structure the entire content into clear, logical bullet points for easy scanning."
  };

  return `
    You are TopperAI Notes Generator.
    Your goal is to generate student-friendly study notes for the topic: "${topic}".

    Style: ${typeInstructions[type]}

    Structure the output in Markdown using this exact hierarchy:
    # Title

    ## Overview
    (A brief introduction)

    ## Key Concepts
    (The fundamental ideas)

    ## Important Points
    (Critical takeaways)

    ## Examples
    (Real-world applications or illustrations)

    ## Quick Revision
    (Summary for fast learning)

    ## Exam Tips
    (What to focus on for high scores)

    Rules:
    - Use easy, beginner-friendly language.
    - Highlight important terms in **bold**.
    - Use lists and tables where appropriate.
    - Ensure the content is accurate and encouraging.
  `;
};
