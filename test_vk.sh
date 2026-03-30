#!/usr/bin/env bash
set -euo pipefail

FILE="backend/verification_key.zkey"

[[ -f "$FILE" ]] || { echo "Missing file: $FILE"; exit 1; }