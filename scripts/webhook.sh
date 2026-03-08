#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/webhook.sh --register https://abc123.ngrok.io
#   ./scripts/webhook.sh --delete 
#   ./scripts/webhook.sh --status 

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${SCRIPT_DIR}/../.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/../.env"
  set +a
fi

TELEGRAM_API="https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}"

case "${1:-}" in
  --register)
    if [[ -z "${2:-}" ]]; then
      echo "Error: --register requires a URL, e.g. --register https://abc123.ngrok.io" >&2
      exit 1
    fi
    WEBHOOK_URL="${2}/webhook"
    curl -s -X POST "${TELEGRAM_API}/setWebhook" \
      -H "Content-Type: application/json" \
      -d "{\"url\": \"${WEBHOOK_URL}\", \"secret_token\": \"${TELEGRAM_WEBHOOK_SECRET}\"}" \
      | jq .
    echo "Registered: ${WEBHOOK_URL}"
    ;;
  --delete)
    curl -s -X POST "${TELEGRAM_API}/deleteWebhook" | jq .
    ;;
  --status)
    curl -s "${TELEGRAM_API}/getWebhookInfo" | jq .
    ;;
  *)
    echo "Usage:"
    echo "  $0 --register https://abc123.ngrok.io"
    echo "  $0 --delete"
    echo "  $0 --status"
    exit 1
    ;;
esac
