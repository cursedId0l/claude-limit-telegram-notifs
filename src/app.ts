import { Hono } from "hono";
import { config, env, TwitterAction } from "./config.js";
import { shouldPost } from "./filter.js";
import { createTwitterClient, postTweet, sendDm } from "./twitter.js";
import type { TelegramUpdate } from "./filter.js";

const twitter = createTwitterClient(env);

export function createApp(): Hono {
  const app = new Hono();

  app.post("/webhook", async (c) => {
    console.log("Telegram webhook received");

    const secret = c.req.header("X-Telegram-Bot-Api-Secret-Token");
    if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const update = (await c.req.json()) as TelegramUpdate;
    const text = shouldPost(update, config);
    console.log(1);
    if (!text) return c.json({ ok: true });
    console.log(2);

    try {
      switch (config.twitter.action) {
        case TwitterAction.DM:
          await Promise.all(
            config.twitter.recipientIds.map((id) => sendDm(twitter, id, text)),
          );
          console.log("DM sent:", text);
          break;
        case TwitterAction.TWEET:
          await postTweet(twitter, text);
          console.log("Tweet posted:", text);
          break;
        default:
          throw new Error(
            `Unknown twitter action: ${(config.twitter as { action: string }).action}`,
          );
      }
    } catch (err) {
      // Log but return 200. If we return an error Telegram will retry the same message
      console.error("Failed to post to Twitter:", text, err);
    }

    return c.json({ ok: true });
  });

  return app;
}
