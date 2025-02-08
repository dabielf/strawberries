import { drizzle } from "drizzle-orm/d1";
import { getPlatformProxy } from "wrangler";

// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// const client = createClient({ url: env.DATABASE_URL });
const { env } = await getPlatformProxy();
export const db = drizzle(env.DB as D1Database);
