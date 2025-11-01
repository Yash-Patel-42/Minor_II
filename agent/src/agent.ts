import "tsconfig-paths/register";

import { geminillm, groqllm } from "@/utils/llm";

export async function processUserInput(
  userInput: string,
  useGroq: boolean = false,
) {
  try {
    const output = useGroq
      ? await groqllm(userInput)
      : await geminillm(userInput);
    return output;
  } catch (error) {
    console.error("Error processing user input:", error);
    throw error;
  }
}
