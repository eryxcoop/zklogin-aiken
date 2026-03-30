#!/usr/bin/env bash
set -euo pipefail
curl -L \
  -o backend/verification_key.zkey \
  https://github.com/eryxcoop/zklogin-aiken/releases/download/v1.0.0/verification_key.zkey