CREATE TABLE `action` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`title` text,
	`link` text,
	`icon_name` text,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `address` (
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
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `attraction` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`media_id` bigint,
	`is_featured` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `category` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`name` text NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon_name` text,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `city` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`name` text NOT NULL,
	`state` text NOT NULL,
	`country` text NOT NULL,
	`latitude` double,
	`longitude` double,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`type` text NOT NULL,
	`title` text,
	`description` text,
	`alternative_text` text,
	`url` text NOT NULL,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `opening_hour` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`day_of_week` int NOT NULL,
	`open_time` text NOT NULL,
	`close_time` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `place` (
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
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `place_category` (
	`place_id` bigint NOT NULL,
	`category_id` bigint NOT NULL,
	PRIMARY KEY(`category_id`,`place_id`)
);
--> statement-breakpoint
CREATE TABLE `place_tag` (
	`place_id` bigint NOT NULL,
	`tag_id` bigint NOT NULL,
	PRIMARY KEY(`place_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `special_opening_hour` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`place_id` bigint NOT NULL,
	`description` text,
	`date` text NOT NULL,
	`open_time` text NOT NULL,
	`close_time` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` bigint AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`uuid` varchar(12) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`description` text,
	`icon_name` text,
	`active` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp);
--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `action` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `address` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `attraction` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `category` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `slug` ON `category` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `city` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `media` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `opening_hour` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `place` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `slug` ON `place` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `external_id` ON `place` (`external_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `special_opening_hour` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `uuid` ON `tag` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `slug` ON `tag` (`slug`);