# Provisional Patent Application: Multi-Tenant Clinical Data Isolation

**Docket No.:** GR-17-PROV | **Tier:** 3

## 1. TITLE
Three-Tier Tenant Resolution with Automatic Database Query Scoping for Healthcare Multi-Tenant SaaS

## 4. FIELD
Multi-tenant data isolation for healthcare applications.

## 5. BACKGROUND
Prior multi-tenant SaaS (Salesforce, Snowflake) uses schema-level or database-level tenant isolation. Healthcare demands stronger guarantees with transparent middleware-based enforcement.

## 6. SUMMARY
Three-tier tenant resolution (X-Tenant-ID header → subdomain → JWT claim) with Prisma middleware `$extends()` auto-injection of tenant WHERE clauses on all reads and WHERE scoping on all mutations.

## 8. DETAILED DESCRIPTION

### 8.1 Resolution Priority
1. X-Tenant-ID HTTP header (explicit override for internal tools)
2. Subdomain parsing (e.g., `mayo-clinic.gentle-reminder.health` → tenant "mayo-clinic")
3. JWT tenantId claim (fallback)
4. None → return 400 error or fallback to single-tenant mode

### 8.2 Prisma Middleware
```typescript
prisma.$extends({
  query: {
    $allModels: {
      findMany({ args, query }) {
        const tenantId = getCurrentTenantId()
        if (tenantId && isTenantScoped(args.model)) {
          args.where = { ...args.where, tenantId }
        }
        return query(args)
      },
      // similar for findUnique, findFirst, create, update, delete
    }
  }
})
```

### 8.3 Reference Implementation
`services/api/src/middleware/tenantResolver.ts`, `tenantIsolation.ts`, `packages/database/src/tenant.ts`

## 9. CLAIMS

**Claim 1:** A method for enforcing tenant isolation in a healthcare multi-tenant application, comprising:
(a) resolving a tenant identifier from an incoming HTTP request using priority order: first checking an X-Tenant-ID header, then parsing a subdomain of the request host, then extracting a tenantId claim from a JWT authorization token;
(b) storing the resolved tenant identifier in a per-request context;
(c) automatically injecting a tenantId WHERE clause into database read queries via an ORM middleware extension for tenant-scoped models; and
(d) automatically scoping create, update, and delete operations to the resolved tenant.

**Claims 2-5:** Dependent, system, CRM.

## 10. ABSTRACT

A healthcare multi-tenant SaaS architecture resolves tenant identity in a three-tier priority (X-Tenant-ID header → subdomain → JWT claim), stores the tenant in per-request context, and uses Prisma ORM middleware extensions to automatically inject tenantId WHERE clauses on database read operations and scope create/update/delete operations to the resolved tenant. Isolation is transparent to application code.

Codebase: `services/api/src/middleware/tenantResolver.ts`
