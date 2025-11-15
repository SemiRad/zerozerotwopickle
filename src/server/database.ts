import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

/* INITIALIZE TABLE */
const createTable = async () => {
  await pool.query(`
    CREATE TABLE bookings (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      start_slot JSONB,
      end_slot JSONB,
      total_price NUMERIC(10, 2),
      name TEXT,
      contact_number TEXT,
      email TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT (NOW() AT TIME ZONE 'Asia/Manila')
    );
  `)
}

createTable().catch(console.error)

export default pool
