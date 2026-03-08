import { Hono } from "hono";
import { env } from "./config.js";
import { sendMessage } from "./telegram.js";

export function createApp(): Hono {
  const app = new Hono();

  app.post("/message", async (c) => {
    const secret = c.req.header("API_KEY");
    if (secret !== env.API_KEY) return c.json({ error: "Unauthorized" }, 401);

    const { chatId, text } = await c.req.json();
    if (!chatId || !text)
      return c.json({ error: "Missing chatId or text" }, 400);

    try {
      await sendMessage(chatId, text);
      console.log(`Sent message to ${chatId}: ${text}`);
      return c.json({ ok: true });
    } catch (err) {
      console.error("Failed to send Telegram message:", err);
      return c.json({ error: "Failed to send message" }, 500);
    }
  });

  return app;
}
