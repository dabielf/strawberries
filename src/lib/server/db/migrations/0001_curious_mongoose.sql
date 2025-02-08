PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_api_keys` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`key` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`revoked_at` text
);
--> statement-breakpoint
INSERT INTO `__new_api_keys`("id", "user_id", "key", "created_at", "revoked_at") SELECT "id", "user_id", "key", "created_at", "revoked_at" FROM `api_keys`;--> statement-breakpoint
DROP TABLE `api_keys`;--> statement-breakpoint
ALTER TABLE `__new_api_keys` RENAME TO `api_keys`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `api_keys_key_unique` ON `api_keys` (`key`);--> statement-breakpoint
CREATE TABLE `__new_contacts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text,
	`phone` text,
	`notes` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_contacts`("id", "user_id", "first_name", "last_name", "email", "phone", "notes", "created_at") SELECT "id", "user_id", "first_name", "last_name", "email", "phone", "notes", "created_at" FROM `contacts`;--> statement-breakpoint
DROP TABLE `contacts`;--> statement-breakpoint
ALTER TABLE `__new_contacts` RENAME TO `contacts`;--> statement-breakpoint
CREATE TABLE `__new_subscriptions` (
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
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_subscriptions`("id", "lemon_squeezy_subscription_id", "lemon_squeezy_order_id", "user_id", "plan", "status", "status_formatted", "renews_at", "ends_at", "trial_ends_at", "price", "is_usage_based", "is_paused", "subscription_item_id", "created_at", "updated_at") SELECT "id", "lemon_squeezy_subscription_id", "lemon_squeezy_order_id", "user_id", "plan", "status", "status_formatted", "renews_at", "ends_at", "trial_ends_at", "price", "is_usage_based", "is_paused", "subscription_item_id", "created_at", "updated_at" FROM `subscriptions`;--> statement-breakpoint
DROP TABLE `subscriptions`;--> statement-breakpoint
ALTER TABLE `__new_subscriptions` RENAME TO `subscriptions`;--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_lemon_squeezy_subscription_id_unique` ON `subscriptions` (`lemon_squeezy_subscription_id`);--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hashed_password` text NOT NULL,
	`name` text,
	`plan` text DEFAULT 'free' NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "email", "hashed_password", "name", "plan", "created_at", "updated_at") SELECT "id", "email", "hashed_password", "name", "plan", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_webhook_events` (
	`id` integer PRIMARY KEY NOT NULL,
	`event_name` text NOT NULL,
	`payload` text NOT NULL,
	`processed` integer DEFAULT false,
	`processing_error` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_webhook_events`("id", "event_name", "payload", "processed", "processing_error", "created_at") SELECT "id", "event_name", "payload", "processed", "processing_error", "created_at" FROM `webhook_events`;--> statement-breakpoint
DROP TABLE `webhook_events`;--> statement-breakpoint
ALTER TABLE `__new_webhook_events` RENAME TO `webhook_events`;