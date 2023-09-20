# OndeVamos.app

You are a senior software web developer. Good in HTML, Web Standards, Clean Code, Javascript, Typescript, Tailwind CSS, Vue 3 and Nuxt 3. We're creating an app that will help people find places to go to in their city. The app will be called "OndeVamos.app". It will be a web app.

## Project Folder Tree

.
├── LICENSE
├── PROMPT.md
├── README.md
├── app
│   └── router.options.ts
├── backup
│   ├── backup.md
│   ├── config
│   │   └── permissions.ts
│   ├── docs
│   │   └── auth
│   │       ├── permissions.md
│   │       ├── sign-in.md
│   │       └── verify.md
│   ├── layouts
│   │   ├── admin.vue
│   │   ├── empty.vue
│   │   └── middleware
│   │       └── auth.ts
│   ├── middleware
│   ├── pages
│   │   └── admin
│   │       ├── categories
│   │       │   └── index.vue
│   │       ├── index.vue
│   │       ├── login.vue
│   │       ├── medias
│   │       │   └── index.vue
│   │       ├── places
│   │       │   └── index.vue
│   │       ├── tags
│   │       │   └── index.vue
│   │       ├── unauthorized.vue
│   │       └── verify.vue
│   ├── server
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   ├── signin.post.ts
│   │   │   │   └── verify.post.ts
│   │   │   ├── db-test.ts
│   │   │   └── medias
│   │   │       └── index.get.ts
│   │   ├── middleware
│   │   │   └── session.ts
│   │   └── repositories
│   │       ├── groups.ts
│   │       ├── legalEntity.ts
│   │       ├── permissions.ts
│   │       ├── user-devices.ts
│   │       ├── user-provider.ts
│   │       ├── user-verification-code.ts
│   │       └── user.ts
│   └── services
│       ├── device-detection.ts
│       ├── email.ts
│       ├── jwt.ts
│       └── session.ts
├── components
│   ├── AppFooter.vue
│   ├── AppHeader.vue
│   ├── AppNavigation.vue
│   ├── AppProfileMenu.vue
│   ├── Base
│   │   ├── BaseAd.vue
│   │   ├── BaseButton.vue
│   │   ├── BaseHorizontalScroll.vue
│   │   ├── BaseModal.vue
│   │   ├── BasePlaceCard.vue
│   │   ├── BasePriceLevel.vue
│   │   ├── BaseRating.vue
│   │   ├── BaseSearch.vue
│   │   ├── BaseSection.vue
│   │   └── BaseSingle.vue
│   ├── PillsList.vue
│   └── TheFilteringSearch.vue
├── composables
│   └── useSearch.ts
├── content
│   ├── providers
│   │   ├── dom-catuto-burger.md
│   │   └── dom-catuto-burger2.md
│   └── resources
│       ├── doces-guloseimas.md
│       └── hamburgueria.md
├── db.md
├── drizzle.config.ts
├── env.d.ts
├── histoire.config.ts
├── layouts
│   ├── default.vue
│   └── profile.vue
├── nuxt.config.ts
├── package.json
├── pages
│   ├── index.vue
│   └── p
│       └── [slug].vue
├── plugins
│   └── vue-gtag.client.ts
├── pnpm-lock.yaml
├── prompts
│   ├── drizzle.md
│   └── server-crud.md
├── public
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── fonts
│   │   └── Inter.woff2
│   └── images
│       ├── 100x100.png
│       ├── 1080x1350.png
│       ├── 270x338.png
│       ├── 32.jpeg
│       ├── 375x165.png
│       ├── 40x40.png
│       ├── 809-40x40.jpg
│       ├── icon-dark.png
│       ├── icon.svg
│       ├── logo-dark-mono.svg
│       ├── logo-dark.svg
│       ├── logo-light-mono.svg
│       ├── logo-light.svg
│       └── social.png
├── server
│   ├── api
│   │   ├── categories
│   │   │   ├── [id].post.ts
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   ├── tags
│   │   │   ├── [id].post.ts
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   └── v1
│   │       ├── cities.get.ts
│   │       ├── medias
│   │       │   ├── [uuid].put.ts
│   │       │   └── index.post.ts
│   │       └── places
│   │           ├── [uuid].get.ts
│   │           ├── [uuid].put.ts
│   │           ├── default_cities.sql
│   │           ├── index.get.ts
│   │           └── index.post.ts
│   ├── collections
│   │   ├── categories.http
│   │   ├── medias.http
│   │   ├── places.http
│   │   └── tags.http
│   ├── middleware
│   ├── migrateToLatest.ts
│   ├── migrations
│   │   ├── 0000_big_sentry.sql
│   │   └── meta
│   │       ├── 0000_snapshot.json
│   │       └── _journal.json
│   ├── repositories
│   │   ├── attractions.ts
│   │   ├── categories.ts
│   │   ├── cities.ts
│   │   ├── medias.ts
│   │   ├── openingHours.ts
│   │   ├── places.ts
│   │   ├── specialOpeningHours.ts
│   │   └── tags.ts
│   ├── schemas
│   │   ├── db
│   │   │   ├── categories.ts
│   │   │   ├── medias.ts
│   │   │   ├── openingHours.ts
│   │   │   ├── places.ts
│   │   │   └── tags.ts
│   │   └── endpoints
│   │       ├── attractions.ts
│   │       ├── index.ts
│   │       ├── openingHours.ts
│   │       └── places.ts
│   ├── services
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   ├── index.ts
│   │   ├── minio.ts
│   │   ├── nanoid.ts
│   │   └── schemaValidation.ts
│   └── tsconfig.json
├── tailwind.config.ts
├── tsconfig.json
├── types
│   └── nitro.ts
└── utils
    └── readFilesInFolder.ts

## We're using

- [Nuxt 3](https://v3.nuxtjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Drizzle](https://orm.drizzle.team/)
- [PlaneScale](https://planetscale.com/)

## Database Entities

1. Places
   - ID: Auto-inc. key (int)
   - UUID: Unique Nano ID (12 chars)
   - Name: Place name
   - Slug: SEO-friendly identifier
   - Description: Place's short desc
   - Rating Level & Count: Avg. rating in 0.5 steps & count
   - Pricing Level & Count: Pricing level (1=low,4=high) & count
   - Address: Address JSON object
   - Actions: Array of Action JSON objects
   - Cover & Avatar Media ID: FKs to Media table
   - Active: Boolean for place's activity
   - City: FK to City table
   - External ID: Unique ID from external sys.
   - Created At & Updated At: Timestamps
   - External Metadata: JSON object for external sys.
2. Category
   - ID & UUID: As above
   - Name: Category name
   - Label: Custom label for the category
   - Slug: SEO-friendly identifier
   - Description: Category's short desc
   - Icon: Icon name & className in JSON
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
   - Active: Boolean for media's activity
   - Status: Media status ("pending", "completed", "error"). Default: "pending"
   - External Metadata: JSON object for external sys.
5. Attractions
   - ID, UUID, Created At & Updated At: As above
   - Place ID: FK to Place
   - Title: Attraction title
   - Description: Attraction's short desc
   - Media ID: (optional) FK to Media
   - Featured: Boolean for feature status
   - Order: Order of attraction in place
6. Opening Hours
   - ID, UUID, Created At & Updated At: As above
   - Place ID: FK to Place
   - Day of Week: Numeric day of week (0-6)
   - Open & Close Time: Time slots
7. Special Opening Hours
   - ID, UUID, Place ID, Description, Open & Close Time, Created At & Updated At: As above
   - Date: Date of special event or holiday
8. Cities
    - ID, UUID, Created At & Updated At: As above
    - IBGE Code: Unique code from IBGE
    - Name: City name
    - State & Country: State & Country of the city
    - Label: Custom label for the city
    - External Metadata: JSON object for external sys.

## Entities Relations

1. Place <> Media (Cover & Avatar) (1:1)
   - Each Place has 1 cover & avatar media
2. Place <> City (N:1)
   - 1 Place belongs to 1 City
   - 1 City contains many Places
3. Place <> Attraction (1:N)
   - 1 Place presents many Attractions
   - Each Attraction tied to a Place
4. Attraction <> Media (N:1)
   - 1 Attraction can have 1 associated Media
   - 1 Media can associate with many Attractions
5. Place <> Opening Hour (1:N)
   - 1 Place has many Opening Hours
   - Each Opening Hour tied to a Place
6. Place <> Special Opening Hour (1:N)
   - 1 Place has many Special Opening Hours
   - Each Special Opening Hour tied to a Place
7. Place <> Category (N:N)
   - 1 Place belongs to multiple Categories
   - 1 Category hosts many Places
8. Place <> Tag (N:N)
   - 1 Place holds multiple Tags
   - 1 Tag related to many Places
