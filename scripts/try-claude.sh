#!/usr/bin/env bash

PROMPT="Respond only with the word ok if you are working"

OUTPUT=$(claude -p "$PROMPT" 2>&1)
STATUS=$?

if [[ $STATUS -ne 0 ]]; then
  if echo "$OUTPUT" | grep -qi "hit your limit"; then
    echo "Claude is rate-limited. Output:"
    echo "$OUTPUT"

    # Extract reset time (e.g., '3pm')
    RESET_TIME=$(echo "$OUTPUT" | sed -n 's/.*resets \([0-9]\{1,2\}[ap]m\).*/\1/p')

    if [[ -z "$RESET_TIME" ]]; then
      echo "Failed to parse reset time, using fallback 2 minutes from now"
      AT_TIMESTAMP=$(date -v+2M "+%Y%m%d%H%M")
    else
      # Convert 12h am/pm to 24h hour
      HOUR=$(echo "$RESET_TIME" | sed -E 's/([0-9]+)(am|pm)/\1 \2/')
      HOUR24=$(date -j -f "%I %p" "$HOUR" "+%H")
      MIN="01"  # always 1 minute after the hour

      # Build at timestamp: YYYYMMDDhhmm
      AT_TIMESTAMP=$(date "+%Y%m%d")${HOUR24}${MIN}
    fi

    echo "Scheduling jobs 1 minute after reset: $AT_TIMESTAMP"

    # Schedule send-message.sh
    echo "bash scripts/send-message.sh \"Claude is back!\"" | at -t "$AT_TIMESTAMP"

    # Schedule this script again
    echo "$0" | at -t "$AT_TIMESTAMP"

  else
    echo "Claude failed for another reason:"
    echo "$OUTPUT"
  fi
else
  echo "Claude OK:"
  echo "$OUTPUT"
  echo "$0" | at now + 1 hour
  echo "Scheduled next check in 1 hour"
fi