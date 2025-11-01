import { GoogleGenAI } from "@google/genai";
import { Request, Response, response } from "express";

import { processUserInput } from "@/agent";
import { config } from "@/config/config";
import { searchWeb } from "@/tools/youtubeAssistance.tools";
import { extractFinalAIMessage } from "@/utils/parseRespnse";

export const agentHandler = async (req: Request, res: Response) => {
  try {
    const { prompt, useGroq = false, enrichWithWebData = true } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const output = await processUserInput(prompt, useGroq);

    console.log("RAW OUTPUT:", JSON.stringify(output, null, 2));

    const finalText = extractFinalAIMessage(output);

    console.log("EXTRACTED TEXT:", finalText);

    res.json({
      success: true,
      message: finalText.trim(),
    });
  } catch (error) {
    console.error("Error in agent handler:", error);
    res.status(500).json({
      success: false,
      error: "AI Agent Error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
};

export const generateTitleHandler = async (req: Request, res: Response) => {
  try {
    const { prompt, useGroq = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const output = await processUserInput(prompt, useGroq);
    const finalText = extractFinalAIMessage(output);

    const titlePrompt = `
You are a creative copywriter. Given the following content (an AI assistant's response), generate a single, clickable YouTube video title (max 70 characters) that is concise, curiosity-driving, and relevant to the content. Prefer active voice, numbers where helpful, and avoid clickbait false promises.

Content:
${finalText}

Return only the title string (no explanation).
`.trim();

    // Call your agent again to generate a title
    const titleOutput = await processUserInput(titlePrompt, useGroq);
    const titleText = extractFinalAIMessage(titleOutput);

    // If the agent returns structured objects, ensure it's a string
    const title =
      typeof titleText === "string"
        ? titleText.trim()
        : JSON.stringify(titleText);

    res.json({
      success: true,
      title: title,
      message: finalText,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "AI Agent Error",
      message: "Unknown error occurred",
    });
  }
};

export const generateDescriptionHandler = async (
  req: Request,
  res: Response,
) => {
  try {
    const { prompt, useGroq = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const output = await processUserInput(prompt, useGroq);
    const finalText = extractFinalAIMessage(output);

    const titlePrompt = `
You are a creative copywriter. Given the following content (an AI assistant's response), generate a, clickable YouTube video description (min 200 characters) that is concise, curiosity-driving, and relevant to the content. Prefer active voice, numbers where helpful, and avoid clickbait false promises.

Content:
${finalText}

Return only the description string.
`.trim();

    // Call your agent again to generate a title
    const titleOutput = await processUserInput(titlePrompt, useGroq);
    const titleText = extractFinalAIMessage(titleOutput);

    // If the agent returns structured objects, ensure it's a string
    const description =
      typeof titleText === "string"
        ? titleText.trim()
        : JSON.stringify(titleText);

    res.json({
      success: true,
      description: description,
      message: finalText,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "AI Agent Error",
      message: "Unknown error occurred",
    });
  }
};

export const generateTagsHandler = async (req: Request, res: Response) => {
  try {
    const { prompt, useGroq = false } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const output = await processUserInput(prompt, useGroq);
    const finalText = extractFinalAIMessage(output);

    const titlePrompt = `
You are a creative copywriter. Given the following content (an AI assistant's response), generate a YouTube video tags (max 20 tags comma separated) which are trending.

Content:
${finalText}

Return only the tags string (comma separated.).
`.trim();

    // Call your agent again to generate a title
    const titleOutput = await processUserInput(titlePrompt, useGroq);
    const titleText = extractFinalAIMessage(titleOutput);

    // If the agent returns structured objects, ensure it's a string
    const tags =
      typeof titleText === "string"
        ? titleText.trim()
        : JSON.stringify(titleText);

    res.json({
      success: true,
      tags: tags,
      message: finalText,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: "AI Agent Error",
      message: "Unknown error occurred",
    });
  }
};

// export const generateImageHandler = async (req: Request, res: Response) => {
//   const { prompt, base64Image } = req.body;

//   if (!prompt) {
//     return res.status(400).json({
//       success: false,
//       error: "Prompt is required"
//     });
//   }

//   try {
//     // Initialize GoogleGenAI client
//     const ai = new GoogleGenAI({
//       apiKey: config.get("GEMINI_API_KEY"),
//     });

//     // Prepare content with optional base64 image for editing
//     const contents = [
//       {
//         role: "user" as const,
//         parts: [
//           { text: prompt },
//           ...(base64Image
//             ? [{ inlineData: { mimeType: "image/png", data: base64Image } }]
//             : []),
//         ],
//       },
//     ];

//     // Generate image using gemini-2.5-flash-image model
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash-image",
//       contents,
//     });

//     // Extract the generated image from response
//     const imagePart = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);

//     if (!imagePart || !imagePart.inlineData) {
//       return res.json({
//         success: false,
//         message: "No image generated"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Image generated successfully",
//       image: `data:image/png;base64,${imagePart.inlineData.data}`,
//       imageBase64: imagePart.inlineData.data,
//     });
//   } catch (error) {
//     console.error("Image generation error:", error);
//     res.status(500).json({
//       success: false,
//       error: error instanceof Error ? error.message : String(error)
//     });
//   }
// };
