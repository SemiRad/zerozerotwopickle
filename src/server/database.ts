import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

/* INITIALIZE TABLE */
const createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      date TIMESTAMP NOT NULL,
      timeSlots JSONB NOT NULL,
      totalPrice REAL NOT NULL,
      name TEXT,
      contactNumber TEXT,
      email TEXT,
      status TEXT CHECK (status IN ('pending', 'available', 'reserved', 'rejected')) DEFAULT 'pending',
      createdAt TIMESTAMPTZ DEFAULT NOW()
    );
  `)
  // console.log('Bookings table is ready')
}

createTable().catch(console.error)

export default pool
