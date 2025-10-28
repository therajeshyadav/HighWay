import pool from '../config/database.js';
import { Experience, ExperienceSlot, ExperienceWithSlots } from '../types/index.js';
import { createError } from '../middleware/errorHandler.js';

export class ExperienceService {
  async getAllExperiences(): Promise<Experience[]> {
    try {
      console.log('🔍 Fetching all experiences from database...');
      const result = await pool.query(
        'SELECT * FROM experiences ORDER BY created_at DESC'
      );
      console.log(`✅ Found ${result.rows.length} experiences`);
      return result.rows;
    } catch (error) {
      console.error('❌ Error fetching experiences:', error);
      throw createError('Failed to fetch experiences', 500);
    }
  }

  async getExperienceById(id: string): Promise<ExperienceWithSlots | null> {
    try {
      // Get experience details
      const experienceResult = await pool.query(
        'SELECT * FROM experiences WHERE id = $1',
        [id]
      );

      if (experienceResult.rows.length === 0) {
        return null;
      }

      const experience = experienceResult.rows[0];

      // Get available slots
      const slotsResult = await pool.query(
        `SELECT id, date, time, total_slots, booked_slots 
         FROM experience_slots 
         WHERE experience_id = $1 
         ORDER BY date, time`,
        [id]
      );

      // Group slots by date
      const slotsByDate: { [key: string]: { time: string; slotsLeft: number; slotId: string }[] } = {};
      
      slotsResult.rows.forEach((slot: ExperienceSlot) => {
        if (!slotsByDate[slot.date]) {
          slotsByDate[slot.date] = [];
        }
        
        const slotsLeft = slot.total_slots - slot.booked_slots;
        slotsByDate[slot.date].push({
          time: slot.time,
          slotsLeft: Math.max(0, slotsLeft),
          slotId: slot.id
        });
      });

      // Convert to the expected format
      const availableDates = Object.keys(slotsByDate);
      const availableTimes = slotsByDate[availableDates[0]] || [];

      return {
        ...experience,
        availableDates,
        availableTimes
      };
    } catch (error) {
      console.error('Error fetching experience by ID:', error);
      throw createError('Failed to fetch experience details', 500);
    }
  }

  async getExperienceSlots(experienceId: string, date?: string): Promise<ExperienceSlot[]> {
    try {
      let query = `
        SELECT id, experience_id, date, time, total_slots, booked_slots 
        FROM experience_slots 
        WHERE experience_id = $1
      `;
      const params = [experienceId];

      if (date) {
        query += ' AND date = $2';
        params.push(date);
      }

      query += ' ORDER BY date, time';

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error fetching experience slots:', error);
      throw createError('Failed to fetch experience slots', 500);
    }
  }

  async getSlotById(slotId: string): Promise<ExperienceSlot | null> {
    try {
      const result = await pool.query(
        'SELECT * FROM experience_slots WHERE id = $1',
        [slotId]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error fetching slot by ID:', error);
      throw createError('Failed to fetch slot details', 500);
    }
  }

  async updateSlotBooking(slotId: string, participants: number): Promise<boolean> {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Get current slot info
      const slotResult = await client.query(
        'SELECT total_slots, booked_slots FROM experience_slots WHERE id = $1 FOR UPDATE',
        [slotId]
      );

      if (slotResult.rows.length === 0) {
        throw createError('Slot not found', 404);
      }

      const slot = slotResult.rows[0];
      const availableSlots = slot.total_slots - slot.booked_slots;

      if (availableSlots < participants) {
        throw createError('Not enough slots available', 400);
      }

      // Update booked slots
      await client.query(
        'UPDATE experience_slots SET booked_slots = booked_slots + $1 WHERE id = $2',
        [participants, slotId]
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