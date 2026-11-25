# Runbook: Payment Failures

## Overview
This runbook covers troubleshooting payment processing failures in the orders service.

## Common Issues

### Payment Gateway Timeout
**Symptoms:**
- Orders marked as completed but payment not processed
- Error logs: `Payment gateway timeout`
- Stock reduced but no payment confirmation

**Investigation Steps:**
1. Check if payment gateway is responding
2. Review order status in database
3. Verify stock levels match completed orders
4. Check for missing payment IDs in orders table

**Root Cause:**
Payment errors are caught but not properly handled in `OrdersService.createOrder()`. The try-catch block around `processPayment()` logs the error but allows execution to continue.

**Resolution:**
1. Add proper error propagation
2. Implement transaction rollback on payment failure
3. Update order status to 'failed' when payment fails
4. Add payment retry logic with exponential backoff

**Prevention:**
- Always use database transactions for multi-step operations
- Never swallow critical errors in try-catch blocks
- Implement idempotency keys for payment processing
- Add circuit breaker for payment gateway calls

## Related Code
- `src/orders/orders.service.ts`: Payment processing logic
- `src/orders/entities/order.entity.ts`: Order status enum

## Monitoring
- Alert on orders with status=completed and paymentId=null
- Monitor payment gateway response times
- Track payment failure rate

## Escalation
Contact: Backend Team Lead
Severity: High - Financial impact
SLA: 1 hour response time
