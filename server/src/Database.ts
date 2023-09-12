import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
