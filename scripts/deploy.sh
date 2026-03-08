#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   pnpm deploy

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -f "${SCRIPT_DIR}/../.env" ]]; then
  set -a
  # shellcheck source=/dev/null
  source "${SCRIPT_DIR}/../.env"
  set +a
fi

cd "${SCRIPT_DIR}/../cdk"
pnpm run deploy
