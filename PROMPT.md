we're creating an app that will help people find places to go to in their city. The app will be called "OndeVamos.app". It will be a web app.

## Project Folder Tree:
```
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
│  ├── default.vue
│  └── profile.vue
├── LICENSE
├── nuxt.config.ts
├── package.json
├── pages
│  ├── index.vue
│  └── p
│     └── [slug].vue
├── plugins
│  └── vue-gtag.client.ts
├── pnpm-lock.yaml
├── README.md
├── schemas.ts
├── server
│  ├── api
│  │  ├── categories.get.ts
│  │  ├── db-test.ts
│  │  ├── place
│  │  │  └── [slug].get.ts
│  │  └── places.get.ts
│  ├── middleware
│  ├── migrateToLatest.ts
│  ├── migrations
│  │  ├── 0000_concerned_captain_stacy.sql
│  │  └── meta
│  │     ├── 0000_snapshot.json
│  │     └── _journal.json
│  ├── repositories
│  │  ├── actionRepository.ts
│  │  ├── addressRepository.ts
│  │  ├── attractionRepository.ts
│  │  ├── categoryRepository.ts
│  │  ├── mediaRepository.ts
│  │  ├── openingHourRepository.ts
│  │  ├── placeRepository.ts
│  │  ├── repositoryFactory.ts
│  │  └── tagRepository.ts
│  ├── schemas
│  │  └── database.ts
│  └── services
│     └── database.ts
├── tailwind.config.js
├── tsconfig.json
└── utils
   └── readFilesInFolder.ts
```

## We're using:
- [Nuxt 3](https://v3.nuxtjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle](https://orm.drizzle.team/)
- [PlaneScale](https://planetscale.com/)

## Database Entities:

1. Place
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Name: Name of the place
   - Slug: Unique URL-friendly identifier (used for SEO purposes)
   - Description: Short description of the place
   - Rating Level: Average rating of the place (0-5, in steps of 0.5)
   - Rating Count: Number of ratings submitted for the place
   - Pricing Level: The pricing level of the place (1-4, with 1 = low, 2 = medium, 3 = high, 4 = very high)
   - Pricing Level Count: Number of pricing level categories within the application
   - Cover Media ID: Foreign key referring to the cover media in the Media table
   - Avatar Media ID: Foreign key referring to the avatar media in the Media table
   - Active: Boolean indicating if the place is active or not
   - External ID: A unique identifier imported from an external system
   - Created At: Timestamp when the place was created
   - Updated At: Timestamp when the place was last updated
   - Address ID: Foreign key referring to the address in the Address table

2. Category
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Name: Name of the category
   - Slug: Unique URL-friendly identifier (used for SEO purposes)
   - Description: Short description of the category
   - Icon: JSON including icon name and icon label
   - Active: Boolean indicating if the place is active or not
   - Created At: Timestamp when the category was created
   - Updated At: Timestamp when the category was last updated

3. Tag
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Slug: Unique URL-friendly identifier (used for SEO purposes)
   - Description: Short description of the tag
   - Icon: JSON including icon name and icon label
   - Active: Boolean indicating if the place is active or not
   - Created At: Timestamp when the flag was created
   - Updated At: Timestamp when the flag was last updated

4. Media
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Type: Type of media, either "image" or "video"
   - Title: Title of the media item
   - Description: Short description of the media item
   - Alternative Text: Textual description used for accessibility purposes
   - URL: URL where the media is stored
   - Active: Boolean indicating if the place is active or not
   - Created At: Timestamp when the media was created
   - Updated At: Timestamp when the media was last updated

5. Action
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Place ID: Foreign key referencing the Place table using ID
   - Title: Title of the action
   - Link: URL or link associated with the action
   - Icon Name: (optional) Icon name representing the action
   - Created At: Timestamp when the action was created
   - Updated At: Timestamp when the action was last updated

6. Attraction
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Place ID: Foreign key referencing the Place table using ID
   - Title: Title of the attraction
   - Description: Description of the attraction
   - Media ID: (optional) Foreign key referencing the related media in the Media table using ID
   - Is Featured: Boolean value indicating whether the attraction is featured
   - Created At: Timestamp when the attraction was created
   - Updated At: Timestamp when the attraction was last updated

7. Opening Hour
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Place ID: Foreign key referencing the Place table using ID
   - Day of Week: Numeric representation of the day of the week (0-6; e.g., 0 = Sunday, 1 = Monday)
   - Open Time: Time when the place opens
   - Close Time: Time when the place closes
   - Created At: Timestamp when the opening hour was created
   - Updated At: Timestamp when the opening hour was last updated

8. Special Opening Hour
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Place ID: Foreign key referencing the Place table using ID
   - Description: Description of the holiday or special event
   - Date: Date of the holiday or special event
   - Open Time: Time when the place opens
   - Close Time: Time when the place closes
   - Created At: Timestamp when the special opening hour was created
   - Updated At: Timestamp when the special opening hour was last updated

9. Address
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Street: Street name of the place's address
   - Number: Building number of the place's address
   - Complement: Additional information about the address (e.g., apartment number)
   - Neighborhood: Neighborhood of the place's address
   - City ID: Foreign key referring to the place's city in the City table
   - Latitude: Latitude coordinate of the city's location
   - Longitude: Longitude coordinate of the city's location

10. City
   - ID: Auto-incrementing primary key (integer)
   - UUID: Unique Nano ID (12 characters long) for public purposes
   - Name: Name of the city
   - State: State or province of the city
   - Country: Country of the city
   - Latitude: Latitude coordinate of the city's location
   - Longitude: Longitude coordinate of the city's location
   - Created At: Timestamp when the city was created
   - Updated At: Timestamp when the city was last updated

11. PlaceCategory (Mapping Table)
    - Place ID: Foreign key referencing the Place table using ID
    - Category ID: Foreign key referencing the Category table using ID
  
12. PlaceTag (Mapping Table)
    - Place ID: Foreign key referencing the Place table using ID
    - Tag ID: Foreign key referencing the Tag table using ID

## Entities Relations:

1. Place and Media (Cover Media and Avatar Media) (One-to-One)
   - One Place has one cover media
   - One Place has one avatar media
  
2. Place and City (Many-to-One)
   - One Place is located in one City
   - One City can have many Places

3. Place and Action (One-to-Many)
   - One Place can have multiple Actions
   - One Action is related to one Place

4. Place and Attraction (One-to-Many)
   - One Place can have multiple Attractions
   - One Attraction is related to one Place

5. Attraction and Media (Many-to-One)
   - One Attraction can have one related Media item
   - One Media item can be related to multiple Attractions (if the same media is used for different attractions)

6. Place and Opening Hour (One-to-Many)
   - One Place can have multiple Opening Hours (one per day of the week)
   - One Opening Hour is related to one Place

7. Place and Special Opening Hour (One-to-Many)
   - One Place can have multiple Special Opening Hours (for holidays or special events)
   - One Special Opening Hour is related to one Place 

8. Place and Category (Many-to-Many)
   - One Place can have multiple Categories
   - One Category can be assigned to multiple Places

9. Place and Tag (Many-to-Many)
   - One Place can have multiple Tags
   - One Tag can be assigned to multiple Places

## SQL Queries via Drizzle ORM:

Drizzle ORM provides a method to write SQL queries in JavaScript.

**1. Simple Select Query:**
```ts
const result: User[] = await db.select().from(users);
```

**2. Select Query with Specific Fields:**
```ts
const result = await db.select({
  field1: users.id,
  field2: users.name,
}).from(users);
```

**3. Conditional Selection:**
```ts
async function selectUsers(withName: boolean) {
  return db
    .select({
      id: users.id,
      ...(withName ? { name: users.name } : {}),
    })
    .from(users);
}
```

**4. Where Conditions with Logical Operators:**
```ts
await db.select().from(users).where(
  or(
    eq(users.id, 42), 
    eq(users.name, 'Dan')
  )
);
```

**5. Limit and Offset:**
```ts
await db.select().from(users).limit(10).offset(10);
```

**6. Order By:**
```ts
await db.select().from(users).orderBy(desc(users.name));
```

**7. CTE (Common Table Expressions):**
```ts
const sq = db.select().from(users).where(eq(users.id, 42)).as('sq');
const result = await db.select().from(sq);
```

**8. Joins:**
```ts
const result = await db.select().from(users).leftJoin(sq, eq(users.id, sq.id));
```

**9. Aggregated Selects:**
```ts
const result = await db.select({ count: sql<number>`count(*)` }).from(product);
```

**10. Group By/Having:**
```ts
await db.select({ count: sql<number>`count(${user.id})`, city: user.city })
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
.groupBy(orders.id);
```

**12. Insert, Update, and Delete Operations:**
```ts
type NewUser = InferModel<typeof users, "insert">;
 
const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user);
}
 
const newUser: NewUser = { name: "Alef" };
await insertUser(newUser);

await db.update(users)
  .set({ name: 'Mr. Dan' })
  .where(eq(users.name, 'Dan'));

await db.delete(users).where(eq(users.name, 'Dan'));
```

**13. Prepared Statements:**
```ts
const prepared = db.query.users.findMany({
	with: {
		posts: {
			limit: placeholder('limit'),
		},
	},
}).prepare();
 
const usersWithPosts = await prepared.execute({ limit: 1 });
```

Drizzle ORM also offers some additional querying features such as nested loading, selective field loading, placeholder usage for prepared statements, and more. These examples cover only a portion of Drizzle ORM's capabilities.