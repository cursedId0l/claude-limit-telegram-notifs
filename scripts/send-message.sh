#!/usr/bin/env bash

# Usage: ./send_message.sh "Your message here"

# Load environment variables from .env
set -a
source .env
set +a

# Get message from argument
MESSAGE="$1"

if [[ -z "$MESSAGE" ]]; then
  echo "Error: Please provide the message as the first argument."
  exit 1
fi

# Check required variables
if [[ -z "$MESSAGE_URL" || -z "$API_KEY" || -z "$CHAT_ID" ]]; then
  echo "Error: Please set MESSAGE_URL, API_KEY, and CHAT_ID in .env"
  exit 1
fi

# Send the message
curl -s -X POST "$MESSAGE_URL" \
  -H "API_KEY: $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"chatId\": $CHAT_ID, \"text\": \"$MESSAGE\"}" \
  -w "\nHTTP Status: %{http_code}\n"