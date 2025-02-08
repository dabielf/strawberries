CREATE TABLE `api_keys` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`key` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`revoked_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_key_unique` ON `api_keys` (`key`);--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text,
	`phone` text,
	`notes` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY NOT NULL,
	`lemon_squeezy_subscription_id` text NOT NULL,
	`lemon_squeezy_order_id` text NOT NULL,
	`user_id` integer NOT NULL,
	`plan` text NOT NULL,
	`status` text NOT NULL,
	`status_formatted` text NOT NULL,
	`renews_at` text,
	`ends_at` text,
	`trial_ends_at` text,
	`price` text NOT NULL,
	`is_usage_based` integer DEFAULT false,
	`is_paused` integer DEFAULT false,
	`subscription_item_id` integer,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_lemon_squeezy_subscription_id_unique` ON `subscriptions` (`lemon_squeezy_subscription_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hashed_password` text NOT NULL,
	`name` text,
	`plan` text DEFAULT 'free' NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `webhook_events` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`payload` text NOT NULL,
	`processed` integer DEFAULT false,
	`processing_error` text,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL
);
