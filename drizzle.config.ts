import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/neon.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;