// server/migrations/YYYYMMDDHHMMSS_create_all_tables.ts
import { Kysely, sql } from 'kysely'
import { Database } from '../models/database'

export async function up(db: Kysely<Database>): Promise<void> {
  // Create Address table
  await db.schema
    .createTable('address')
    .addColumn('id', 'bigint', (col) =>
      col.notNull().autoIncrement().primaryKey(),
    )
    .addColumn('public_id', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('street', 'text')
    .addColumn('number', 'text')
    .addColumn('complement', 'text')
    .addColumn('neighborhood', 'text')
    .addColumn('city', 'text')
    .addColumn('state', 'text')
    .addColumn('country', 'text')
    .addColumn('zip_code', 'text')
    .addColumn('latitude', 'double precision')
    .addColumn('longitude', 'double precision')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql.raw('CURRENT_TIMESTAMP')),
    )
    .addColumn('updated_at', 'timestamp')
    .execute()

  // Create Place table
  await db.schema
    .createTable('place')
    .addColumn('id', 'bigint', (col) =>
      col.notNull().autoIncrement().primaryKey(),
    )
    .addColumn('public_id', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('name', 'text')
    .addColumn('slug', 'text')
    .addColumn('description', 'text')
    .addColumn('rating_level', 'double precision')
    .addColumn('rating_count', 'integer')
    .addColumn('pricing_level', 'integer')
    .addColumn('pricing_level_count', 'integer')
    .addColumn('address_id', 'bigint')
    .addColumn('cover_media_id', 'bigint')
    .addColumn('avatar_media_id', 'bigint')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql.raw('CURRENT_TIMESTAMP')),
    )
    .addColumn('updated_at', 'timestamp')
    .execute()

  // Create Category table
  await db.schema
    .createTable('category')
    .addColumn('id', 'bigint', (col) =>
      col.notNull().autoIncrement().primaryKey(),
    )
    .addColumn('public_id', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('name', 'text')
    .addColumn('slug', 'text')
    .addColumn('description', 'text')
    .addColumn('icon_name', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql.raw('CURRENT_TIMESTAMP')),
    )
    .addColumn('updated_at', 'timestamp')
    .execute()

  // Create Tag table
  await db.schema
    .createTable('tag')
    .addColumn('id', 'bigint', (col) =>
      col.notNull().autoIncrement().primaryKey(),
    )
    .addColumn('public_id', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('name', 'text')
    .addColumn('slug', 'text')
    .addColumn('description', 'text')
    .addColumn('icon_name', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql.raw('CURRENT_TIMESTAMP')),
    )
    .addColumn('updated_at', 'timestamp')
    .execute()

  // Create Media table
  await db.schema
    .createTable('media')
    .addColumn('id', 'bigint', (col) =>
      col.notNull().autoIncrement().primaryKey(),
    )
    .addColumn('public_id', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('type', 'text')
    .addColumn('title', 'text')
    .addColumn('description', 'text')
    .addColumn('alternative_text', 'text')
    .addColumn('url', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql.raw('CURRENT_TIMESTAMP')),
    )
    .addColumn('updated_at', 'timestamp')
    .execute()

  // Create Action table
  await db.schema
    .createTable('action')
    .addColumn('id', 'bigint', (col) =>
      col.notNull().autoIncrement().primaryKey(),
    )
    .addColumn('public_id', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('place_id', 'bigint', (col) => col.notNull())
    .addColumn('title', 'text')
    .addColumn('link', 'text')
    .addColumn('icon_name', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql.raw('CURRENT_TIMESTAMP')),
    )
    .addColumn('updated_at', 'timestamp')
    .execute()
  // Create Attraction table
  await db.schema
    .createTable('attraction')
    .addColumn('id', 'bigint', (col) =>
      col.notNull().autoIncrement().primaryKey(),
    )
    .addColumn('public_id', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('place_id', 'bigint', (col) => col.notNull())
    .addColumn('title', 'text')
    .addColumn('description', 'text')
    .addColumn('media_id', 'bigint', (col) => col.references('media.media_id'))
    .addColumn('is_featured', 'boolean')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql.raw('CURRENT_TIMESTAMP')),
    )
    .addColumn('updated_at', 'timestamp')
    .execute()

  // Create OpeningHour table
  await db.schema
    .createTable('opening_hour')
    .addColumn('id', 'bigint', (col) =>
      col.notNull().autoIncrement().primaryKey(),
    )
    .addColumn('public_id', 'varchar(12)', (col) => col.notNull().unique())
    .addColumn('place_id', 'bigint', (col) => col.notNull())
    .addColumn('day_of_week', 'text')
    .addColumn('open_time', 'time')
    .addColumn('close_time', 'time')
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql.raw('CURRENT_TIMESTAMP')),
    )
    .addColumn('updated_at', 'timestamp')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse order of creation
  await db.schema.dropTable('opening_hour').execute()
  await db.schema.dropTable('attraction').execute()
  await db.schema.dropTable('action').execute()
  await db.schema.dropTable('media').execute()
  await db.schema.dropTable('tag').execute()
  await db.schema.dropTable('category').execute()
  await db.schema.dropTable('place').execute()
  await db.schema.dropTable('address').execute()
}
