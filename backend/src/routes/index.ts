import { Router } from 'express';
import experiencesRouter from './experiences';
import bookingsRouter from './bookings';
import promoRouter from './promo';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'BookIt API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/experiences', experiencesRouter);
router.use('/bookings', bookingsRouter);
router.use('/promo', promoRouter);

export default router;