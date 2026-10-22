import { defineConfig } from "drizzle-kit";

try {
  process.loadEnvFile();
} catch {
  // .env is optional; real env vars may come from the environment
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
