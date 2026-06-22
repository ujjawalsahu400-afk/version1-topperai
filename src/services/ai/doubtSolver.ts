import { openRouterService } from "./openRouterService";

export const doubtSolver = {
  async solveTextDoubt(question: string) {
    const prompt = `Student has a doubt: "${question}". Please explain it in a student-friendly way with examples.`;
    return openRouterService.sendMessage(prompt);
  },

  async solveImageDoubt(imageUri: string, context?: string) {
    const prompt = `Please solve this academic problem from the image. ${context || "Explain the steps clearly."}`;
    return openRouterService.analyzeImage(imageUri, prompt);
  }
};
