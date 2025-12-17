import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL as string;

if (!connectionString || connectionString.length === 0) {
  throw new Error("DB connection string is empty");
}

export const client = postgres(connectionString, {
  prepare: false,
  idle_timeout: 30, // Connection idle timeout (30 seconds)
  max: 10, // Maximum number of connections in pool
  connect_timeout: 15, // Connection establishment timeout (15 seconds)
});

export const db = drizzle({ client });
