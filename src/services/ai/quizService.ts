import { openRouterService } from './openRouterService';

export type QuizDifficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'mcq' | 'true_false' | 'blanks' | 'subjective';

export const quizService = {
  async generateQuiz(prompt: string, type: QuestionType, difficulty: QuizDifficulty, count: number = 5) {
    const systemPrompt = `
      You are an academic examiner.
      Generate a quiz with exactly \${count} questions.
      Type: \${type}
      Difficulty: \${difficulty}
      Format: JSON array of objects.
      JSON Schema:
      [
        {
          "question": "string",
          "options": ["string"] (only for MCQ),
          "answer": "string",
          "explanation": "string"
        }
      ]
      Respond ONLY with valid JSON.
    `;

    const userPrompt = `Generate a quiz based on: \${prompt}`;

    const response = await openRouterService.sendMessage(userPrompt, [
      { role: 'system', content: systemPrompt }
    ]);

    try {
      // Robust JSON extraction: Find the first '[' and last ']' to ignore conversational text
      const startIdx = response.indexOf('[');
      const endIdx = response.lastIndexOf(']');

      if (startIdx === -1 || endIdx === -1) {
        throw new Error('No valid quiz JSON found in response');
      }

      const jsonStr = response.substring(startIdx, endIdx + 1);
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Quiz JSON Parse Error:', e, response);
      throw new Error('AI returned an invalid quiz format. Please try again.');
    }
  }
};
