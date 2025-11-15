import type { VercelRequest, VercelResponse } from '@vercel/node'
import pool from '../../src/server/database.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Fetch all bookings
    try {
      const result = await pool.query('SELECT * FROM bookings ORDER BY date DESC')
      return res.status(200).json(result.rows)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      return res.status(500).json({ error: 'Failed to fetch bookings.' })
    }
  }

  if (req.method === 'POST') {
    // Save a new booking
    const { date, startSlot, endSlot, totalPrice, name, contactNumber, email } = req.body

    try {
      const query = `
        INSERT INTO bookings (date, start_slot, end_slot, total_price, name, contact_number, email, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      `
      await pool.query(query, [
        date,
        JSON.stringify(startSlot),
        JSON.stringify(endSlot),
        totalPrice,
        name,
        contactNumber,
        email,
      ])
      return res.status(200).json({ message: 'Booking saved successfully!' })
    } catch (err) {
      console.error('Error saving booking:', err)
      return res.status(500).json({ error: 'Failed to save booking.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
