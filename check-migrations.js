import "dotenv/config";
import pg from "pg";

const client = new pg.Client({
  connectionString: process.env.DIRECT_URL,
});

await client.connect();

const result = await client.query(`
  SELECT to_regclass('public."ActivityLog"') AS table_name;
`);

console.table(result.rows);

await client.end();