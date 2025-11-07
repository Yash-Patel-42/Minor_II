import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { createAgent } from "langchain";

import { config } from "@/config/config";
import { systemPrompt } from "@/lib/systemPrompt";
import { tools } from "@/tools";

// groq model
const groqModel = new ChatGroq({
  apiKey: config.get("GROQ_API_KEY"),
  model: "openai/gpt-oss-120b",
  temperature: 0.4,
  topP: 1,
});

export const groqAgent = createAgent({ model: groqModel, tools, systemPrompt });

// groq llm
export async function groqllm(userInput: string) {
  const groqResponse = await groqAgent.invoke({
    systemInstruction: systemPrompt,
    messages: [{ role: "user", content: userInput }],
  });
  return groqResponse.messages;
}
// gemini model
const geminiModel = new ChatGoogleGenerativeAI({
  apiKey: config.get("GEMINI_API_KEY"),
  model: "gemini-2.5-flash",
  temperature: 1,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

// gemini agent
export const geminiAgent = createAgent({
  model: geminiModel,
  tools: tools,
  systemPrompt,
});

// gemini llm
export async function geminillm(userInput: string) {
  const geminiResp = await geminiAgent.invoke({
    systemInstruction: systemPrompt,
    messages: [{ role: "user", content: userInput }],
  });

  return geminiResp.messages;
}
