import 'dotenv/config'
import { inArray } from 'drizzle-orm'
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator'
import { db } from '../services/database'
import { cities as CitiesTable } from '../schemas/db/places'
import { tags as TagsTable } from '../schemas/db/tags'
import { categories as CategoriesTable } from '../schemas/db/categories'

import { defaultCities, defaultTags, defaultCategories } from './defaults'

try {
  await migrate(db, { migrationsFolder: './server/migrations' })

  const cities = await db
    .select()
    .from(CitiesTable)
    .where(
      inArray(
        CitiesTable.uuid,
        defaultCities.map((city) => city.uuid),
      ),
    )

  const tags = await db
    .select()
    .from(TagsTable)
    .where(
      inArray(
        TagsTable.uuid,
        defaultTags.map((tag) => tag.uuid),
      ),
    )

  const categories = await db
    .select()
    .from(CategoriesTable)
    .where(
      inArray(
        CategoriesTable.uuid,
        defaultCategories.map((category) => category.uuid),
      ),
    )

  if (!cities.length) {
    await db.insert(CitiesTable).values(defaultCities)
  }
  if (!tags.length) {
    await db.insert(TagsTable).values(defaultTags)
  }
  if (!categories.length) {
    await db.insert(CategoriesTable).values(defaultCategories)
  }
} catch (e) {
  console.log(e)
}
