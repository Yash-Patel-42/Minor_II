import { Request, Response } from "express";

import { processUserInput } from "@/agent";
import { extractFinalAIMessage } from "@/utils/parseRespnse";

// export const agentHandler = async (req: Request, res: Response) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const output = await processUserInput(prompt);

//     // console.log("RAW OUTPUT:", JSON.stringify(output, null, 2));

//     const finalText = extractFinalAIMessage(output);

//     // console.log("EXTRACTED TEXT:", finalText);

//     res.json({
//       success: true,
//       message: finalText.trim(),
//     });
//   } catch (error) {
//     console.error("Error in agent handler:", error);
//     res.status(500).json({
//       success: false,
//       error: "AI Agent Error",
//       message:
//         error instanceof Error ? error.message : "Unknown error occurred",
//     });
//   }
// };

export const generateTitleHandler = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const output = await processUserInput(prompt);
    const finalText = extractFinalAIMessage(output);

    const titlePrompt = `
You are a professional YouTube copywriter who creates viral and trending video titles.

Task:
Given the following content, write **one single YouTube title only** — no explanations, no extra text, no quotes, no formatting.

Guidelines:
- Maximum 70 characters.
- Should sound like a real trending YouTube title in 2025.
- Make it catchy, curiosity-driven, and emotionally appealing.
- Use numbers, action words, or strong hooks when natural (e.g., "5 Tips", "The Moment I...", "My First Time", "Unbelievable", "Latest 2025").
- Use capital letters strategically (e.g., "First Time Playing SEKIRO").
- Don't Avoid clickbait or false promises.
- Use emojis.

Content:
${finalText}

Return only the title string (no explanations or notes).
`.trim();

    // Call agent again to generate a title
    const titleOutput = await processUserInput(titlePrompt);
    const titleText = extractFinalAIMessage(titleOutput);

    // If the agent returns structured objects, ensure it's a string
    const title =
      typeof titleText === "string"
        ? titleText.trim()
        : JSON.stringify(titleText);

    res.json({
      success: true,
      data: title,
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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const output = await processUserInput(prompt);
    const finalText = extractFinalAIMessage(output);

    const descriptionPrompt = `
You are a professional YouTube SEO copywriter who crafts trending, viral video descriptions.

Task:
Given the following video content, write a **complete YouTube description** that is catchy, curiosity-driven, and keyword-rich — the kind of description that helps videos go viral.

Include:
- A strong first line that hooks attention and summarizes the video.
- 2-3 short paragraphs that naturally include trending keywords and emotional appeal.
- Relevant hashtags (at the end, 5-10 hashtags).
- Avoid clickbait, false promises, or misleading claims.

Tone:
- Energetic, friendly, and modern.
- Use language like "new", "latest", "must-watch", "2025", "unbelievable", "insane", "challenge", "journey", etc.
- Encourage viewers to like, comment, or subscribe naturally.

Format:
- Minimum 200 characters, maximum 2000.
- do not Output plain text only (use markdown, quotes, bullet points, emojis, etc).

Content:
${finalText}

Return only the YouTube description text (no preface or explanation).
`.trim();

    // Call your agent again to generate a title
    const titleOutput = await processUserInput(descriptionPrompt);
    const titleText = extractFinalAIMessage(titleOutput);

    // If the agent returns structured objects, ensure it's a string
    const description =
      typeof titleText === "string"
        ? titleText.trim()
        : JSON.stringify(titleText);

    res.json({
      success: true,
      data: description,
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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const output = await processUserInput(prompt);
    const finalText = extractFinalAIMessage(output);

    const tagsPrompt = `
You are an expert in YouTube SEO and growth strategy.

Task:
Given the following content, generate a list of **up to 20 trending and relevant YouTube tags** that will help this video reach the right audience.

Guidelines:
- Output must be **comma-separated**, all in a single line.
- Tags should reflect **trending keywords**, **niches**, and **search terms** related to the content.
- Include both **broad** and **specific** tags.
- Avoid repetition, symbols (#), or emojis.
- Each tag should be a short phrase (1–3 words max).
- Focus on 2025 trends and natural YouTube discoverability.

Content:
${finalText}

Return only the tags string (comma-separated).
`.trim();

    // Call your agent again to generate a title
    const titleOutput = await processUserInput(tagsPrompt);
    const titleText = extractFinalAIMessage(titleOutput);

    // If the agent returns structured objects, ensure it's a string
    const tags =
      typeof titleText === "string"
        ? titleText.trim()
        : JSON.stringify(titleText);

    res.json({
      success: true,
      data: tags,
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
