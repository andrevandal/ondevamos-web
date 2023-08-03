CREATE TABLE `actions` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`title` text,
	`link` text,
	`icon_name` text,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`street` text,
	`number` text,
	`complement` text,
	`neighborhood` text,
	`city_id` bigint NOT NULL,
	`latitude` double,
	`longitude` double,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `cities` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`ibge_code` varchar(7) NOT NULL,
	`name` text NOT NULL,
	`state` text NOT NULL,
	`country` text NOT NULL,
	`latitude` double,
	`longitude` double,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `ibge_code` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `attractions` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`media_id` bigint,
	`is_featured` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon` json,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `medias` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`type` text NOT NULL,
	`title` text,
	`description` text,
	`alternative_text` text,
	`url` text NOT NULL,
	`active` boolean DEFAULT false,
	`status` enum('pending','completed','error') DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`external_metadata` json,
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `opening_hours` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`day_of_week` int NOT NULL,
	`open_time` text NOT NULL,
	`close_time` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `special_opening_hours` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`open_time` text NOT NULL,
	`close_time` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `places` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`rating_level` double,
	`rating_count` int,
	`pricing_level` int,
	`pricing_level_count` int,
	`cover_media_id` bigint,
	`avatar_media_id` bigint,
	`address_id` bigint NOT NULL,
	`opening_hour_id` bigint,
	`external_id` bigint,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`external_metadata` json,
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`),
	CONSTRAINT `external_id` UNIQUE(`external_id`)
);
--> statement-breakpoint
CREATE TABLE `places_to_addresses` (
	`address_id` bigint NOT NULL,
	`place_id` bigint NOT NULL,
	CONSTRAINT `places_to_addresses_address_id_place_id` PRIMARY KEY(`address_id`,`place_id`)
);
--> statement-breakpoint
CREATE TABLE `places_to_categories` (
	`place_id` bigint NOT NULL,
	`category_id` bigint NOT NULL,
	CONSTRAINT `places_to_categories_category_id_place_id` PRIMARY KEY(`category_id`,`place_id`)
);
--> statement-breakpoint
CREATE TABLE `places_to_medias` (
	`media_id` bigint NOT NULL,
	`place_id` bigint NOT NULL,
	CONSTRAINT `places_to_medias_media_id_place_id` PRIMARY KEY(`media_id`,`place_id`)
);
--> statement-breakpoint
CREATE TABLE `places_to_tags` (
	`place_id` bigint NOT NULL,
	`tag_id` bigint NOT NULL,
	CONSTRAINT `places_to_tags_place_id_tag_id` PRIMARY KEY(`place_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon_name` json,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);
