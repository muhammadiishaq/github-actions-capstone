#!/bin/bash

PORT="3000"
URL="http://localhost:${PORT}/health"

echo "Testing ${URL} ..."

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${URL}")
echo "HTTP Status: $STATUS"

if [ "$STATUS" -ne 200 ]; then
  echo "Health check failed!"
  exit 1
else
  echo "Health check passed!"
fi
