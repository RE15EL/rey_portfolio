---
name: javascript-map-mastery
description: >
  Practical rules for using JavaScript Map in performance-critical code,
  key-value modeling, and cache/counter patterns.
  Trigger: When implementing lookup tables, memoization, LRU-like behavior,
  frequency counters, or choosing between Map and object literals.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0.0"
---

## When to Use

- You need high-frequency insert/delete operations with predictable performance.
- Keys are not only strings/symbols (objects, functions, numbers, mixed types).
- You need stable iteration order based on insertion sequence.
- You are building counters, caches, grouped indexes, or metadata side stores.

## Critical Patterns

| Decision | Use `Map` when | Use object literal when |
| --- | --- | --- |
| Key type | Keys can be any runtime type | Keys are string/symbol only |
| Size check | You need constant-time `size` | `Object.keys(obj).length` is acceptable |
| Mutations | Frequent add/remove operations | Mostly static record/config objects |
| Safety | Keys may come from external/untrusted data | You control all keys and shape |

- `Map` lookup/update/remove is expected O(1) average-case.
- `Map` key equality is by reference for objects/functions; `{}` is not equal to another `{}`.
- Preserve LRU semantics by deleting and re-setting existing keys before insertion.
- Avoid memory leaks with object keys: remove entries you no longer need, or consider `WeakMap`.
- Convert before JSON serialization: `Object.fromEntries(map)` or `[...map]`.

## Code Examples

```ts
// Key types and O(1)-style access patterns
const map = new Map<unknown, string>();
const objKey = { id: 1 };

map.set("status", "ok");
map.set(objKey, "object-metadata");

map.get("status"); // "ok"
map.get({ id: 1 }); // undefined (different object reference)
```

```ts
// Frequency counter
const counter = new Map<string, number>();

export const count = (key: string): void => {
  counter.set(key, (counter.get(key) ?? 0) + 1);
};
```

```ts
// LRU-like bounded cache (last write wins)
const cache = new Map<string, unknown>();
const MAX_SIZE = 100;

export const setCache = (key: string, value: unknown): void => {
  if (cache.has(key)) cache.delete(key);
  cache.set(key, value);

  if (cache.size > MAX_SIZE) {
    const oldestKey = cache.keys().next().value as string | undefined;
    if (oldestKey !== undefined) cache.delete(oldestKey);
  }
};
```

## Commands

```bash
# Run lint checks after Map refactors
npm run lint

# Run type checks for Map key/value typing
npx tsc --noEmit
```

## Resources

- **Templates**: See [assets/](assets/) for Map usage templates.
- **Documentation**: See [references/](references/) for local docs.
