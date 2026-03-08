#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/get-twitter-user-id.sh <handle>

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <twitter_handle>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${SCRIPT_DIR}/../.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/../.env"
  set +a
fi

curl -s "https://api.twitter.com/2/users/by/username/${1}" \
  -H "Authorization: Bearer ${TWITTER_BEARER_TOKEN}" \
  | jq .
