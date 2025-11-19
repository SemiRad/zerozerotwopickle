import type { VercelRequest, VercelResponse } from '@vercel/node'

import { Resend } from 'resend';

import pool from '../../src/server/database.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const resend = new Resend(process.env.RESEND_API_KEY)

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { bookingId } = req.body

    if (!bookingId)
        return res.status(400).json({ error: 'Missing bookingId' })

    try {
        const { rows } = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [bookingId]
        )

        if (rows.length === 0)
        return res.status(404).json({ error: 'Booking not found' })

        const booking = rows[0]

        const bookingDate = new Date(booking.date)
        const options: Intl.DateTimeFormatOptions = {
        weekday: 'short', 
        year: 'numeric',
        month: 'short',
        day: '2-digit'
        }
        const formattedDate = bookingDate.toLocaleDateString('en-US', options) 

        await resend.emails.send({
            from: "noreply <onboarding@resend.dev>",
            to: booking.email,
            subject: 'ZeroZeroTwoPickleball Booking',
            html: `
                <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
                <tr>
                    <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); overflow: hidden;">
                        <!-- Logo -->
                        <tr>
                        <td align="center" style="padding: 20px;">
                            <img src="https://zerozerotwopickle.vercel.app/zzt1.png" alt="Logo" width="120" style="display: block;" />
                        </td>
                        </tr>

                        <!-- Heading -->
                        <tr>
                        <td style="padding: 0 30px 10px 30px; text-align: center;">
                            <h2 style="color: #333333; margin: 0;">Your booking has been received!</h2>
                        </td>
                        </tr>

                        <!-- Greeting -->
                        <tr>
                        <td style="padding: 0 30px 20px 30px; color: #555555;">
                            <p style="margin: 0;">Hi <strong>${booking.name}</strong>,</p>
                            <p style="margin: 8px 0 0 0;">We have received your booking for <strong>${formattedDate}</strong>.</p>
                        </td>
                        </tr>

                        <!-- Booking Details -->
                        <tr>
                        <td style="padding: 0 30px 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e0e0e0; border-radius: 6px;">
                            <tr>
                                <td style="padding: 10px; font-weight: bold; background-color: #f5f5f5;">Duration</td>
                                <td style="padding: 10px;">${booking.start_slot.label.split('-')[0]} - ${booking.end_slot.label.split('-')[1]}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; font-weight: bold; background-color: #f5f5f5;">Total Price</td>
                                <td style="padding: 10px;">₱${booking.total_price}</td>
                            </tr>
                            </table>
                        </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                        <td style="padding: 0 30px 30px 30px; color: #888888; font-size: 12px; text-align: center;">
                            <p style="margin: 0; font-weight: bold">We will notify you once your booking is confirmed.</p>
                            <p style="margin: 5px 0 0 0;">This is an automated email. Please do not reply.</p>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                </table>
                `
        });

        return res.status(200).json({ message: 'Email sent successfully!' })
    } catch (err) {
        console.error('Error sending booking confirmation email:', err)
        return res.status(500).json({ error: 'Failed to send email.' })
    }
}

