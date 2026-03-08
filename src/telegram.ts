import { Bot } from "gramio";
import { env } from "./config.js";

export const bot = new Bot(env.TELEGRAM_BOT_TOKEN);

// ChatId is userId for private messages
export async function sendMessage(chatId: string, text: string) {
  await bot.api.sendMessage({
    chat_id: chatId,
    text: text,
  });
}
