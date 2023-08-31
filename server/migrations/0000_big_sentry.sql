CREATE TABLE `categories` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon` json,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `medias` (
	`id` bigint AUTO_INCREMENT NOT NULL,
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
	CONSTRAINT `medias_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `opening_hours` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`day_of_week` int NOT NULL,
	`open_time` time NOT NULL,
	`close_time` time NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`active` boolean DEFAULT false,
	CONSTRAINT `opening_hours_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`)
);
--> statement-breakpoint
CREATE TABLE `special_opening_hours` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`description` text,
	`date` date NOT NULL,
	`open_time` time NOT NULL,
	`close_time` time NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
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
	`featured` int NOT NULL,
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
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	`external_metadata` json,
	CONSTRAINT `places_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`label` varchar(100) NOT NULL,
	`description` text,
	`icon` json,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp,
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `uuid` UNIQUE(`uuid`),
	CONSTRAINT `slug` UNIQUE(`slug`)
);
