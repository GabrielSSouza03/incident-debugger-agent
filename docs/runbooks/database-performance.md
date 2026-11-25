# Runbook: Database Performance Issues

## Overview
Troubleshooting database connection pool exhaustion and query performance problems.

## Connection Pool Exhaustion

### Symptoms
- `Connection pool exhausted` errors
- Requests timing out
- Health check failures
- High database connection count

**Investigation Steps:**
1. Check active connections: `SELECT count(*) FROM pg_stat_activity WHERE state = 'active';`
2. Identify long-running queries: `SELECT pid, now() - query_start as duration, query FROM pg_stat_activity WHERE state = 'active' ORDER BY duration DESC;`
3. Review connection pool configuration in `app.module.ts`
4. Check for connection leaks (connections not being released)

**Root Cause:**
- Heavy queries holding connections for extended periods
- Insufficient connection pool size
- Missing connection timeout configuration
- Queries using `pg_sleep()` or other blocking operations

**Resolution:**
1. Kill long-running queries: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE ...`
2. Increase connection pool size in `extra.max`
3. Add query timeout: `extra.query_timeout`
4. Optimize slow queries using EXPLAIN ANALYZE
5. Consider query queuing or rate limiting for heavy endpoints

**Prevention:**
- Set appropriate connection pool limits
- Add query timeouts
- Monitor connection pool metrics
- Use read replicas for heavy read operations
- Implement query result caching

## Query Optimization

### Identifying Slow Queries
```sql
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Adding Indexes
```sql
CREATE INDEX CONCURRENTLY idx_orders_customer_id ON orders(customer_id);
CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status);
```

## Related Configuration
- `src/app.module.ts`: Connection pool settings
- `docker-compose.yml`: Database resource limits

## Monitoring
- Active connection count
- Connection pool utilization
- Query execution times
- Database CPU and memory usage

## Escalation
Contact: Database Team
Severity: High - Service disruption
SLA: 30 minutes response time
