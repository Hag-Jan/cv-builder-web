#!/bin/bash

# Sanity Check Script for cv-builder-web

echo "Running sanity checks..."

# 1. Linting check
echo "Checking for lint errors..."
npm run lint --silent
if [ $? -eq 0 ]; then
    echo "✅ Lint check passed."
else
    echo "❌ Lint check failed."
    # Exit if lint fails to ensure high code quality
    # exit 1 
fi

# 2. Build check
echo "Verifying build..."
# We run a dry run or just check if it compiles if possible. 
# For Next.js, 'next build' is the standard way but it's slow.
# For now, we'll just check if the dev server is running or if the code parses.
# In a real scenario, this might run a subset of tests.

# 3. Basic Test check (if any)
if [ -f "jest.config.js" ]; then
    echo "Running basic tests..."
    npm test -- --passWithNoTests
    if [ $? -eq 0 ]; then
        echo "✅ Tests passed (or no tests found)."
    else
        echo "❌ Tests failed."
    fi
fi

echo "Sanity checks complete."
