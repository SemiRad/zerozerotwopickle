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

app.post('/api/book', async (req, res) => {
  const { date, timeSlots, totalPrice, name, contactNumber, email } = req.body

  try {
    const query = `
      insert into bookings (date, time_slots, total_price, name, contact_number, email, status)
      values ($1, $2, $3, $4, $5, $6, $7)
    `

    await pool.query(query, [
      date,
      JSON.stringify(timeSlots),
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

app.listen(3002, () => console.log('Server is running.'))
