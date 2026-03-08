import { TwitterApi } from "twitter-api-v2";
import type { env as Env } from "./config.js";

export function createTwitterClient(env: typeof Env): TwitterApi {
  return new TwitterApi({
    appKey: env.TWITTER_CONSUMER_KEY,
    appSecret: env.TWITTER_CONSUMER_KEY_SECRET,
    accessToken: env.TWITTER_ACCESS_TOKEN,
    accessSecret: env.TWITTER_ACCESS_TOKEN_SECRET,
  });
}

export async function postTweet(
  client: TwitterApi,
  text: string,
): Promise<void> {
  await client.v2.tweet(text);
}

export async function sendDm(
  client: TwitterApi,
  recipientId: string,
  text: string,
): Promise<void> {
  await client.v2.sendDmToParticipant(recipientId, { text });
}
