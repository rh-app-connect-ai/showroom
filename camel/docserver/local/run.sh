#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
camel run "$SCRIPT_DIR/docs.camel.yaml" --port=9090 --background
