## Requirement

While this UI design work is being implemented, the application shall add zero new npm dependencies to `package.json`.

## Rationale

This is not a proposed target — it is the concept's chosen approach ([[prob-1/concept-1]] Chosen approach and Why not the alternatives) made independently verifiable. Native CSS Modules and global CSS are built into Next.js already; the alternative (Tailwind) was explicitly rejected specifically because it would add a dependency. A count against `package.json` makes that decision checkable rather than just asserted.

## Measure

| | |
|---|---|
| metric | count of new entries added to `dependencies` or `devDependencies` in `package.json` |
| threshold | 0 |
| conditions | measured as a diff of `package.json` between the commit before this work started and the commit at delivery |

## Traces to

- [[prob-1/concept-1]] — Chosen approach

## Metadata

```json
{
  "id": "UI-NFR-1",
  "title": "No new dependencies",
  "category": "maintainability",
  "statement": "While this UI design work is being implemented, the application shall add zero new npm dependencies to package.json.",
  "measure": {
    "metric": "count of new entries added to dependencies or devDependencies in package.json",
    "threshold": "0",
    "conditions": "diff of package.json between the pre-work commit and the delivery commit",
    "method": "inspection"
  },
  "rationale": "Makes the concept's already-decided constraint (native CSS only, no framework) independently verifiable rather than only asserted.",
  "priority": "must",
  "traces_to": ["prob-1/concept-1"]
}
```
