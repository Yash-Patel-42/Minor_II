import { app } from "./app";
import { config } from "./config/config";

const PORT = config.get("PORT") || 3001;

app.listen(PORT, () => {
  console.log(`AI Agent is running at http://localhost:${PORT}`);
});
