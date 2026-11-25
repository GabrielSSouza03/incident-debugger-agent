#!/bin/bash

set -e

echo "=== Bug Reproduction Scripts ==="
echo ""

API_URL="${API_URL:-http://localhost:3000}"

echo "[BUG-001] Testing race condition with payment failure..."
echo "Creating 10 concurrent orders to trigger race condition..."

for i in {1..10}; do
  curl -X POST "$API_URL/orders" \
    -H "Content-Type: application/json" \
    -d '{
      "customerId": "cust-'$i'",
      "productId": "'"$(cat /tmp/product_id.txt 2>/dev/null || echo 'unknown')"'",
      "quantity": 1
    }' &
done

wait

echo ""
echo "[BUG-002] Testing DB connection pool exhaustion..."
echo "Triggering heavy query endpoint..."

curl -X GET "$API_URL/orders/debug/heavy-query" &

echo ""
echo "Bugs triggered. Check application logs for errors."
