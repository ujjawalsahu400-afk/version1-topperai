import { Platform } from "react-native";
import { AIHistoryItem, OpenRouterResponse } from "@/features/ai-chat/types/chat";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const getApiKey = (): string => {
  const key = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("Missing OpenRouter API Key. Please check your production environment variables.");
  }
  return key;
};

const SYSTEM_PROMPT = `
You are TopperAI Tutor, a helpful and encouraging academic assistant.
Rules:
- Explain complex concepts simply so a student can understand.
- Use real-world examples to illustrate points.
- Teach like a kind, patient teacher.
- Never give unnecessarily complex or overly technical answers.
- Encourage further learning and curiosity.
- Support Markdown formatting (bold, lists, tables, code blocks).
`;

/**
 * OpenRouter Service: Production Refactored
 * Features: Multi-model fallback, intelligent error parsing, and timeout protection.
 */
export const openRouterService = {
  async sendMessage(message: string, history: AIHistoryItem[] = []): Promise<string> {
    const modelsToTry = [
      "google/gemini-2.0-flash-lite-preview-02-05:free",
      "meta-llama/llama-3-8b-instruct:free",
      "google/gemini-flash-1.5:free",
      "huggingfaceh4/zephyr-7b-beta:free",
      "openrouter/auto"
    ];

    let lastError = "";

    for (const model of modelsToTry) {
      try {
        const apiKey = getApiKey();
        const headers: Record<string, string> = {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };

        if (Platform.OS !== "web") {
          headers["HTTP-Referer"] = "https://topperai.com";
          headers["X-Title"] = "TopperAI";
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s Safety Timeout

        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers,
          signal: controller.signal,
          body: JSON.stringify({
            model: model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...history,
              { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 2000,
          }),
        });

        clearTimeout(timeoutId);

        const text = await response.text();
        let data: OpenRouterResponse;

        try {
          data = JSON.parse(text);
        } catch (e) {
          console.warn(`[OpenRouter] Non-JSON response for ${model}:`, text.substring(0, 50));
          continue;
        }

        if (response.ok) {
          if (data.choices && data.choices[0]?.message?.content) {
            return data.choices[0].message.content;
          }
          continue;
        } else {
          lastError = data.error?.message || "Internal AI Provider Error";
          console.warn(`[OpenRouter] Model ${model} failed: ${lastError}`);
          continue;
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          lastError = "Request timed out";
        } else {
          lastError = error.message || "Network layer failure";
        }
        console.error(`[OpenRouter] Fetch error for ${model}:`, lastError);
        continue;
      }
    }

    throw new Error(`TopperAI is processing high volume. (${lastError})`);
  },

  async analyzeImage(imageUri: string, prompt: string): Promise<string> {
    try {
      const apiKey = getApiKey();
      const model = "google/gemini-2.0-flash-lite-preview-02-05:free";

      const imgRes = await fetch(imageUri);
      const blob = await imgRes.blob();
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const base64Content = base64Data.split(',')[1];
      const headers: Record<string, string> = {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      };

      if (Platform.OS !== "web") {
        headers["HTTP-Referer"] = "https://topperai.com";
        headers["X-Title"] = "TopperAI";
      }

      const response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Content}`,
                  },
                },
              ],
            },
          ],
        }),
      });

      const data: OpenRouterResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Image analysis service unavailable");
      }

      return data.choices[0].message.content;
    } catch (error: any) {
      console.error("[OpenRouter] Vision Error:", error);
      throw new Error(error.message || "Failed to process visual data");
    }
  },
};
