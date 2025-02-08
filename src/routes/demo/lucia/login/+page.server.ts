import { encodeBase32LowerCase } from "@oslojs/encoding";
import { fail, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import * as auth from "$lib/server/auth";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";

// Crypto configuration
const ITERATIONS = 600000; // High number of iterations for security
const SALT_LENGTH = 16;
const KEY_LENGTH = 32;

async function hashPassword(password: string): Promise<string> {
	// Generate a random salt
	const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

	// Convert password to buffer
	const enc = new TextEncoder();
	const passwordBuffer = enc.encode(password);

	// Generate key using PBKDF2
	const key = await crypto.subtle.importKey(
		"raw",
		passwordBuffer,
		"PBKDF2",
		false,
		["deriveBits"],
	);

	const hash = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: ITERATIONS,
			hash: "SHA-256",
		},
		key,
		KEY_LENGTH * 8,
	);

	// Combine salt and hash
	const hashArray = new Uint8Array(hash);
	const combined = new Uint8Array(salt.length + hashArray.length);
	combined.set(salt);
	combined.set(hashArray, salt.length);

	// Convert to base64 for storage
	return btoa(String.fromCharCode(...combined));
}

async function verifyPassword(
	storedHash: string,
	password: string,
): Promise<boolean> {
	try {
		// Decode the stored hash
		const combined = new Uint8Array(
			atob(storedHash)
				.split("")
				.map((char) => char.charCodeAt(0)),
		);

		// Extract salt and hash
		const salt = combined.slice(0, SALT_LENGTH);
		const originalHash = combined.slice(SALT_LENGTH);

		// Convert password to buffer
		const enc = new TextEncoder();
		const passwordBuffer = enc.encode(password);

		// Import key
		const key = await crypto.subtle.importKey(
			"raw",
			passwordBuffer,
			"PBKDF2",
			false,
			["deriveBits"],
		);

		// Generate hash with same salt
		const newHash = await crypto.subtle.deriveBits(
			{
				name: "PBKDF2",
				salt: salt,
				iterations: ITERATIONS,
				hash: "SHA-256",
			},
			key,
			KEY_LENGTH * 8,
		);

		// Compare hashes
		const newHashArray = new Uint8Array(newHash);
		if (originalHash.length !== newHashArray.length) {
			return false;
		}

		return originalHash.every((value, index) => value === newHashArray[index]);
	} catch (error) {
		console.error("Error verifying password:", error);
		return false;
	}
}

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, "/demo/lucia");
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email");
		const password = formData.get("password");

		if (!validateEmail(email)) {
			return fail(400, {
				message: "Invalid email",
			});
		}
		if (!validatePassword(password)) {
			return fail(400, {
				message: "Invalid password (min 6, max 255 characters)",
			});
		}

		const results = await db
			.select()
			.from(table.users)
			.where(eq(table.users.email, email));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: "Incorrect username or password" });
		}

		const validPassword = await verifyPassword(
			existingUser.passwordHash,
			password,
		);
		if (!validPassword) {
			return fail(400, { message: "Incorrect username or password" });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(
			event,
			sessionToken,
			new Date(session.expiresAt),
		);

		return redirect(302, "/demo/lucia");
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get("email");
		const password = formData.get("password");

		if (!validateEmail(email)) {
			return fail(400, { message: "Invalid email" });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: "Invalid password" });
		}

		const userId = generateUserId();
		const passwordHash = await hashPassword(password);

		try {
			await db.insert(table.users).values({ id: userId, email, passwordHash });

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, userId);
			auth.setSessionTokenCookie(
				event,
				sessionToken,
				new Date(session.expiresAt),
			);
		} catch (e) {
			console.error(e);
			return fail(500, { message: "An error has occurred" });
		}
		return redirect(302, "/demo/lucia");
	},
};

function generateUserId() {
	// ID with 120 bits of entropy, or about the same as UUID v4.
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	const id = encodeBase32LowerCase(bytes);
	return id;
}

function validateEmail(email: unknown): email is string {
	return (
		typeof email === "string" &&
		email.length > 0 &&
		/^[a-z0-9._-]+@[a-z0-9.-]+$/.test(email)
	);
}

function validatePassword(password: unknown): password is string {
	return (
		typeof password === "string" &&
		password.length >= 6 &&
		password.length <= 255
	);
}
