export function extractFinalAIMessage(data: any): string {
  if (!data) return "No content generated.";

  // LangChain may return a single message or an array
  const messages = Array.isArray(data) ? data : [data];

  // Get all AI assistant message contents
  const textParts = messages
    .map(msg => {
      // Try different message structures
      
      // LangChain BaseMessage structure with kwargs.content
      if (msg?.kwargs?.content) {
        if (Array.isArray(msg.kwargs.content)) {
          return msg.kwargs.content
            .map(c =>
              typeof c === "string"
                ? c
                : c.text || c.functionCall?.name || ""
            )
            .join(" ");
        } else if (typeof msg.kwargs.content === "string") {
          return msg.kwargs.content;
        }
      }
      
      // Direct content property
      if (msg?.content) {
        if (typeof msg.content === "string") {
          return msg.content;
        }
        if (Array.isArray(msg.content)) {
          return msg.content
            .map(c => (typeof c === "string" ? c : c.text || ""))
            .join(" ");
        }
      }
      
      // Plain string message
      if (typeof msg === "string") return msg;
      
      return "";
    })
    .filter(Boolean);

  // Return the last AI message or a fallback
  return textParts[textParts.length - 1] || "No content generated.";
}
