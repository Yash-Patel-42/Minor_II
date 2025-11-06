import { geminillm } from "@/utils/llm";

export async function processUserInput(userInput: string) {
  try {
    const geminiOutput = await geminillm(userInput);
    // const groqOutput = await groqllm(userInput);

    return geminiOutput;
  } catch (error) {
    console.error("Error processing user input:", error);
    throw error;
  }
}
