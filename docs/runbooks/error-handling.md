# Runbook: Error Handling Best Practices

## Overview
Guidelines for proper error handling in the orders service to prevent silent failures.

## Anti-Patterns to Avoid

### 1. Swallowing Exceptions
**Bad:**
```typescript
try {
  await criticalOperation();
} catch (error) {
  console.error(error); // Logs but continues
}
```

**Good:**
```typescript
try {
  await criticalOperation();
} catch (error) {
  console.error(error);
  throw new InternalServerErrorException('Critical operation failed');
}
```

### 2. Missing Transaction Rollback
**Bad:**
```typescript
await updateStock(productId, -quantity);
await processPayment(amount); // If this fails, stock is already reduced
await createOrder(orderData);
```

**Good:**
```typescript
await this.dataSource.transaction(async (manager) => {
  await manager.update(Product, productId, { stock: newStock });
  await this.paymentService.process(amount);
  await manager.save(Order, orderData);
  // Automatic rollback on any error
});
```

## Common Issues

### Silent Payment Failures
**Symptoms:**
- Orders show as completed without payment confirmation
- Mismatch between order count and payment count
- Customer complaints about charges without orders

**Investigation:**
1. Query orders with missing payment IDs:
```sql
SELECT * FROM orders WHERE status = 'completed' AND payment_id IS NULL;
```
2. Check application logs for caught payment errors
3. Review payment gateway logs

**Resolution:**
1. Add proper error handling with transaction rollback
2. Update affected orders to 'failed' status
3. Implement compensating transactions to restore stock

## Error Handling Checklist
- [ ] All errors are logged with context
- [ ] Critical errors are thrown, not swallowed
- [ ] Multi-step operations use database transactions
- [ ] Failed operations leave system in consistent state
- [ ] Errors include actionable information
- [ ] Sensitive data is not exposed in error messages

## Monitoring
- Error rate by endpoint
- Unhandled exception count
- Orders with inconsistent state
- Payment failure rate vs order failure rate

## Related Code
- `src/orders/orders.service.ts`: Order creation logic
- `src/common/filters/`: Global exception filters

## Escalation
Contact: Backend Team Lead
Severity: High - Data integrity issue
SLA: 1 hour response time
