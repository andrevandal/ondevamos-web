CREATE TABLE `categories` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`label` varchar(100) NOT NULL,
	`description` text,
	`icon` json,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `medias` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`type` enum('image','video') NOT NULL,
	`title` text,
	`description` text,
	`alternative_text` text,
	`url` text NOT NULL,
	`active` boolean DEFAULT false,
	`status` enum('pending','completed','error') DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	`external_metadata` json,
	CONSTRAINT `medias_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `opening_hours` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`day_of_week` int NOT NULL,
	`open_time1` int NOT NULL,
	`close_time1` int NOT NULL,
	`open_time2` int,
	`close_time2` int,
	`active` boolean DEFAULT false,
	`is_open_24_hours` boolean DEFAULT false,
	`is_closed` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `opening_hours_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `special_opening_hours` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`description` text,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`open_time1` int NOT NULL,
	`close_time1` int NOT NULL,
	`open_time2` int,
	`close_time2` int,
	`is_open_24_hours` boolean DEFAULT false,
	`is_closed` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `special_opening_hours_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `attractions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`media_id` bigint,
	`featured` boolean NOT NULL,
	`active` boolean DEFAULT false,
	`order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `attractions_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`ibge_code` varchar(7) NOT NULL,
	`name` text NOT NULL,
	`state` text NOT NULL,
	`country` text NOT NULL,
	`label` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`external_metadata` json,
	CONSTRAINT `cities_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `ibge_code` UNIQUE(`ibge_code`)
);
--> statement-breakpoint
CREATE TABLE `places` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`rating_level` double,
	`rating_count` int,
	`pricing_level` int,
	`pricing_count` int,
	`address` json,
	`actions` json,
	`cover_media_id` bigint,
	`avatar_media_id` bigint,
	`city_id` bigint NOT NULL,
	`external_id` varchar(128),
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	`external_metadata` json,
	CONSTRAINT `places_id` PRIMARY KEY(`id`),
	CONSTRAINT `place_slug` UNIQUE(`slug`),
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `places_to_categories` (
	`category_id` bigint NOT NULL,
	`place_id` bigint NOT NULL,
	CONSTRAINT `places_to_categories_category_id_place_id` PRIMARY KEY(`category_id`,`place_id`)
);
--> statement-breakpoint
CREATE TABLE `places_to_tags` (
	`tag_id` bigint NOT NULL,
	`place_id` bigint NOT NULL,
	CONSTRAINT `places_to_tags_place_id_tag_id` PRIMARY KEY(`place_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`label` varchar(100) NOT NULL,
	`description` text,
	`icon` json,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);