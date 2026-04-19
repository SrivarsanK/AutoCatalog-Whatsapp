---
status: completed
phase: 04-deployment-verification
requirements_addressed: [UAT-01]
dependencies: [01-PLAN.md]
---

# Plan 02: End-to-End Testing Upgrade

## Objective
Finalize the `verify.js` script to assert correctness across all major features (multi-language, admin error routing, search, lists) returning non-zero exit codes on failure so it can be used in CI/CD pipelines.

## Implementation Steps

1. **Enhance `verify.js`**
   - Modify the simple `console.log` approach to a minimal DIY assertion or use `node:assert`.
   - Track intercepted payloads from `axios.post`.
   - Assert `fetchCatalog` caches properly (via call counts if needed, or timing).
   - Assert `handleMessage('...', 'hindi')` switches language map state and sends Hindi strings.
   - Assert `handleMessage('...', 'all')` returns the correct Product List structure with max 10 items.
   - Assert an error caught in `fetchCatalog` correctly routes to Admin notification mock.
   - Exit with `0` if all passed, `1` if any failed.

## Verification
- Run `npm test`. Ensure it outputs successes and terminates cleanly with exit code 0.
