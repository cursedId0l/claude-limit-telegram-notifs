#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   pnpm teardown

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${SCRIPT_DIR}/../.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/../.env"
  set +a
fi

echo "Deleting Telegram webhook..."
bash "${SCRIPT_DIR}/webhook.sh" --delete

echo "Destroying AWS stack..."
cd "${SCRIPT_DIR}/../cdk"
pnpm run destroy --force
