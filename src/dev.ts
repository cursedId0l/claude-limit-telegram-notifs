import { serve } from "@hono/node-server";
import { createApp } from "./app.js";

const app = createApp();

// Note: PORT is not added to env config because its not needed
// in the lambda and is only used for local testing
const port = Number(process.env["PORT"]) || 3000;

serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀🚀🚀 Server running on http://localhost:${port} 🚀🚀🚀`);
});
