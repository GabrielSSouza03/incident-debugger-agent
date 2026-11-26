#!/bin/bash

set -e

API_URL="${API_URL:-http://localhost:3000}"

echo "=== Seeding test data ==="

echo "Waiting for API to be ready..."
until curl -s "$API_URL/health" > /dev/null 2>&1; do
  sleep 1
done

echo "API is ready!"

PRODUCT_ID=$(psql postgresql://postgres:postgres@localhost:5432/orders_db -t -c "
INSERT INTO products (id, name, price, stock, \"createdAt\", \"updatedAt\")
VALUES (gen_random_uuid(), 'Premium Widget', 99.99, 100, NOW(), NOW())
RETURNING id;
" | xargs)

echo "$PRODUCT_ID" > /tmp/product_id.txt
echo "Created product with ID: $PRODUCT_ID"
echo "Data seeding complete!"
