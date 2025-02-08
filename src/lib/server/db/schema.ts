import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Users table: holds user info and subscription tier.
export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	name: text("name"),
	// Use 'free' by default; switch to 'paid' when the user subscribes.
	plan: text("plan").notNull().default("free"),
	// Timestamps stored as text; you can also use a proper timestamp type if available.
	createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull(),
	expiresAt: text("expires_at").notNull(),
});

// API Keys table: allows paid users to obtain a secure key to access the API.
export const apiKeys = sqliteTable("api_keys", {
	id: integer("id").primaryKey(),
	userId: integer("user_id").notNull(),
	key: text("key").notNull().unique(),
	createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
	// This field is optional – a non-null value can indicate that the key has been revoked.
	revokedAt: text("revoked_at"),
});

// Contacts table: example table for storing a user’s personal connections.
export const contacts = sqliteTable("contacts", {
	id: integer("id").primaryKey(),
	userId: integer("user_id").notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	email: text("email"),
	phone: text("phone"),
	notes: text("notes"),
	createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// This table stores subscription data received from Lemon Squeezy.
export const subscriptions = sqliteTable("subscriptions", {
	id: integer("id").primaryKey(),
	// The unique subscription ID from Lemon Squeezy.
	lemonSqueezySubscriptionId: text("lemon_squeezy_subscription_id")
		.notNull()
		.unique(),
	// The order ID from Lemon Squeezy for this subscription.
	lemonSqueezyOrderId: text("lemon_squeezy_order_id").notNull(),
	// A reference to your local user (assumes a users table exists).
	userId: integer("user_id").notNull(),
	// The plan identifier or name. You might also use a foreign key if you have a separate 'plans' table.
	plan: text("plan").notNull(),
	// Status information as returned by Lemon Squeezy.
	status: text("status").notNull(),
	statusFormatted: text("status_formatted").notNull(),
	// Renewal and trial dates (stored as ISO strings or timestamps as needed).
	renewsAt: text("renews_at"),
	endsAt: text("ends_at"),
	trialEndsAt: text("trial_ends_at"),
	// Pricing information (stored as a string to preserve formatting or as an integer in cents).
	price: text("price").notNull(),
	// Flags to indicate if the plan is usage-based and/or if the subscription is currently paused.
	isUsageBased: integer("is_usage_based", { mode: "boolean" }).default(false),
	isPaused: integer("is_paused", { mode: "boolean" }).default(false),
	// Optionally, if Lemon Squeezy provides a subscription item ID.
	subscriptionItemId: integer("subscription_item_id"),
	// Timestamps for record keeping.
	createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: text("updated_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

// (Optional) This table logs webhook events sent by Lemon Squeezy.
export const webhookEvents = sqliteTable("webhook_events", {
	id: integer("id").primaryKey(),
	// The name of the event (e.g. "subscription_created", "subscription_updated").
	eventName: text("event_name").notNull(),
	// Store the raw payload as text (you can also use JSON if your DB supports it).
	payload: text("payload").notNull(),
	// A flag indicating whether you’ve processed this event.
	processed: integer("processed", { mode: "boolean" }).default(false),
	// Optional field to log any errors encountered during processing.
	processingError: text("processing_error"),
	createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
