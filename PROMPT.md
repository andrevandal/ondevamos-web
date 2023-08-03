# OndeVamos.app

You are a senior software web developer. Good in HTML, Web Standards, Clean Code, Javascript, Typescript, Tailwind CSS, Vue 3 and Nuxt 3. We're creating an app that will help people find places to go to in their city. The app will be called "OndeVamos.app". It will be a web app.

## Project Folder Tree

.
├── app
│  └── router.options.ts
├── components
│  ├── AppFooter.vue
│  ├── AppHeader.vue
│  ├── AppNavigation.vue
│  ├── AppProfileMenu.vue
│  ├── Base
│  │  ├── BaseAd.vue
│  │  ├── BaseButton.vue
│  │  ├── BaseHorizontalScroll.vue
│  │  ├── BaseModal.vue
│  │  ├── BasePlaceCard.vue
│  │  ├── BasePriceLevel.vue
│  │  ├── BaseRating.vue
│  │  ├── BaseSearch.vue
│  │  ├── BaseSection.vue
│  │  └── BaseSingle.vue
│  ├── PillsList.vue
│  └── TheFilteringSearch.vue
├── composables
│  └── useSearch.ts
├── db.md
├── drizzle.config.ts
├── env.d.ts
├── layouts
│  ├── admin.vue
│  ├── default.vue
│  ├── login.vue
│  └── profile.vue
├── LICENSE
├── nuxt.config.ts
├── package.json
├── pages
│  ├── admin
│  │  ├── index.vue
│  │  ├── login.vue
│  │  ├── unauthorized.vue
│  │  └── verify.vue
│  ├── index.vue
│  └── p
│     └── [slug].vue
├── plugins
│  └── vue-gtag.client.ts
├── pnpm-lock.yaml
├── PROMPT.md
├── README.md
├── schemas.ts
├── server
│  ├── api
│  │  ├── auth
│  │  │  ├── signin.post.ts
│  │  │  └── verify.post.ts
│  │  ├── categories.get.ts
│  │  ├── db-test.ts
│  │  ├── medias
│  │  │  ├── index.get.ts
│  │  │  └── request-upload.post.ts
│  │  ├── place
│  │  │  └── [slug].get.ts
│  │  └── places.get.ts
│  ├── collections
│  │  └── upload-file.http
│  ├── middleware
│  ├── migrateToLatest.ts
│  ├── migrations
│  │  ├── 0000_brainy_vargas.sql
│  │  ├── 0001_minor_venus.sql
│  │  ├── 0002_curious_synch.sql
│  │  ├── 0003_grey_lila_cheney.sql
│  │  └── meta
│  │     ├── 0000_snapshot.json
│  │     ├── 0001_snapshot.json
│  │     ├── 0002_snapshot.json
│  │     ├── 0003_snapshot.json
│  │     └── _journal.json
│  ├── repositories
│  │  ├── action.ts
│  │  ├── address.ts
│  │  ├── attraction.ts
│  │  ├── category.ts
│  │  ├── city.ts
│  │  ├── groups.ts
│  │  ├── legalEntity.ts
│  │  ├── media.ts
│  │  ├── openingHour.ts
│  │  ├── permissions.ts
│  │  ├── place.ts
│  │  ├── specialOpeningHour.ts
│  │  ├── tag.ts
│  │  ├── user-devices.ts
│  │  ├── user-provider.ts
│  │  ├── user.ts
│  │  └── verification-code.ts
│  ├── schemas
│  │  └── database.ts
│  └── services
│     ├── database.ts
│     ├── email.ts
│     ├── jwt.ts
│     ├── nanoid.ts
│     └── permission.ts
├── tailwind.config.js
├── tsconfig.json
└── utils
   └── readFilesInFolder.ts

## We're using

- [Nuxt 3](https://v3.nuxtjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle](https://orm.drizzle.team/)
- [PlaneScale](https://planetscale.com/)

## Database Entities

1. Place
   - ID: Auto-inc. key (int)
   - UUID: Unique Nano ID (12 chars)
   - Name: Place name
   - Slug: SEO-friendly identifier
   - Description: Place's short desc
   - Rating Level & Count: Avg. rating in 0.5 steps & count
   - Pricing Level & Count: Pricing level (1=low,4=high) & count
   - Cover & Avatar Media ID: FKs to Media table
   - Active: Boolean for place's activity
   - External ID: Unique ID from external sys.
   - Created At & Updated At: Timestamps
   - Address ID: FK to Address table
2. Category
   - ID & UUID: As above
   - Name: Category name
   - Slug: SEO-friendly identifier
   - Description: Category's short desc
   - Icon: Icon name & label in JSON
   - Active & Timestamps: As above
3. Tag
   - ID, UUID, Slug, Description, Icon, Active, Created At & Updated At: As above
4. Media
   - ID, UUID, Active, Created At & Updated At: As above
   - Type: Media type ("image" or "video")
   - Title: Media title
   - Description: Media's short description
   - Alternative Text: Text for accessibility
   - URL: Media storage URL
5. Action
   - ID, UUID, Created At & Updated At: As above
   - Place ID: FK to Place
   - Title: Action title
   - Link: Linked URL
   - Icon Name: (optional) Icon name
6. Attraction
   - ID, UUID, Created At & Updated At: As above
   - Place ID: FK to Place
   - Title: Attraction title
   - Description: Attraction's short desc
   - Media ID: (optional) FK to Media
   - Is Featured: Boolean for feature status
7. Opening Hour
   - ID, UUID, Created At & Updated At: As above
   - Place ID: FK to Place
   - Day of Week: Numeric day of week (0-6)
   - Open & Close Time: Time slots
8. Special Opening Hour
   - ID, UUID, Place ID, Description, Open & Close Time, Created At & Updated At: As above
   - Date: Date of special event or holiday
9. Address
   - ID, UUID: As above
   - Street, Number, Complement, Neighborhood: Address info
   - City ID: FK to City
   - Latitude & Longitude: Geo coords
10. City
    - ID, UUID, Created At & Updated At: As above
    - Name: City name
    - State & Country: State & Country of the city
    - Latitude & Longitude: Geo coords

## Entities Relations

1. Place <> Media (Cover & Avatar) (1:1)
   - Each Place has 1 cover & avatar media
2. Place <> City (N:1)
   - 1 Place belongs to 1 City
   - 1 City contains many Places
3. Place <> Action (1:N)
   - 1 Place hosts many Actions
   - Each Action tied to a Place
4. Place <> Attraction (1:N)
   - 1 Place presents many Attractions
   - Each Attraction tied to a Place
5. Attraction <> Media (N:1)
   - 1 Attraction can have 1 associated Media
   - 1 Media can associate with many Attractions
6. Place <> Opening Hour (1:N)
   - 1 Place has many Opening Hours
   - Each Opening Hour tied to a Place
7. Place <> Special Opening Hour (1:N)
   - 1 Place has many Special Opening Hours
   - Each Special Opening Hour tied to a Place
8. Place <> Category (N:N)
   - 1 Place belongs to multiple Categories
   - 1 Category hosts many Places
9. Place <> Tag (N:N)
   - 1 Place holds multiple Tags
   - 1 Tag related to many Places

## SQL Queries via Drizzle ORM

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
