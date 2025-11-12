import express from 'express'
import cors from 'cors'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

// --- POST: Save a new booking ---
app.post('/api/book', async (req, res) => {
  const { date, startSlot, endSlot, totalPrice, name, contactNumber, email } = req.body

  try {
    const query = `
      INSERT INTO bookings (date, start_slot, end_slot, total_price, name, contact_number, email, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `
    await pool.query(query, [
      date,
      JSON.stringify(startSlot),
      JSON.stringify(endSlot),
      totalPrice,
      name,
      contactNumber,
      email,
      'pending',
    ])

    res.status(200).json({ message: 'Booking saved successfully!' })
  } catch (err) {
    console.error('Error saving booking:', err)
    res.status(500).json({ error: 'Failed to save booking.' })
  }
})

// --- GET: Fetch all bookings ---
app.get('/api/book', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY date DESC')
    res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching bookings:', err)
    res.status(500).json({ error: 'Failed to fetch bookings.' })
  }
})

// --- GET: Fetch booking by ID ---
app.get('/api/book/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('Error fetching booking by ID:', err)
    res.status(500).json({ error: 'Failed to fetch booking.' })
  }
})

// --- PUT: Update booking status ---
app.put('/api/book/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!status) {
    return res.status(400).json({ error: 'Status is required' })
  }

  try {
    const result = await pool.query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [
      status,
      id,
    ])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res
      .status(200)
      .json({ message: 'Booking status updated successfully', booking: result.rows[0] })
  } catch (err) {
    console.error('Error updating booking status:', err)
    res.status(500).json({ error: 'Failed to update booking status.' })
  }
})

app.listen(3002, () => console.log('Server is running.'))
