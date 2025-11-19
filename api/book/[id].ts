import type { VercelRequest, VercelResponse } from '@vercel/node'
import pool from '../../src/server/database.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id])
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }
      return res.status(200).json(result.rows[0])
    } catch (err) {
      console.error('Error fetching booking by ID:', err)
      return res.status(500).json({ error: 'Failed to fetch booking.' })
    }
  }

  if (req.method === 'PUT') {
    const { status } = req.body
    if (!status) return res.status(400).json({ error: 'Status is required' })

    try {
      const result = await pool.query('UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *', [
        status,
        id,
      ])

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Booking not found' })
      }

      return res.status(200).json({
        message: 'Booking status updated successfully',
        booking: result.rows[0],
      })
    } catch (err) {
      console.error('Error updating booking status:', err)
      return res.status(500).json({ error: 'Failed to update booking status.' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
