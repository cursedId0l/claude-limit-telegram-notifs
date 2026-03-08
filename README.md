# Telegram to Twitter Bot

Forwards messages from a Telegram chat to Twitter — either as tweets or direct messages.

## Prerequisites

- [Node.js 22+](https://nodejs.org) and [pnpm](https://pnpm.io)
- A [Telegram bot](https://t.me/BotFather)
- A [Twitter developer app](https://developer.x.com) with a paid plan (X requires payment for write access)
- An [AWS account](https://aws.amazon.com) with the [AWS CLI](https://aws.amazon.com/cli/) configured

## Setup

### 1. Create a Telegram bot

1. Chat with [@BotFather](https://t.me/BotFather), send `/newbot`, and follow the prompts
2. Copy the bot token → `TELEGRAM_BOT_TOKEN`
3. Make up a random secret string → `TELEGRAM_WEBHOOK_SECRET` (used to verify requests come from Telegram)

### 2. Create a Twitter/X app

1. Go to [developer.x.com](https://developer.x.com) and create a new app
2. Under **User authentication settings**, enable OAuth with **Read and Write** permissions and add a callback URL (any URL works, e.g. `http://localhost`)
3. Under **Keys and Tokens**, copy:
   - Consumer Key → `TWITTER_CONSUMER_KEY`
   - Consumer Secret → `TWITTER_CONSUMER_KEY_SECRET`
   - Access Token → `TWITTER_ACCESS_TOKEN`
   - Access Token Secret → `TWITTER_ACCESS_TOKEN_SECRET`
4. If using DM mode, also copy the Bearer Token → `TWITTER_BEARER_TOKEN`

> If you change app permissions after generating tokens, regenerate the Access Token and Secret or the old tokens won't have write access.

### 3. Configure environment variables

```
cp .env.example .env
```

Fill in all values in `.env`.

### 4. Configure the bot

Edit [src/config.ts](src/config.ts) to set your filters and Twitter action:

```ts
export const config: BotConfig = {
  telegram: {
    allowedChatIds: [1234567890], // leave empty to allow all chats
    allowedUserIds: [987654321],  // leave empty to allow all users
    contentFilters: [/keyword/i], // leave empty to forward all messages
  },
  twitter: { action: TwitterAction.TWEET },
  // or for DMs:
  // twitter: { action: TwitterAction.DM, recipientIds: ["123456789"] },
};
```

To get a chat or user ID, add [@userinfobot](https://telegram.me/userinfobot) to your group or forward a message to it.
To get a Twitter user ID for DM mode: `pnpm twitter:user-id <handle>`

## Local development

1. Install dependencies:
   ```
   pnpm install
   ```

2. Make scripts executable:
   ```
   pnpm scripts:chmod
   ```

3. Start [ngrok](https://ngrok.com) to expose your local server:
   ```
   ngrok http 3000
   ```

4. Register the ngrok URL as your Telegram webhook:
   ```
   pnpm webhook:register https://abc123.ngrok.io
   ```

5. Start the dev server:
   ```
   pnpm dev
   ```

When done, clean up the webhook:
```
pnpm webhook:delete
```

## AWS deployment

The bot runs as an AWS Lambda function. CDK manages all the infrastructure — the first deploy creates everything, every subsequent deploy updates it in place. The URL never changes, so you only register the Telegram webhook once.

### First-time setup

1. Make sure the AWS CLI is configured (`aws configure`) and your account has sufficient permissions
2. Install dependencies:
   ```
   pnpm install
   ```
3. Make scripts executable:
   ```
   pnpm scripts:chmod
   ```
4. Bootstrap CDK (one time per AWS account/region):
   ```
   cd cdk && pnpm run bootstrap
   ```

### Deploy

```
pnpm deploy:aws
```

This reads secrets from your `.env` file, bundles the code, and deploys to Lambda. At the end, CDK prints a `WebhookBaseUrl`.

On your first deploy, register that URL as your Telegram webhook:
```
pnpm webhook:register https://<your-lambda-url>
```

You won't need to do this again — the URL is permanent.

### Redeploy

Same command, every time:
```
pnpm deploy:aws
```

### Teardown

Deletes the Telegram webhook and destroys all AWS resources:
```
pnpm teardown
```

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start local dev server with hot reload |
| `pnpm deploy:aws` | Deploy to AWS Lambda |
| `pnpm teardown` | Delete webhook and destroy AWS stack |
| `pnpm webhook:register <url>` | Register a URL as the Telegram webhook |
| `pnpm webhook:delete` | Delete the Telegram webhook |
| `pnpm webhook:status` | Check current webhook status |
| `pnpm twitter:user-id <handle>` | Look up a Twitter user's numeric ID |
| `pnpm scripts:chmod` | Make all scripts executable |
