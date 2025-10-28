import { randomUUID } from 'crypto';
import pool from '../config/database';
import { Booking, BookingRequest } from '../types/index';
import { createError } from '../middleware/errorHandler';
import { ExperienceService } from './experienceService';
import { PromoService } from './promoService';

export class BookingService {
    private experienceService = new ExperienceService();
    private promoService = new PromoService();

    async createBooking(bookingData: BookingRequest): Promise<Booking> {
        const client = await pool.connect();

        try {
            console.log('🎫 Creating booking with data:', bookingData);
            await client.query('BEGIN');

            // Validate experience exists
            const experience = await this.experienceService.getExperienceById(bookingData.experienceId);
            if (!experience) {
                throw createError('Experience not found', 404);
            }
            console.log('✅ Experience found:', experience.title);

            // Validate slot exists and has availability
            const slot = await this.experienceService.getSlotById(bookingData.slotId);
            if (!slot) {
                throw createError('Slot not found', 404);
            }
            console.log('✅ Slot found:', slot.date, slot.time);

            const availableSlots = slot.total_slots - slot.booked_slots;
            if (availableSlots < bookingData.participants) {
                throw createError('Not enough slots available', 400);
            }
            console.log(`✅ Slot availability: ${availableSlots} available, ${bookingData.participants} requested`);

            // Calculate total amount
            const baseAmount = experience.price * bookingData.participants;
            let discountAmount = 0;
            let totalAmount = baseAmount;
            console.log(`💰 Base amount: ₹${baseAmount}`);

            // Apply promo code if provided
            if (bookingData.promoCode) {
                console.log(`🎟️ Applying promo code: ${bookingData.promoCode}`);
                const promoDiscount = await this.promoService.validateAndCalculateDiscount(
                    bookingData.promoCode,
                    baseAmount
                );
                discountAmount = promoDiscount;
                totalAmount = baseAmount - discountAmount;
                console.log(`💸 Discount applied: ₹${discountAmount}, Final amount: ₹${totalAmount}`);
            }

            // Create booking
            const bookingId = randomUUID();
            console.log('🆔 Generated booking ID:', bookingId);

            const booking: Booking = {
                id: bookingId,
                experience_id: bookingData.experienceId,
                slot_id: bookingData.slotId,
                user_name: bookingData.userName,
                user_email: bookingData.userEmail,
                user_phone: bookingData.userPhone,
                participants: bookingData.participants,
                promo_code: bookingData.promoCode,
                discount_amount: discountAmount,
                total_amount: totalAmount,
                status: 'confirmed'
            };

            console.log('📝 Inserting booking into database...');
            await client.query(
                `INSERT INTO bookings (id, experience_id, slot_id, user_name, user_email, user_phone, 
         participants, promo_code, discount_amount, total_amount, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                [
                    booking.id,
                    booking.experience_id,
                    booking.slot_id,
                    booking.user_name,
                    booking.user_email,
                    booking.user_phone,
                    booking.participants,
                    booking.promo_code,
                    booking.discount_amount,
                    booking.total_amount,
                    booking.status
                ]
            );
            console.log('✅ Booking inserted successfully');

            // Update slot availability within the same transaction
            console.log('🔄 Updating slot availability...');
            await client.query(
                'UPDATE experience_slots SET booked_slots = booked_slots + $1 WHERE id = $2',
                [bookingData.participants, bookingData.slotId]
            );
            console.log('✅ Slot availability updated');

            await client.query('COMMIT');
            console.log('✅ Transaction committed');

            // Return booking with timestamps
            const result = await pool.query(
                'SELECT * FROM bookings WHERE id = $1',
                [bookingId]
            );

            console.log('🎉 Booking created successfully:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getBookingById(id: string): Promise<Booking | null> {
        try {
            const result = await pool.query(
                `SELECT b.*, e.title as experience_title, e.location as experience_location,
         es.date, es.time
         FROM bookings b
         JOIN experiences e ON b.experience_id = e.id
         JOIN experience_slots es ON b.slot_id = es.id
         WHERE b.id = $1`,
                [id]
            );

            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error('Error fetching booking by ID:', error);
            throw createError('Failed to fetch booking details', 500);
        }
    }

    async getBookingsByEmail(email: string): Promise<Booking[]> {
        try {
            const result = await pool.query(
                `SELECT b.*, e.title as experience_title, e.location as experience_location,
         es.date, es.time
         FROM bookings b
         JOIN experiences e ON b.experience_id = e.id
         JOIN experience_slots es ON b.slot_id = es.id
         WHERE b.user_email = $1
         ORDER BY b.created_at DESC`,
                [email]
            );

            return result.rows;
        } catch (error) {
            console.error('Error fetching bookings by email:', error);
            throw createError('Failed to fetch user bookings', 500);
        }
    }

    async cancelBooking(id: string): Promise<boolean> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Get booking details
            const bookingResult = await client.query(
                'SELECT * FROM bookings WHERE id = $1 AND status = $2',
                [id, 'confirmed']
            );

            if (bookingResult.rows.length === 0) {
                throw createError('Booking not found or already cancelled', 404);
            }

            const booking = bookingResult.rows[0];

            // Update booking status
            await client.query(
                'UPDATE bookings SET status = $1 WHERE id = $2',
                ['cancelled', id]
            );

            // Release the slots
            await client.query(
                'UPDATE experience_slots SET booked_slots = booked_slots - $1 WHERE id = $2',
                [booking.participants, booking.slot_id]
            );

            await client.query('COMMIT');
            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}