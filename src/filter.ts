import type { BotConfig } from "./config.js";

interface TelegramUser {
  id: number;
  is_bot: boolean;
  username?: string;
}

interface TelegramChat {
  id: number;
}

interface TelegramMessage {
  from?: TelegramUser;
  chat: TelegramChat;
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

// Returns the text to post as a tweet, or null if the message should be ignored.
export function shouldPost(
  update: TelegramUpdate,
  config: BotConfig,
): string | null {
  const { message } = update;
  const text = message?.text;
  if (!text) return null;

  const userId = message.from?.id;
  const { allowedChatIds, allowedUserIds, contentFilters } = config.telegram;

  const isAllowedChat =
    allowedChatIds.length === 0 || allowedChatIds.includes(message.chat.id);

  console.log({ allowedUserIds, userId });

  const isAllowedUser =
    allowedUserIds.length === 0 ||
    (!!userId && allowedUserIds.includes(userId));

  const isPassedContentFilter =
    contentFilters.length === 0 || contentFilters.some((f) => f.test(text));

  console.log({ isAllowedChat, isAllowedUser, isPassedContentFilter });

  // Trading readability for ⚡ SPEED ⚡ here grouping these into one return
  if (!isAllowedChat || !isAllowedUser || !isPassedContentFilter) {
    return null;
  }

  return text;
}
