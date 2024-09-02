import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema"; // Import the generated schema

config({ path: ".env" });

export const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client, { schema }); // Pass the schema to drizzle
