import { GoogleGenAI, Type } from "@google/genai";
import { Framework, PromptArchitectResult, ClarificationRequest } from "./types";

const FRAMEWORKS: Framework[] = [
  'Standard', 'Reasoning', 'RACE', 'CARE', 'APE', 'CREATE', 'TAG', 'CREO', 'RISE', 'PAIN', 'COAST', 'ROSES', 'RESEE'
];

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async selectFramework(input: string): Promise<{ framework: Framework; needsClarification: boolean; missingDetail?: string }> {
    // Instruction: Evaluate this task. Select the single best framework from this list.
    // Clarification Step: If the input is less than 10 words or lacks context, the app must pause and ask: "To give you the best [Framework Name] structure, could you clarify [Specific Missing Detail]?"

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate this task: "${input}"
      
      Select the single best framework from this list: [${FRAMEWORKS.join(', ')}].
      Pick the one that will yield the most professional result.
      
      Also, evaluate if the input is too vague (e.g., less than 10 words or lacks context).
      
      Return a JSON object with:
      1. "framework": The name of the selected framework.
      2. "needsClarification": Boolean.
      3. "missingDetail": (Optional) A specific detail that is missing if needsClarification is true.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            framework: { type: Type.STRING, enum: FRAMEWORKS },
            needsClarification: { type: Type.BOOLEAN },
            missingDetail: { type: Type.STRING }
          },
          required: ["framework", "needsClarification"]
        }
      }
    });

    return JSON.parse(response.text);
  }

  async transformPrompt(input: string, framework: Framework, clarification?: string): Promise<PromptArchitectResult> {
    const context = clarification ? `Additional detail: ${clarification}` : '';
    const prompt = `Rewrite the following input using the ${framework} framework format.
    Input: "${input}"
    ${context}
    
    Format the output clearly according to the ${framework} rules.
    If the framework has specific components (like RACE: Role, Action, Context, Explanation), label them clearly.
    
    Return a JSON object as follows:
    {
      "framework": "${framework}",
      "final_prompt": "the full rewritten prompt",
      "usage": "Paste this into any AI chat"
    }`;

    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            framework: { type: Type.STRING },
            final_prompt: { type: Type.STRING },
            usage: { type: Type.STRING }
          },
          required: ["framework", "final_prompt", "usage"]
        }
      }
    });

    return JSON.parse(response.text);
  }
}
