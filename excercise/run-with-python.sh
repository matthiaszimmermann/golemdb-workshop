#!/bin/bash

# Check if concurrently is installed globally
if ! command -v concurrently &> /dev/null; then
    echo "Installing concurrently globally..."
    npm install -g concurrently
fi

echo "Starting both services with concurrently..."

# Use concurrently to run both services in parallel
concurrently \
    --names "backend,frontend" \
    --prefix-colors "blue,green" \
    --kill-others \
    "cd backend-python && uv sync && uv run fastapi dev main.py" \
    "cd frontend && bun install && bun run dev" 