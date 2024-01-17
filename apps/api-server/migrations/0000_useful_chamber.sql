DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('pending', 'completed', 'error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('image', 'video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "attractions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"media_id" uuid,
	"featured" boolean NOT NULL,
	"active" boolean DEFAULT false,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"label" varchar(100) NOT NULL,
	"description" text,
	"icon" json,
	"active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ibge_code" varchar(7) NOT NULL,
	"name" text NOT NULL,
	"state" text NOT NULL,
	"country" text NOT NULL,
	"label" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"external_metadata" json,
	CONSTRAINT "cities_ibge_code_unique" UNIQUE("ibge_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "medias" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" "type" NOT NULL,
	"filename" text NOT NULL,
	"title" text,
	"description" text,
	"alternative_text" text,
	"url" text NOT NULL,
	"active" boolean DEFAULT false,
	"status" "status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"external_metadata" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "opening_hours" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"open_time1" integer NOT NULL,
	"close_time1" integer NOT NULL,
	"open_time2" integer,
	"close_time2" integer,
	"active" boolean DEFAULT false,
	"is_open_24_hours" boolean DEFAULT false,
	"is_closed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "places" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"rating_level" numeric(2),
	"rating_count" integer,
	"pricing_level" integer,
	"pricing_count" integer,
	"address" json,
	"actions" json,
	"cover_media_id" uuid,
	"avatar_media_id" uuid,
	"city_id" uuid NOT NULL,
	"external_id" varchar(128),
	"active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"external_metadata" json,
	CONSTRAINT "places_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "places_to_categories" (
	"category_id" uuid NOT NULL,
	"place_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "places_to_medias" (
	"place_id" uuid NOT NULL,
	"media_id" uuid NOT NULL,
	"featured" boolean DEFAULT false,
	"active" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "places_to_tags" (
	"tag_id" uuid NOT NULL,
	"place_id" uuid NOT NULL,
	CONSTRAINT places_to_tags_tag_id_place_id PRIMARY KEY("tag_id","place_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "special_opening_hours" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"place_id" uuid NOT NULL,
	"description" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"open_time1" integer NOT NULL,
	"close_time1" integer NOT NULL,
	"open_time2" integer,
	"close_time2" integer,
	"is_open_24_hours" boolean DEFAULT false,
	"is_closed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(100) NOT NULL,
	"label" varchar(100) NOT NULL,
	"description" text,
	"icon" json,
	"active" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "attractions_place_id_index" ON "attractions" ("place_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_index" ON "categories" ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cities_ibge_code_index" ON "cities" ("ibge_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cities_name_index" ON "cities" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "opening_hours_place_id_index" ON "opening_hours" ("place_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "places_slug_index" ON "places" ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "places_to_categories_place_id_index" ON "places_to_categories" ("place_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "places_to_tags_place_id_index" ON "places_to_tags" ("place_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "special_opening_hours_place_id_index" ON "special_opening_hours" ("place_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attractions" ADD CONSTRAINT "attractions_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "attractions" ADD CONSTRAINT "attractions_media_id_medias_uuid_fk" FOREIGN KEY ("media_id") REFERENCES "medias"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "places" ADD CONSTRAINT "places_cover_media_id_medias_uuid_fk" FOREIGN KEY ("cover_media_id") REFERENCES "medias"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "places" ADD CONSTRAINT "places_avatar_media_id_medias_uuid_fk" FOREIGN KEY ("avatar_media_id") REFERENCES "medias"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "places" ADD CONSTRAINT "places_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "special_opening_hours" ADD CONSTRAINT "special_opening_hours_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

INSERT INTO "cities" ("ibge_code", "name", "state", "country", "label") VALUES
  ('3518800', 'Guarulhos', 'SP', 'BR', 'guarulhos'),
  ('3550308', 'São Paulo', 'SP', 'BR', 'sao paulo'),
  ('4118402', 'Paranavaí', 'PR', 'BR', 'paranavai');

INSERT INTO "categories" ("slug", "name", "label", "description", "icon") VALUES 
  ('hamburgueria', 'Hamburgueria', 'Hamburgueria', 'Este lugar serve hamburguers', '{"name": "hamburguer"}'),
  ('restaurante', 'Restaurante', 'Restaurante', 'Este lugar é um restaurante', '{"name": "restaurant"}'),
  ('steak-house', 'Steak House', 'Steak House', 'Este lugar serve carnes', '{"name": "steak"}'),
  ('vegano', 'Vegano', 'Vegano', 'Este lugar serve comida vegana', '{"name": "vegan"}'),
  ('pizzaria', 'Pizzaria', 'Pizzaria', 'Este lugar serve pizzas', '{"name": "pizza"}'),
  ('padaria-e-cafe', 'Padaria e Café', 'Padaria e Café', 'Este lugar serve café e pães', '{"name": "bread"}'),
  ('doces-e-sobremesas', 'Doces e Sobremesas', 'Doces e Sobremesas', 'Este lugar serve doces e sobremesas', '{"name": "dessert"}'),
  ('bares-e-pubs', 'Bares e Pubs', 'Bares e Pubs', 'Este lugar serve bebidas', '{"name": "beer"}'),
  ('gastrobar', 'GastroBar', 'GastroBar', 'Este lugar serve bebidas e comida', '{"name": "beer-food"}'),
  ('comida-japonesa', 'Comida Japonesa', 'Comida Japonesa', 'Este lugar serve comida japonesa', '{"name": "sushi"}'),
  ('comida-italiana', 'Comida Italiana', 'Comida Italiana', 'Este lugar serve comida italiana', '{"name": "macaroni"}'),
  ('comida-nordestina', 'Comida Nordestina', 'Comida Nordestina', 'Este lugar serve comida nordestina', '{"name": "pan-of-food"}'),
  ('lanchonete', 'Lanchonete', 'Lanchonete', 'Este lugar serve lanches', '{"name": "sandwich"}');

INSERT INTO "tags" ("slug", "name", "label", "description", "icon") VALUES 
  ('entrega', 'Entrega', 'Entrega', 'Este lugar oferece serviço de entrega', '{"name": "delivery"}'),
  ('local', 'Local', 'Local', 'Este lugar oferece a opção de comer no local', '{"name": "dine-in"}'),
  ('cerveja', 'Cerveja', 'Cerveja', 'Este lugar serve cerveja', '{"name": "beer"}'),
  ('vegetariano', 'Vegetariano', 'Vegetariano', 'Este lugar serve comida vegetariana', '{"name": "vegetarian-food"}'),
  ('cafe-da-manha', 'Café da Manhã', 'Café da Manhã', 'Este lugar serve café da manhã', '{"name": "breakfast"}'),
  ('brunch', 'Brunch', 'Brunch', 'Este lugar serve brunch', '{"name": "brunch"}'),
  ('jantar', 'Jantar', 'Jantar', 'Este lugar serve jantar', '{"name": "dinner"}'),
  ('almoco', 'Almoço', 'Almoço', 'Este lugar serve almoço', '{"name": "lunch"}'),
  ('vinho', 'Vinho', 'Vinho', 'Este lugar serve vinho', '{"name": "wine"}'),
  ('para-levar', 'Para Levar', 'Para Levar', 'Este lugar oferece a opção de comida para levar', '{"name": "takeout"}');

  