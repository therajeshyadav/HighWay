import { Router } from 'express';
import { BookingService } from '../services/bookingService';
import { validateBooking } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';

const router = Router();
const bookingService = new BookingService();

// POST /bookings - Create a new booking
router.post('/', validateBooking, async (req, res, next) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
});

// GET /bookings/:id - Get booking by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    
    if (!booking) {
      throw createError('Booking not found', 404);
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
});

// GET /bookings/user/:email - Get bookings by user email
router.get('/user/:email', async (req, res, next) => {
  try {
    const { email } = req.params;
    const bookings = await bookingService.getBookingsByEmail(email);
    
    res.json({
      success: true,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
});

// PUT /bookings/:id/cancel - Cancel a booking
router.put('/:id/cancel', async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await bookingService.cancelBooking(id);
    
    if (!success) {
      throw createError('Failed to cancel booking', 400);
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;