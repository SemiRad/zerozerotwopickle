import type { VercelRequest, VercelResponse } from '@vercel/node'
import pool from '../../src/server/database.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { date } = req.query

  if (!date) return res.status(400).json({ error: 'Missing ?date=YYYY-MM-DD' })

  try {
    const result = await pool.query(
      `SELECT * 
      FROM bookings 
      WHERE date = $1 
      AND status IN ('pending', 'reserved')
      ORDER BY start_slot ASC`,
      [date],
    )

    return res.status(200).json(result.rows)
  } catch (err) {
    console.error('Error fetching bookings:', err)
    return res.status(500).json({ error: 'Failed to load bookings.' })
  }
}
