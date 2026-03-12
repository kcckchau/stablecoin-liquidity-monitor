// Environment variable configuration and validation
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // External API Keys
  DEFILLAMA_API_KEY: process.env.DEFILLAMA_API_KEY || "",
  CRYPTOQUANT_API_KEY: process.env.CRYPTOQUANT_API_KEY || "",
  GLASSNODE_API_KEY: process.env.GLASSNODE_API_KEY || "",

  // Cron secret for Vercel
  CRON_SECRET: process.env.CRON_SECRET || "",

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;

// Validation (optional, can be enhanced)
export function validateEnv() {
  if (!env.DATABASE_URL) {
    console.warn("Warning: DATABASE_URL is not set");
  }
  // Add more validation as needed
}
