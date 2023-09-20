# SQL Queries via Drizzle ORM

Drizzle ORM provides a method to write SQL queries in TypeScript.

**1. Simple Select Query:**

```ts
const result: User[] = await db.select().from(users)
```

**2. Select Query with Specific Fields:**

```ts
const result = await db
  .select({
    field1: users.id,
    field2: users.name,
  })
  .from(users)
```

**3. Conditional Selection:**

```ts
async function selectUsers(withName: boolean) {
  return db
    .select({
      id: users.id,
      ...(withName ? { name: users.name } : {}),
    })
    .from(users)
}
```

**4. Where Conditions with Logical Operators:**

```ts
await db
  .select()
  .from(users)
  .where(or(eq(users.id, 42), eq(users.name, 'Dan')))
```

**5. Limit and Offset:**

```ts
await db.select().from(users).limit(10).offset(10)
```

**6. Order By:**

```ts
await db.select().from(users).orderBy(desc(users.name))
```

**7. CTE (Common Table Expressions):**

```ts
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq')
const result = await db.select().from(sq)
```

**8. Joins:**

```ts
const result = await db.select().from(users).leftJoin(sq, eq(users.id, sq.id))
```

**9. Aggregated Selects:**

```ts
const result = await db.select({ count: sql<number>`count(*)` }).from(product)
```

**10. Group By/Having:**

```ts
await db
  .select({ count: sql<number>`count(${user.id})`, city: user.city })
  .from(user)
  .groupBy(({ city }) => city)
  .having(({ count }) => count)
```

**11. Complex Selects with Joins and Aggregations:**

```ts
db.select({
  id: orders.id,
  shippedDate: orders.shippedDate,
  shipName: orders.shipName,
  shipCity: orders.shipCity,
  shipCountry: orders.shipCountry,
  productsCount: sql<number>`count(${details.productId})`,
  quantitySum: sql<number>`sum(${details.quantity})`,
  totalPrice: sql<number>`sum(${details.quantity} * ${details.unitPrice})`,
})
  .from(orders)
  .leftJoin(details, eq(orders.id, details.orderId))
  .groupBy(orders.id)
```

**12. Insert, Update, and Delete Operations:**

```ts
type NewUser = InferModel<typeof users, 'insert'>

const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user)
}

const newUser: NewUser = { name: 'Alef' }
await insertUser(newUser)

await db.update(users).set({ name: 'Mr. Dan' }).where(eq(users.name, 'Dan'))

await db.delete(users).where(eq(users.name, 'Dan'))
```

**13. Prepared Statements:**

```ts
const prepared = db.query.users
  .findMany({
    with: {
      posts: {
        limit: placeholder('limit'),
      },
    },
  })
  .prepare()

const usersWithPosts = await prepared.execute({ limit: 1 })
```

Drizzle ORM also offers some additional querying features such as nested loading, selective field loading, placeholder usage for prepared statements, and more. These examples cover only a portion of Drizzle ORM's capabilities.
