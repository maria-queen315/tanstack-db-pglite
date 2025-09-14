# tanstack-db-pglite

A seamless integration between [TanStack DB](https://tanstack.com/db) and [PGLite](https://github.com/electric-sql/pglite) with [Drizzle ORM](https://orm.drizzle.team/) for browser-based database management, providing powerful collection management with automatic synchronization and offline-first capabilities.

## Installation

```bash
npm install tanstack-db-pglite @tanstack/db drizzle-orm @electric-sql/pglite
```

> **Note:** `@tanstack/db` and `drizzle-orm` are peer dependencies and must be installed separately.

## Quick Start

```typescript
import { PGLite } from '@electric-sql/pglite'
import { createCollection } from '@tanstack/react-db'
import { drizzle } from 'drizzle-orm/pglite'
import { drizzleCollectionOptions } from 'tanstack-db-pglite'
import { chats } from '~/drizzle'

const pglite = new PGLite()
const db = drizzle(pglite)

export const chatsCollection = createCollection(drizzleCollectionOptions({
  db,
  table: chats,
  primaryColumn: chats.id,
  prepare: async () => {
    // Prepare your database before starting the collection (e.g., run migrations)
    await waitForMigrations()
  },
  sync: async ({ collection, write }) => {
    // Send some data to your backend to sync and receive the response
    const sync = await syncWithCloud(
      collection.toArray.map(c => ({
        id: c.id,
        updatedAt: c.updatedAt
      }))
    )

    sync.forEach((item) => {
      if (item.type === 'delete') {
        write({ type: 'delete', value: collection.get(item.value)! })
      }
      else {
        write(item)
      }
    })
  },
  onInsert: async (params) => {
    await saveInCloud(params)
  },
  onUpdate: async (params) => {
    await updateInCloud(params)
  },
  onDelete: async (params) => {
    await deleteInCloud(params)
  },
}))
```
